import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchCommunityComment } from '@/apis/boardCommunity.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePatchCommunityComment = (aptUuid, communityUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: patchCommunityCommentMutationAsync,
    isPending: isPatchCommunityCommentPending,
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

      return patchCommunityComment({
        aptUuid,
        communityUuid,
        commentUuid: data.commentUuid,
        request,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['communityPostCommentList', aptUuid, communityUuid],
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
    patchCommunityCommentMutationAsync,
    isPatchCommunityCommentPending,
    isError,
    error,
  };
};

export default usePatchCommunityComment;
