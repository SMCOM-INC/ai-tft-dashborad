<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import { useIsMutating } from '@tanstack/vue-query';
  import { useFieldArray } from 'vee-validate';
  import { computed } from 'vue';

  import {
    useQuestionFormDisabledStore,
    useQuestionFormStore,
  } from '@/stores/questionForm.js';

  const isMutating = useIsMutating();

  const { formActions } = useQuestionFormStore();
  const questionFormDisabledStore = useQuestionFormDisabledStore();

  const { push } = useFieldArray('questionForm');

  const isAddDisabled = computed(() => {
    // 질문이 하나라도 활성 상태면, 비활성화
    if (questionFormDisabledStore.hasActiveQuestion) {
      return true;
    }

    if (isMutating.value > 0) {
      return true;
    }

    return false;
  });

  // 질문 추가
  const addQuestion = () => {
    const newQuestion = formActions.initQuestionValue();

    push(newQuestion);

    questionFormDisabledStore.setActiveQuestion(newQuestion.id);
  };
</script>

<template>
  <ButtonBase
    type="button"
    color="outlined"
    :disabled="isAddDisabled"
    @click="addQuestion"
  >
    질문 추가
  </ButtonBase>
</template>
