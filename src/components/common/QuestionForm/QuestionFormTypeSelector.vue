<script setup>
  import { useFieldArray } from 'vee-validate';
  import { computed } from 'vue';

  import { QUESTION_TYPE } from '@/constants/common.js';
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

  // 질문 유형 옵션
  const questionTypeOptions = computed(() => {
    const options = [{ value: QUESTION_TYPE.SINGLE_CHOICE, label: '객관식' }];

    if (questionFormStore.canMultiple) {
      options.push({ value: QUESTION_TYPE.MULTIPLE_CHOICE, label: '복수선택' });
    }

    if (questionFormStore.hasTextAnswer) {
      options.push({ value: QUESTION_TYPE.SUBJECTIVE, label: '서술형' });
    }

    return options;
  });
</script>

<template>
  <select
    v-if="questionTypeOptions.length > 1"
    v-model="fields[questionIndex].value.questionType"
    :name="`questionForm[${questionIndex}].questionType`"
    class="mt-2 h-10 w-36 rounded-md border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm pretendard-14Regular"
    :disabled="isQuestionDisabled"
  >
    <option
      v-for="option in questionTypeOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
