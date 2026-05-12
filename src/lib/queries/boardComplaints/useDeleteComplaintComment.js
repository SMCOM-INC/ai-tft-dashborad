import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteComplaintComment } from '@/apis/boardComplaints.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const useDeleteComplaintComment = (aptUuid, complaintUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteComplaintPostPostCommentMutation,
    isPending: isdeleteComplaintPostPostCommentPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (commentUuid) =>
      deleteComplaintComment(aptUuid, complaintUuid, commentUuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['complaintPostCommentList', aptUuid, complaintUuid],
      });
      swalSuccessModal({
        text: '댓글이 삭제되었습니다.',
      });
    },
    onError: (errorData) => {
      const { message } = errorData.data.error;
      swalErrorModal({
        text: message,
      });
    },
  });

  return {
    deleteComplaintPostPostCommentMutation,
    isdeleteComplaintPostPostCommentPending,
    isError,
    error,
  };
};

export default useDeleteComplaintComment;
