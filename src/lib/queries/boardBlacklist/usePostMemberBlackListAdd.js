import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postMemberBlackListAdd } from '@/apis/boardBlacklist.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePostMemberBlackListAdd = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: postMemberBlackListAddMutation,
    isPending: isAddMemberBlackListPending,
  } = useMutation({
    mutationFn: ({ communityUuid, reason }) => {
      return postMemberBlackListAdd({
        aptUuid: userInfo.aptUuid,
        communityUuid,
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['memberBlackList', userInfo.aptUuid],
      });
      queryClient.invalidateQueries({
        queryKey: ['communityPostDetail'],
      });
      swalSuccessModal({
        text: '게시판 블랙리스트가 등록되었습니다',
      });
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
    postMemberBlackListAddMutation,
    isAddMemberBlackListPending,
  };
};

export default usePostMemberBlackListAdd;
