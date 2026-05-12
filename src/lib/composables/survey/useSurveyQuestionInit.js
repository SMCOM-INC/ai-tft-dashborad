import { QUESTION_TYPE } from '@/constants/common.js';
import useSurveyQuestionActions from '@/lib/composables/survey/useSurveyQuestionActions.js';
import { useQuestionFormStore } from '@/stores/questionForm.js';

const useSurveyQuestionInit = () => {
  const { saveQuestion, editQuestion, deleteQuestion } =
    useSurveyQuestionActions();

  const {
    setFormActions,
    setInitOptionValue,
    setCanMultiple,
    setHasImage,
    setHasTextAnswer,
    setHasEtcOption,
    setHasRequiredSelector,
    setInitialOptionCount,
  } = useQuestionFormStore();

  // 옵션 초기값
  const initOptionValue = () => {
    const now = Date.now();

    return {
      id: now,
      content: '',
    };
  };

  // 질문 초기값
  const initQuestionValue = () => {
    const now = Date.now();
    return {
      id: now,
      content: '',
      questionType: QUESTION_TYPE.SINGLE_CHOICE,
      isRequired: true,
      minChoice: undefined,
      maxChoice: undefined,
      options: [initOptionValue()],
    };
  };

  // 작성된 값 있을 때, 상세조회
  // 서버 질문 전환
  const convertServerQuestionToForm = async (serverList) => {
    return Promise.all(
      serverList?.map(async (question) => {
        const options = question.optionList
          .slice()
          .sort((a, b) => a.orderNum - b.orderNum)
          .map((option, index, array) => {
            // 서버에서는 질문당 기타 여부를 보여주고 있는데
            // 프론트에서는 옵션당 기타 여부가 필요함. 변환 작업한 내용임
            const isLastOption = index === array.length - 1;
            const isEtcOption = question.etcFlag && isLastOption;

            return {
              id: option.uuid,
              content: option.content,
              ...(isEtcOption && { etcFlag: true }),
            };
          });

        return {
          id: question.uuid,
          content: question.title,
          questionType: question.type,
          minChoice: question.minChoice,
          maxChoice: question.maxChoice,
          options,
          isRequired: question.requiredFlag,
        };
      }),
    );
  };

  const initQuestionForm = async (questionList) => {
    // 등록된 질문이 없을 때
    if (!questionList || questionList.length === 0) {
      return { questionForm: [initQuestionValue()] };
    }

    // 등록된 질문이 있을 때, 서버 데이터 변환 후 반영
    const transformed = await convertServerQuestionToForm(questionList);
    return { questionForm: transformed };
  };

  const initQuestion = () => {
    // form 에 필요한 함수 store 설정
    setFormActions({
      initQuestionValue,
      saveQuestion,
      editQuestion,
      deleteQuestion,
    });

    setInitOptionValue(initOptionValue);

    // 설문조사는 질문카드 설정 복수선택, 서술형, 기타옵션, 필수선택 여부
    setHasImage(false);
    setCanMultiple(true);
    setHasTextAnswer(true);
    setHasEtcOption(true);
    setHasRequiredSelector(true);
    setInitialOptionCount(1);
  };

  return { initOptionValue, initQuestion, initQuestionForm };
};

export default useSurveyQuestionInit;
