import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchComplaintState } from '@/apis/boardComplaints.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

// 민원 상태 일괄 변경
const usePatchComplaintStateBundle = (aptUuid) => {
  const queryClient = useQueryClient();

  const createBulkStatusMutation = (targetStatus) => {
    return useMutation({
      mutationFn: async (data) => {
        if (Array.isArray(data) && data.length > 1) {
          await Promise.all(
            data.map((complaintUuid) =>
              patchComplaintState(aptUuid, complaintUuid, {
                status: targetStatus,
              }),
            ),
          );
        } else if (Array.isArray(data) && data.length === 1) {
          await patchComplaintState(aptUuid, data[0], {
            status: targetStatus,
          });
        } else {
          throw new Error('Invalid data');
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['complaintPostList', aptUuid],
        });
        swalSuccessModal({ text: '민원 상태가 변경되었습니다.' });
      },
    });
  };

  const bulkReceivedMutation = createBulkStatusMutation('RECEIVED');
  const bulkInProgressMutation = createBulkStatusMutation('IN_PROGRESS');
  const bulkCompletedMutation = createBulkStatusMutation('COMPLETED');

  return {
    bulkReceivedMutation: bulkReceivedMutation.mutateAsync,
    bulkInProgressMutation: bulkInProgressMutation.mutateAsync,
    bulkCompletedMutation: bulkCompletedMutation.mutateAsync,
    isBulkReceivedLoading: bulkReceivedMutation.isLoading,
    isBulkInProgressLoading: bulkInProgressMutation.isLoading,
    isBulkCompletedLoading: bulkCompletedMutation.isLoading,
    isBulkReceivedError: bulkReceivedMutation.isError,
    isBulkInProgressError: bulkInProgressMutation.isError,
    isBulkCompletedError: bulkCompletedMutation.isError,
    bulkReceivedError: bulkReceivedMutation.error,
    bulkInProgressError: bulkInProgressMutation.error,
    bulkCompletedError: bulkCompletedMutation.error,
  };
};

export default usePatchComplaintStateBundle;
