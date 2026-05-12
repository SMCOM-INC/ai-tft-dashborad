import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchStoreChargeComplete } from '@/apis/store.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePatchStoreChargeComplete = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: patchStoreChargeCompleteMutationAsync,
    isPending: isPatchStoreChargeCompletePending,
  } = useMutation({
    mutationFn: ({ chargeUuid }) => {
      return patchStoreChargeComplete({
        aptUuid: userInfo.aptUuid,
        chargeUuid,
      });
    },
    onSuccess: () => {
      swalSuccessModal({ text: '입금완료처리 되었습니다.' });
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
    patchStoreChargeCompleteMutationAsync,
    isPatchStoreChargeCompletePending,
  };
};

export default usePatchStoreChargeComplete;
