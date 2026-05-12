import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchStoreChargeCancel } from '@/apis/store.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePatchStoreChargeCancel = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: patchStoreChargeCancelMutationAsync,
    isPending: isPatchStoreChargeCancelPending,
  } = useMutation({
    mutationFn: ({ chargeUuid }) => {
      return patchStoreChargeCancel({
        aptUuid: userInfo.aptUuid,
        chargeUuid,
      });
    },
    onSuccess: () => {
      swalSuccessModal({ text: '취소처리 되었습니다.' });
      queryClient.invalidateQueries({
        queryKey: ['storeChargeHistory', userInfo.aptUuid],
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
    patchStoreChargeCancelMutationAsync,
    isPatchStoreChargeCancelPending,
  };
};

export default usePatchStoreChargeCancel;
