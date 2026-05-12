import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchResidentState } from '@/apis/member.js';
import { ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_NAMES } from '@/constants/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePatchResidentState = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    mutateAsync: patchResidentStateMutationAsync,
    isPending: isPatchResidentStatePending,
    isError: isPatchResidentStateError,
    error: patchResidentStateError,
    isSuccess: isPatchResidentStateSuccess,
  } = useMutation({
    mutationFn: ({ residentState }) => {
      return patchResidentState({
        aptUuid: userInfo.aptUuid,
        residentUuid: getParams().uuid,
        residentState,
      });
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ['residentDetail'],
      });

      swalSuccessModal({
        text: `${ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_NAMES[variable.residentState] || variable.residentState} 상태로 변경되었습니다.`,
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
    patchResidentStateMutationAsync,
    isPatchResidentStatePending,
    isPatchResidentStateError,
    patchResidentStateError,
    isPatchResidentStateSuccess,
  };
};

export default usePatchResidentState;
