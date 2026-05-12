import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteVoteQuestion } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';
import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 질문항목 삭제
export const useDeleteVoteQuestion = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateTo } = useNavigate();

  const { clearActiveQuestion } = useQuestionFormDisabledStore();

  const {
    mutateAsync: deleteVoteQuestionMutationAsync,
    isPending: isDeleteVoteQuestionPending,
  } = useMutation({
    mutationFn: ({ questionUuid }) => {
      return deleteVoteQuestion({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
        questionUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteFormDetail']);
      clearActiveQuestion();
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

  return { deleteVoteQuestionMutationAsync, isDeleteVoteQuestionPending };
};

export default useDeleteVoteQuestion;
