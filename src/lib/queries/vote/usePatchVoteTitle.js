import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchVoteTitle } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 투표명 수정
const usePatchVoteTitle = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: patchVoteTitleMutationAsync,
    isPending: isPatchVoteTitlePending,
  } = useMutation({
    mutationFn: ({ voteUuid, title }) => {
      return patchVoteTitle({
        aptUuid: userInfo.aptUuid,
        voteUuid,
        title,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteList']);

      swalSuccessModal({
        text: '투표명이 수정되었습니다.',
      });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'NOT_FOUND_VOTE':
          swalErrorModal({ text: message });
          navigateTo('/vote/list');
          break;
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { patchVoteTitleMutationAsync, isPatchVoteTitlePending };
};

export default usePatchVoteTitle;
