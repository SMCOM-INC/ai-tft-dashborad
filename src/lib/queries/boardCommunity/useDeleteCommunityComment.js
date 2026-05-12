import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteCommunityComment } from '@/apis/boardCommunity.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const useDeleteCommunityComment = (aptUuid, communityUuid) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteCommunityCommentMutationAsync,
    isPending: isDeleteCommunityCommentPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (commentUuid) =>
      deleteCommunityComment({ aptUuid, communityUuid, commentUuid }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['communityPostCommentList', aptUuid, communityUuid],
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
    deleteCommunityCommentMutationAsync,
    isDeleteCommunityCommentPending,
    isError,
    error,
  };
};

export default useDeleteCommunityComment;
