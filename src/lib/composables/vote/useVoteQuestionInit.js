import { QUESTION_TYPE } from '@/constants/common.js';
import useVoteQuestionActions from '@/lib/composables/vote/useVoteQuestionActions.js';
import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';
import { useQuestionFormStore } from '@/stores/questionForm.js';

const useVoteQuestionInit = () => {
  const { saveQuestion, editQuestion, deleteQuestion } =
    useVoteQuestionActions();
  const {
    setFormActions,
    setInitOptionValue,
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
      fileList: [],
    };
  };

  // 질문 초기값
  const initQuestionValue = () => {
    const now = Date.now();
    return {
      id: now,
      content: '',
      questionType: QUESTION_TYPE.SINGLE_CHOICE,
      minChoice: undefined,
      maxChoice: undefined,
      options: [initOptionValue(), initOptionValue()],
    };
  };

  // 작성된 값 있을 때, 상세조회
  // 서버 옵션 전환
  const mapServerOptionToForm = async (option) => {
    const fileList = await Promise.all(
      (option.fileList || [])
        .slice()
        .sort((a, b) => a.orderNum - b.orderNum)
        .map((file) => {
          return {
            url: getFullImageUrl(file.fileUrl),
            name: file.fileName,
            uuid: file.boardFileUuid,
          };
        }),
    );

    return {
      id: option.uuid,
      content: option.content,
      fileList,
    };
  };

  // 서버 질문 전환
  const convertServerQuestionToForm = async (serverList) => {
    return Promise.all(
      serverList?.map(async (question) => {
        const options = await Promise.all(
          question.questionOptionList
            .slice()
            .sort((a, b) => a.orderNum - b.orderNum)
            .map(mapServerOptionToForm),
        );

        return {
          id: question.uuid,
          content: question.content,
          questionType: question.questionType,
          minChoice: question.minChoice,
          maxChoice: question.maxChoice,
          options,
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

    // 투표는 질문카드 설정 이미지 첨부, 서술형, 기타옵션, 필수선택 여부
    setHasImage(true);
    setHasTextAnswer(false);
    setHasEtcOption(false);
    setHasRequiredSelector(false);
    setInitialOptionCount(2);
  };

  return { initOptionValue, initQuestion, initQuestionForm };
};

export default useVoteQuestionInit;
