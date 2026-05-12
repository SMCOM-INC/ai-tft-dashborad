import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postComplaintCommentReply } from '@/apis/boardComplaints.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostComplaintCommentReply = (aptUuid, complaintUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: postComplaintPostCommentReplyMutation,
    isPending: isPostComplaintPostCommentReplyPending,
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

      return postComplaintCommentReply({
        aptUuid,
        complaintUuid,
        commentUuid: data.parentUuid,
        request,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['complaintPostCommentList', aptUuid, complaintUuid],
      });
      swalSuccessModal({
        text: '답글이 등록되었습니다.',
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
    postComplaintPostCommentReplyMutation,
    isPostComplaintPostCommentReplyPending,
    isError,
    error,
  };
};

export default usePostComplaintCommentReply;
