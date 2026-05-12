import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteSurveyQuestion } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';
import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 질문항목 삭제
export const useDeleteSurveyQuestion = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateTo } = useNavigate();

  const { clearActiveQuestion } = useQuestionFormDisabledStore();

  const {
    mutateAsync: deleteSurveyQuestionMutationAsync,
    isPending: isDeleteSurveyQuestionPending,
  } = useMutation({
    mutationFn: ({ questionUuid }) => {
      return deleteSurveyQuestion({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        questionUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveyFormDetail']);
      clearActiveQuestion();
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'NOT_FOUND_VOTE':
          swalErrorModal({ text: message });
          navigateTo('/survey/list');
          break;
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { deleteSurveyQuestionMutationAsync, isDeleteSurveyQuestionPending };
};

export default useDeleteSurveyQuestion;
