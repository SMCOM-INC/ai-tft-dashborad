import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postCommunityCategory } from '@/apis/boardCommunity.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 소통공간 기본 카테고리 생성
const usePostCommunityCategory = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const queryClient = useQueryClient();

  const {
    mutateAsync: postBaseCommunityCategoryMutation,
    isPending: isPostBaseCommunityCategoryPending,
    isError: isPostBaseCommunityCategoryError,
    error: postBaseCommunityCategoryError,
  } = useMutation({
    mutationFn: () => postCommunityCategory(aptUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['communityCategoryList', aptUuid],
      });
      swalSuccessModal({ text: '기본 카테고리가 생성되었습니다.' });
    },
  });

  return {
    postBaseCommunityCategoryMutation,
    isPostBaseCommunityCategoryPending,
    isPostBaseCommunityCategoryError,
    postBaseCommunityCategoryError,
  };
};

export default usePostCommunityCategory;
