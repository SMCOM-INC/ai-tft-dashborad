import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postSurveyQuestion } from '@/apis/survey.js';
import { QUESTION_TYPE } from '@/constants/common.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';
import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 질문항목 등록
const usePostSurveyQuestion = () => {
  const queryClient = useQueryClient();
  const { getParams } = useNavigate();

  const { userInfo } = useUserInfoStore();
  const { clearActiveQuestion } = useQuestionFormDisabledStore();

  const {
    mutateAsync: postSurveyQuestionMutationAsync,
    isPending: isPostSurveyQuestionPending,
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
        return postSurveyQuestion({
          aptUuid: userInfo.aptUuid,
          surveyUuid: getParams().surveyUuid,
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

      return postSurveyQuestion({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
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
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { postSurveyQuestionMutationAsync, isPostSurveyQuestionPending };
};

export default usePostSurveyQuestion;
