import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchInOutHistoryUnknownCar } from '@/apis/parkingInoutHistory.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

export const usePatchInOutHistoryUnknownCar = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: patchInOutHistoryUnknownCarMutationAsync,
    isPending: isPatchInOutHistoryUnknownCarPending,
  } = useMutation({
    mutationFn: ({ uuid, dong, ho, visitPurposeUuid }) => {
      return patchInOutHistoryUnknownCar({
        aptUuid: userInfo.aptUuid,
        uuid,
        dong,
        ho,
        visitPurposeUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inOutHistoryList']);
      swalSuccessModal({ text: '동호수가 수정되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message });
    },
  });

  return {
    patchInOutHistoryUnknownCarMutationAsync,
    isPatchInOutHistoryUnknownCarPending,
  };
};

export default usePatchInOutHistoryUnknownCar;
