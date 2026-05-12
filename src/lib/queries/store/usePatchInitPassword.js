import { useMutation } from '@tanstack/vue-query';

import { patchInitPassword } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePatchInitPassword = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    mutateAsync: patchInitPasswordMutationAsync,
    isPending: isPatchInitPasswordPending,
  } = useMutation({
    mutationFn: ({ password }) => {
      return patchInitPassword({
        aptUuid: userInfo.aptUuid,
        storeUuid: getParams().uuid,
        password: password.trim(),
      });
    },
    onSuccess: () => {
      swalSuccessModal({ text: '비밀번호가 초기화되었습니다.' });
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
    patchInitPasswordMutationAsync,
    isPatchInitPasswordPending,
  };
};

export default usePatchInitPassword;
