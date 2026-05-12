import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchRejectApproval } from '@/apis/parkingBlacklistReject.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePatchRejectApproval = (rejectUuid) => {
  const queryClient = useQueryClient();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: patchRejectApprovalMutationAsync,
    isPending: isRejectApprovalPending,
    isError: isRejectApprovalError,
    error: rejectApprovalError,
  } = useMutation({
    mutationFn: () => patchRejectApproval(rejectUuid),
    onSuccess: () => {
      queryClient.invalidateQueries(['rejectCarDetail', rejectUuid]);
      swalSuccessModal({
        text: '주차 거부 해제 승인되었습니다.',
      });
      navigateTo('/parking/restriction/parking-reject');
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({ text: message || '주차 거부 해제에 실패했습니다.' });
    },
  });

  return {
    patchRejectApprovalMutationAsync,
    isRejectApprovalPending,
    isRejectApprovalError,
    rejectApprovalError,
  };
};

export default usePatchRejectApproval;
