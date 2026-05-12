import { useMutation } from '@tanstack/vue-query';

import { deleteStore } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상가 삭제
const useDeleteStore = () => {
  const { userInfo } = useUserInfoStore();
  const { navigateTo, getParams } = useNavigate();

  const { mutate: deleteStoreMutation, isPending: isDeleteStorePending } =
    useMutation({
      mutationFn: () => {
        return deleteStore({
          aptUuid: userInfo.aptUuid,
          storeUuid: getParams().uuid,
        });
      },
      onSuccess: () => {
        swalSuccessModal({ text: '상가가 삭제되었습니다.' });
        navigateTo('/store/management');
      },
      onError: (error) => {
        const { errorCode, message } = error.data.error;
        switch (errorCode) {
          default:
            swalErrorModal({ text: message });
        }
      },
    });

  return { deleteStoreMutation, isDeleteStorePending };
};

export default useDeleteStore;
