import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postNotOutHistoryOutGate } from '@/apis/parkingNotoutHistory.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePostNotOutHistoryOutGate = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: postNotOutHistoryOutGateMutationAsync,
    isPending: isPostNotOutHistoryOutGatePending,
  } = useMutation({
    mutationFn: ({
      inParkingUuid,
      outLprUuid,
      closeDate,
      closeHours,
      closeMinutes,
    }) => {
      // YYYY-MM-DD 로 변환
      const formatDate = (date) => {
        const offset = date.getTimezoneOffset() * 60 * 1000;
        const utcDate = new Date(date.getTime() - offset);
        return utcDate.toISOString().slice(0, 10);
      };

      return postNotOutHistoryOutGate({
        aptUuid: userInfo.aptUuid,
        inParkingUuid,
        outParkingDateTime: `${formatDate(closeDate)} ${closeHours}:${closeMinutes}:00`,
        outLprUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notOutHistoryList']);
      swalSuccessModal({ text: '출차가 생성되었습니다.' });
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
    postNotOutHistoryOutGateMutationAsync,
    isPostNotOutHistoryOutGatePending,
  };
};

export default usePostNotOutHistoryOutGate;
