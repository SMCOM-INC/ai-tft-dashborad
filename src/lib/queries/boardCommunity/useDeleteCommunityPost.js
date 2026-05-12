import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteCommunityPost } from '@/apis/boardCommunity.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteCommunityPost = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: deleteCommunityPostMutation,
    isPending: isDeleteCommunityPostPending,
    isError: isDeleteCommunityPostError,
    error: deleteCommunityPostError,
  } = useMutation({
    mutationFn: async ({ communityUuidList }) => {
      await Promise.all(
        communityUuidList.map((communityUuid) =>
          deleteCommunityPost({ aptUuid, communityUuid }),
        ),
      );
    },
    onSuccess: () => {
      const isCommunityPage = getCurrentRoutePath().includes(
        '/board/community/posts',
      );
      const isReportPage = getCurrentRoutePath().includes(
        '/board/community/reports',
      );
      const isDetailPage = getCurrentRoutePath().includes('detail');

      swalSuccessModal({
        text: '소통공간 글이 삭제되었습니다.',
      });

      if (isCommunityPage) {
        queryClient.invalidateQueries({
          queryKey: ['communityPostList', aptUuid],
        });

        if (isDetailPage) {
          navigateTo('/board/community');
        }
      }

      if (isReportPage) {
        queryClient.invalidateQueries({
          queryKey: ['communityReportList', aptUuid],
        });

        if (isDetailPage) {
          navigateTo('/board/community/reports');
        }
      }
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
    deleteCommunityPostMutation,
    isDeleteCommunityPostPending,
    isDeleteCommunityPostError,
    deleteCommunityPostError,
  };
};

export default useDeleteCommunityPost;
