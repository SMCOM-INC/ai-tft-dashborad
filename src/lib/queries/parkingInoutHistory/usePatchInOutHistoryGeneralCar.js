import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchInOutHistoryGeneralCar } from '@/apis/parkingInoutHistory.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

export const usePatchInOutHistoryGeneralCar = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: patchInOutHistoryGeneralCarMutationAsync,
    isPending: isPatchInOutHistoryGeneralCarPending,
  } = useMutation({
    mutationFn: ({ uuid, dong, ho }) => {
      return patchInOutHistoryGeneralCar({
        aptUuid: userInfo.aptUuid,
        uuid,
        dong,
        ho,
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
    patchInOutHistoryGeneralCarMutationAsync,
    isPatchInOutHistoryGeneralCarPending,
  };
};

export default usePatchInOutHistoryGeneralCar;
