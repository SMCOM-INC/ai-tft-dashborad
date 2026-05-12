import { useFieldArray } from 'vee-validate';
import { computed, watch } from 'vue';

import { QUESTION_TYPE } from '@/constants/common.js';
import useSurveyQuestionInit from '@/lib/composables/survey/useSurveyQuestionInit.js';
import { useQuestionFormStore } from '@/stores/questionForm.js';

// 질문 유형에 따른 옵션 개수 및 초기값 설정
const useQuestionForm = (questionIndex) => {
  const questionFormStore = useQuestionFormStore();
  const { initOptionValue } = useSurveyQuestionInit();

  const { fields: questionFields } = useFieldArray('questionForm');
  const {
    fields: optionsFields,
    push,
    insert,
    remove,
    swap,
  } = useFieldArray(`questionForm[${questionIndex.value}].options`);

  // 초기 옵션 생성
  const createInitialOptions = (count) => {
    return Array.from({ length: count }, () => initOptionValue());
  };

  // 부족한 옵션 추가
  const addMissingOptions = (currentOptions, targetCount) => {
    const currentLength = currentOptions?.length || 0;
    const needed = targetCount - currentLength;

    if (needed > 0) {
      const newOptions = [...(currentOptions || [])];
      for (let i = 0; i < needed; i++) {
        newOptions.push(initOptionValue());
      }
      return newOptions;
    }

    return currentOptions;
  };

  // 옵션 초기화 (타입 전환 시)
  const initializeOptions = (questionValues, prevQuestionType, targetCount) => {
    // 서술형에서 변경 → 새로 생성
    if (prevQuestionType === QUESTION_TYPE.SUBJECTIVE) {
      questionValues.options = createInitialOptions(targetCount);
      return;
    }

    // 객관식과 복수선택 사이에 변경시 → 기존 유지 + 부족한 옵션만큼 추가
    if (
      prevQuestionType === QUESTION_TYPE.SINGLE_CHOICE ||
      prevQuestionType === QUESTION_TYPE.MULTIPLE_CHOICE
    ) {
      questionValues.options = addMissingOptions(
        questionValues.options,
        targetCount,
      );
    }
  };

  // 최소최대 선택 개수 초기화
  const resetChoiceCount = (questionValues) => {
    questionValues.minChoice = undefined;
    questionValues.maxChoice = undefined;
  };

  // 최소최대 선택 개수 설정
  const setChoiceCount = (questionValues) => {
    const optionLength = questionValues.options?.length || 0;

    // 옵션 개수에 따라 maxChoice 자동 설정
    questionValues.maxChoice = optionLength;

    // minChoice 가 아직 선택되지 않은 경우에만, 1로 초기화
    if (typeof questionValues.minChoice !== 'number') {
      questionValues.minChoice = 1;
    }

    // minChoice가 maxChoice보다 크면, maxChoice로 보정
    if (questionValues.minChoice > optionLength) {
      questionValues.minChoice = optionLength;
    }
  };

  // 질문 유형 변경 시, 옵션 및 최대최소값 설정
  const handleQuestionType = () => {
    watch(
      [() => questionFields.value[questionIndex.value]?.value.questionType],
      ([newQuestionType], [prevQuestionType]) => {
        // 실제로 타입이 변경되지 않았으면 실행하지 않음
        if (!prevQuestionType || newQuestionType === prevQuestionType) {
          return;
        }

        const questionValues = questionFields.value[questionIndex.value].value;

        // 서술형: 최대최소값 없음, options 제거
        if (newQuestionType === QUESTION_TYPE.SUBJECTIVE) {
          resetChoiceCount(questionValues);
          questionValues.options = undefined;
          return;
        }

        // 객관식: 최대최소값 없음, options 개수 변경
        if (newQuestionType === QUESTION_TYPE.SINGLE_CHOICE) {
          resetChoiceCount(questionValues);
          initializeOptions(
            questionValues,
            prevQuestionType,
            questionFormStore.initialOptionCount,
          );
          return;
        }

        // 복수선택: 최대최소값 설정, options 개수 변경
        if (newQuestionType === QUESTION_TYPE.MULTIPLE_CHOICE) {
          const MULTIPLE_CHOICE_OPTION_COUNT = 2;

          initializeOptions(
            questionValues,
            prevQuestionType,
            MULTIPLE_CHOICE_OPTION_COUNT,
          );
          setChoiceCount(questionValues);
        }
      },
    );
  };

  // 기타 옵션 존재 여부
  const hasQuestionEtc = computed(() => {
    if (!optionsFields.value) {
      return false;
    }
    return optionsFields.value.some((option) => option.value.etcFlag);
  });

  // 옵션 순서 변경
  const changeOrder = (index, direction) => {
    if (!optionsFields.value) {
      return;
    }

    // 기타 옵션은 순서 변경 불가
    if (optionsFields.value[index].value.etcFlag) {
      return;
    }

    if (direction === 'up' && index > 0) {
      // 기타 옵션과 자리를 바꾸려고 하면 막기
      if (optionsFields.value[index - 1].value.etcFlag) {
        return;
      }
      swap(index, index - 1);
    } else if (direction === 'down' && index < optionsFields.value.length - 1) {
      // 기타 옵션과 자리를 바꾸려고 하면 막기
      if (optionsFields.value[index + 1].value.etcFlag) {
        return;
      }
      swap(index, index + 1);
    }
  };

  // 옵션 삭제
  const deleteOption = (optionIndex) => {
    remove(optionIndex);
  };

  // 옵션 추가
  const addOption = () => {
    // initOptionValue가 ref에 저장된 함수이므로 .value()로 호출
    const getInitOptionValue = () => {
      const initValue = questionFormStore.initOptionValue;

      // ref인 경우 .value로 접근
      if (initValue && typeof initValue.value === 'function') {
        return initValue.value();
      }

      // 함수인 경우 직접 호출
      if (typeof initValue === 'function') {
        return initValue();
      }

      // 값 자체가 객체인 경우 그대로 반환
      return initValue;
    };

    if (hasQuestionEtc.value) {
      insert(optionsFields.value.length - 1, getInitOptionValue());
      return;
    }

    push(getInitOptionValue());
  };

  // 기타 옵션 추가
  const addEtcOption = () => {
    const now = Date.now();
    return {
      id: now,
      content: '기타',
      etcFlag: true,
    };
  };

  // 아래 버튼 비활성 체크
  const checkDownButtonDisabled = (optionIndex) => {
    if (!optionsFields.value) {
      return true;
    }

    const isLastOption = optionIndex === optionsFields.value.length - 1;
    const hasNextOption = optionIndex < optionsFields.value.length - 1;
    const isNextOptionEtc =
      hasNextOption && optionsFields.value[optionIndex + 1].value.etcFlag;

    return isLastOption || isNextOptionEtc;
  };

  return {
    optionsFields,
    hasQuestionEtc,
    changeOrder,
    deleteOption,
    addOption,
    addEtcOption,
    checkDownButtonDisabled,
    pushOption: push,
    handleQuestionType,
    setChoiceCount,
  };
};

export default useQuestionForm;
