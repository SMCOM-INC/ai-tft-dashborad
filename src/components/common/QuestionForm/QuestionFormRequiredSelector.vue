<script setup>
  import ToggleBase from '@components/common/ToggleBase.vue';
  import { useFieldArray } from 'vee-validate';
  import { computed } from 'vue';

  import {
    useQuestionFormDisabledStore,
    useQuestionFormStore,
  } from '@/stores/questionForm.js';

  const props = defineProps({
    questionIndex: {
      type: Number,
      required: true,
    },
  });

  const questionFormStore = useQuestionFormStore();
  const questionFormDisabledStore = useQuestionFormDisabledStore();
  const { fields } = useFieldArray('questionForm');

  // 질문 아이디
  const questionId = computed(() => {
    return fields.value[props.questionIndex].value.id;
  });

  // 질문 disabled 여부
  const isQuestionDisabled = computed(() => {
    return questionFormDisabledStore.getIsQuestionDisabled(questionId.value);
  });

  // 필수 여부 토글 핸들러
  const toggleRequired = () => {
    fields.value[props.questionIndex].value.isRequired =
      !fields.value[props.questionIndex].value.isRequired;
  };
</script>

<template>
  <div
    v-if="questionFormStore.hasRequiredSelector"
    class="mt-2 flex items-center"
  >
    <ToggleBase
      toggle-title="필수"
      :toggle-state="fields[questionIndex].value.isRequired"
      :label-class="'flex h-10 w-full items-center gap-3 rounded-md border border-defaults-primary-border-primary px-3 py-2'"
      :disabled="isQuestionDisabled"
      @toggle-state="toggleRequired"
    />
  </div>
</template>
