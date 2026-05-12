<script setup>
  import { useFieldArray } from 'vee-validate';
  import { computed } from 'vue';

  import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

  const props = defineProps({
    questionIndex: {
      type: Number,
      required: true,
    },
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

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
</script>

<template>
  <input
    v-model="fields[questionIndex].value.content"
    :name="`questionForm[${questionIndex}].content`"
    type="text"
    placeholder="질문을 입력해주세요"
    autocomplete="off"
    :class="`w-full border-b bg-defaults-secondary-background-mono p-4 transition-colors pretendard-16Regular hover:bg-defaults-secondary-background-secondary disabled:bg-defaults-primary-icon-primary-inverse ${!!errors[`questionForm[${questionIndex}].content`] && !isQuestionDisabled ? 'border border-b-2 border-destructive-100' : 'border-b-defaults-primary-background-primary-inverse focus:border-b-brand-default-border-brand'}`"
    :disabled="isQuestionDisabled"
  />
</template>
