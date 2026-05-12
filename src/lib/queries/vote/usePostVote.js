import { useMutation } from '@tanstack/vue-query';

import { postVote } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 투표 생성
const usePostVote = () => {
  const { userInfo } = useUserInfoStore();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: createVoteMutationAsync,
    isPending: isCreateVotePending,
  } = useMutation({
    mutationFn: ({ groupUuid, title, voteType }) => {
      return postVote({
        aptUuid: userInfo.aptUuid,
        groupUuid,
        title,
        voteType,
      });
    },
    onSuccess: (data, variables) => {
      const voteUuid = data.data.success;
      navigateTo({
        path: `/vote/create/${variables.groupUuid}/${voteUuid}`,
        state: { vote: 'create' },
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

  return { createVoteMutationAsync, isCreateVotePending };
};

export default usePostVote;
