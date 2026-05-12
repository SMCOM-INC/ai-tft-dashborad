import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchComplaintState } from '@/apis/boardComplaints.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

// 민원 상태 변경
const usePatchComplaintState = (aptUuid) => {
  const queryClient = useQueryClient();

  const createStatusMutation = (targetStatus) => {
    return useMutation({
      mutationFn: ({ complaintUuid }) =>
        patchComplaintState(aptUuid, complaintUuid, { status: targetStatus }),
      onSuccess: (_, { complaintUuid }) => {
        queryClient.invalidateQueries({
          queryKey: ['complaintPostDetail', aptUuid, complaintUuid],
        });
        queryClient.invalidateQueries({
          queryKey: ['complaintPostList', aptUuid],
        });
        swalSuccessModal({ text: '민원상태가 변경되었습니다.' });
      },
    });
  };

  const receivedMutation = createStatusMutation('RECEIVED');
  const inProgressMutation = createStatusMutation('IN_PROGRESS');
  const completedMutation = createStatusMutation('COMPLETED');

  return {
    receivedMutation: receivedMutation.mutateAsync,
    inProgressMutation: inProgressMutation.mutateAsync,
    completedMutation: completedMutation.mutateAsync,
    isReceivedLoading: receivedMutation.isLoading,
    isInProgressLoading: inProgressMutation.isLoading,
    isCompletedLoading: completedMutation.isLoading,
    isReceivedError: receivedMutation.isError,
    isInProgressError: inProgressMutation.isError,
    isCompletedError: completedMutation.isError,
    receivedError: receivedMutation.error,
    inProgressError: inProgressMutation.error,
    completedError: completedMutation.error,
  };
};

export default usePatchComplaintState;
