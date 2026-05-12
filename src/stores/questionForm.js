import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useQuestionFormStore = defineStore('questionForm', () => {
  // formValues
  const formValues = ref({});
  const setFormValues = (newValue) => {
    formValues.value = { ...newValue };
  };

  // formActions
  const formActions = ref({});
  const setFormActions = (newValue) => {
    formActions.value = { ...formActions.value, ...newValue };
  };

  // form 복수선택 가능 여부
  const canMultiple = ref(false);
  const setCanMultiple = (newValue) => {
    canMultiple.value = newValue;
  };

  // 옵션 추가 초기값
  const initOptionValue = ref(undefined);
  const setInitOptionValue = (newValue) => {
    initOptionValue.value = newValue;
  };

  // 이미지 첨부 가능 여부
  const hasImage = ref(false);
  const setHasImage = (newValue) => {
    hasImage.value = newValue;
  };

  // 서술형 추가 여부
  const hasTextAnswer = ref(false);
  const setHasTextAnswer = (newValue) => {
    hasTextAnswer.value = newValue;
  };

  // 기타 추가 여부
  const hasEtcOption = ref(false);
  const setHasEtcOption = (newValue) => {
    hasEtcOption.value = newValue;
  };

  // 필수선택 추가 여부
  const hasRequiredSelector = ref(false);
  const setHasRequiredSelector = (newValue) => {
    hasRequiredSelector.value = newValue;
  };

  // 옵션 초기 개수
  const initialOptionCount = ref(0);
  const setInitialOptionCount = (newValue) => {
    initialOptionCount.value = newValue;
  };

  return {
    formValues,
    setFormValues,
    formActions,
    setFormActions,
    canMultiple,
    setCanMultiple,
    initOptionValue,
    setInitOptionValue,
    hasImage,
    setHasImage,
    hasTextAnswer,
    setHasTextAnswer,
    hasEtcOption,
    setHasEtcOption,
    hasRequiredSelector,
    setHasRequiredSelector,
    initialOptionCount,
    setInitialOptionCount,
  };
});

export const useQuestionFormDisabledStore = defineStore(
  'questionFormDisabled',
  () => {
    const questionFormStore = useQuestionFormStore();

    // 비활성화 여부를 담을 Map 객체를 일반 Object로 대체
    const activeQuestionUuid = ref(undefined);

    // 질문 ID 목록 계산
    const formQuestionUuidList = computed(() => {
      return (
        questionFormStore.formValues.questionForm?.map(
          (question) => question.id,
        ) || []
      );
    });

    // 하나라도 활성 질문이 있는지
    const hasActiveQuestion = computed(() => {
      return activeQuestionUuid.value !== undefined;
    });

    // 특정 질문의 disabled 여부 조회
    const getIsQuestionDisabled = (id) => {
      return activeQuestionUuid.value !== id;
    };

    // 특정 질문을 활성화
    const setActiveQuestion = (id) => {
      activeQuestionUuid.value = id;
    };

    // 현재 활성화된 질문을 비활성화 (전체 비활성 상태로 만듦)
    const clearActiveQuestion = () => {
      activeQuestionUuid.value = undefined;
    };

    watch(
      formQuestionUuidList,
      (newValue) => {
        // 질문은 무조건 한 개만 활성화 할 수 있음

        // 질문이 0개
        if (!Array.isArray(newValue) || newValue?.length === 0) {
          clearActiveQuestion();
          return;
        }

        // 투표를 처음 생성시/투표 추가시/작성한 질문이 없을 시에는, 활성화된 질문 1개가 빈값으로 보인다.(저장 안 했을시, uuid 의 type 이 number임)
        // 숫자 타입 uuid만 필터링
        const findNumberId = newValue.find((uuid) => typeof uuid === 'number');

        if (findNumberId !== undefined) {
          setActiveQuestion(findNumberId);
        }

        // 현재 수정 중인 질문이 존재
        // 기존에 활성화된 질문 ID가 목록에 포함되어 있으면 유지
        const isStillActive =
          activeQuestionUuid.value !== undefined &&
          newValue.includes(activeQuestionUuid.value);

        // 현재 수정 중인 질문 유지
        if (isStillActive) {
          return;
        }

        // 작성한 질문이 있으면 비뢀성화된 질문들이 채워져 보인다. (저장 했을시, uuid 의 type 이 string 임)
        clearActiveQuestion();
      },
      { immediate: true },
    );

    return {
      activeQuestionUuid,
      hasActiveQuestion,
      getIsQuestionDisabled,
      setActiveQuestion,
      clearActiveQuestion,
    };
  },
);
