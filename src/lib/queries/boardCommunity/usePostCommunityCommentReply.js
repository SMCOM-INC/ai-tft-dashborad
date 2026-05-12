import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postCommunityCommentReply } from '@/apis/boardCommunity.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostCommunityCommentReply = (aptUuid, communityUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: postCommunityCommentReplyMutationAsync,
    isPending: isPostCommunityCommentReplyPending,
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
        request.communityCommentFileUuid = data.imageFileUuid;
      }

      return postCommunityCommentReply({
        aptUuid,
        communityUuid,
        commentUuid: data.parentUuid,
        request,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['communityPostCommentList', aptUuid, communityUuid],
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
    postCommunityCommentReplyMutationAsync,
    isPostCommunityCommentReplyPending,
    isError,
    error,
  };
};

export default usePostCommunityCommentReply;
