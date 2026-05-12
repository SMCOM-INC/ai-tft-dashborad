import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteVote } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 투표 삭제
export const useDeleteVote = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateReplace, navigateTo } = useNavigate();

  const {
    mutateAsync: deleteVoteMutationAsync,
    isPending: isDeleteVotePending,
  } = useMutation({
    mutationFn: ({ voteUuid }) => {
      return deleteVote({
        aptUuid: userInfo.aptUuid,
        voteUuid: voteUuid || getParams().voteUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteList']);

      swalSuccessModal({
        text: '투표가 삭제되었습니다.',
      });

      navigateReplace('/vote/list');
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

  return { deleteVoteMutationAsync, isDeleteVotePending };
};

export default useDeleteVote;
