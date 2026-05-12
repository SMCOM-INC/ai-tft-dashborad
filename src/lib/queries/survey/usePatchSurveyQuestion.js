import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchSurveyQuestion } from '@/apis/survey.js';
import { QUESTION_TYPE } from '@/constants/common.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';
import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 질문항목 수정
const usePatchSurveyQuestion = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getParams, navigateTo } = useNavigate();

  const { clearActiveQuestion } = useQuestionFormDisabledStore();

  const {
    mutateAsync: patchSurveyQuestionMutationAsync,
    isPending: isPatchSurveyQuestionPending,
  } = useMutation({
    mutationFn: ({ questionData }) => {
      const {
        options,
        content,
        minChoice,
        maxChoice,
        questionType,
        isRequired,
      } = questionData;

      if (questionType === QUESTION_TYPE.SUBJECTIVE) {
        return patchSurveyQuestion({
          aptUuid: userInfo.aptUuid,
          surveyUuid: getParams().surveyUuid,
          questionUuid: questionData.id,
          content,
          questionType,
          isRequired,
        });
      }

      const convertedOptionList = options
        .filter((option) => !option.etcFlag)
        .map((option, optionIndex) => {
          return {
            orderNum: optionIndex,
            content: option.content,
          };
        });

      const findEtcFlag = options.some((option) => !!option.etcFlag);

      return patchSurveyQuestion({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        questionUuid: questionData.id,
        questionOptionList: convertedOptionList,
        content,
        questionType,
        isRequired,
        minChoice,
        maxChoice,
        etcFlag: findEtcFlag,
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

  return { patchSurveyQuestionMutationAsync, isPatchSurveyQuestionPending };
};

export default usePatchSurveyQuestion;
