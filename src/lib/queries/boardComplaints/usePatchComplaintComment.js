import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchComplaintComment } from '@/apis/boardComplaints.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePatchComplaintComment = (aptUuid, complaintUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: patchComplaintPostCommentMutation,
    isPending: isPatchComplaintPostCommentPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (data) => {
      const request = {};

      // content가 있을 때만 파라미터 추가
      if (data.content) {
        request.content = data.content;
      }

      // imageFileUuid가 있을 때만 파라미터 추가
      if (data.imageFileUuid) {
        request.complaintCommentFileUuid = data.imageFileUuid;
      }

      return patchComplaintComment({
        aptUuid,
        complaintUuid,
        commentUuid: data.commentUuid,
        request,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['complaintPostCommentList', aptUuid, complaintUuid],
      });
      swalSuccessModal({
        text: '댓글이 수정되었습니다.',
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
    patchComplaintPostCommentMutation,
    isPatchComplaintPostCommentPending,
    isError,
    error,
  };
};

export default usePatchComplaintComment;
