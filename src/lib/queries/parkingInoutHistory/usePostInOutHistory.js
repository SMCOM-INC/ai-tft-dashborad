import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postInOutHistory } from '@/apis/parkingInoutHistory.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePostInOutHistory = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const {
    mutateAsync: createInOutHistoryMutationAsync,
    isPending: isCreateInOutHistoryPending,
  } = useMutation({
    mutationFn: (submitValue) => {
      // YYYY-MM-DD 로 변환
      const formatDate = (date) => {
        const offset = date.getTimezoneOffset() * 60 * 1000;
        const utcDate = new Date(date.getTime() - offset);
        return utcDate.toISOString().slice(0, 10);
      };

      const convertedSubmitValue = {
        registType: submitValue.value.registType,
        carNum: submitValue.value.carNum,
        carType: submitValue.value.carType,
        inParkingDateTime: `${formatDate(submitValue.value.openDate)} ${submitValue.value.openHours}:${submitValue.value.openMinutes}:00`,
        outParkingDateTime: `${formatDate(submitValue.value.closeDate)} ${submitValue.value.closeHours}:${submitValue.value.closeMinutes}:00`,
        dong: submitValue.value.dong,
        ho: submitValue.value.ho,
        phone: submitValue.value.phone,
        inLprUuid: submitValue.value.entranceGate,
        outLprUuid: submitValue.value.departureGate,
        memo: submitValue.value.memo,
      };
      if (submitValue.value.visitPurposeUuid) {
        convertedSubmitValue.visitPurposeUuid =
          submitValue.value.visitPurposeUuid;
        convertedSubmitValue.dong = submitValue.value.dong;
        convertedSubmitValue.ho = submitValue.value.ho;
      }
      if (submitValue.value.businessTypeUuid) {
        convertedSubmitValue.businessTypeUuid =
          submitValue.value.businessTypeUuid;
      }

      return postInOutHistory({
        aptUuid: userInfo.aptUuid,
        convertedSubmitValue,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inOutHistoryList']);

      swalSuccessModal({
        text: '입차 생성되었습니다.',
      });
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
    createInOutHistoryMutationAsync,
    isCreateInOutHistoryPending,
  };
};

export default usePostInOutHistory;
