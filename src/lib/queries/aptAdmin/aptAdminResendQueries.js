import { useMutation, useQuery } from '@tanstack/vue-query';

import {
  getInOutHistoryResend,
  postInOutHistoryResend,
} from '@/apis/parking.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 입출차 재전송 개수 조회
const useGetInOutHistoryResendCount = () => {
  const userInfoStore = useUserInfoStore();

  const {
    data: resendCountData,
    isLoading: isInOutHistoryResendCountLoading,
    isError: isInOutHistoryResendCountError,
    error: inOutHistoryResendCountError,
  } = useQuery({
    queryKey: ['resendCount', userInfoStore.userInfo.aptUuid],
    queryFn: () =>
      getInOutHistoryResend({ aptUuid: userInfoStore.userInfo.aptUuid }),
    select: (data) => {
      return data.data.success;
    },
  });

  return {
    resendCountData,
    isInOutHistoryResendCountLoading,
    isInOutHistoryResendCountError,
    inOutHistoryResendCountError,
  };
};

// 입출차 재전송
const usePostInOutHistoryResend = () => {
  const useInfoStore = useUserInfoStore();

  const {
    mutateAsync: postResendMutation,
    isPending: isResendPending,
    isError: isResendError,
    error: resendError,
    isSuccess: isResendSuccess,
  } = useMutation({
    mutationFn: () =>
      postInOutHistoryResend({ aptUuid: useInfoStore.userInfo.aptUuid }),
    onSuccess: (data, variable) => {
      const formatTime = (seconds) => {
        if (seconds < 60) {
          // 1분 미만
          return `${seconds}초`;
        }

        if (seconds < 3600) {
          // 1시간 미만
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;

          if (remainingSeconds === 0) {
            return `${minutes}분`;
          }
          return `${minutes}분 ${remainingSeconds}초`;
        }
        // 1시간 이상
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (minutes === 0) {
          return `${hours}시간`;
        }
        return `${hours}시간 ${minutes}분`;
      };

      // 서버에서 동기화 데이터 50개마다 처리시간이 30초 걸림
      const calculateProcessingTime = (
        itemCount,
        baseCount = 50,
        baseTime = 30,
      ) => {
        // 필요한 구간 수 계산 (올림, 0은 제외)
        const rangeIndex = Math.ceil(Math.max(1, itemCount) / baseCount);

        // 예상 처리 시간(초) 계산
        const estimatedSeconds = rangeIndex * baseTime;

        // 시간 형식화
        return formatTime(estimatedSeconds);
      };

      if (data.data.success) {
        swalSuccessModal({
          title: `입출차 정보 동기화 시작`,
          html: `입출차 정보 동기화가 시작되었습니다.<br> ${calculateProcessingTime(variable.resendCount)} 후에 다시 새로고침해주세요.`,
        });
      }
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    postResendMutation,
    isResendPending,
    isResendError,
    resendError,
    isResendSuccess,
  };
};

export { usePostInOutHistoryResend, useGetInOutHistoryResendCount };
