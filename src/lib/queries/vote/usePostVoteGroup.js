import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postVoteGroup } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 그룹 생성
const usePostVoteGroup = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: createVoteGroupMutationAsync,
    isPending: isCreateVoteGroupPending,
  } = useMutation({
    mutationFn: ({ groupName }) => {
      return postVoteGroup({
        aptUuid: userInfo.aptUuid,
        groupName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteList']);

      navigateTo('/vote/list');
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { createVoteGroupMutationAsync, isCreateVoteGroupPending };
};

export default usePostVoteGroup;
