<script setup>
  import { useFieldArray } from 'vee-validate';
  import { computed } from 'vue';

  import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

  const props = defineProps({
    questionIndex: {
      type: Number,
      required: true,
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
  <div class="flex h-11 items-center gap-4">
    <span
      class="whitespace-nowrap text-defaults-tertiary-text-tertiary pretendard-16SemiBold"
    >
      복수 선택
    </span>
    <div class="flex w-full gap-2">
      <select
        v-model="fields[questionIndex].value.minChoice"
        :name="`questionForm[${questionIndex}].minChoice`"
        class="w-full rounded-md border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
        :required="!isQuestionDisabled"
        :disabled="isQuestionDisabled"
      >
        <option
          v-for="number in fields[questionIndex].value.maxChoice"
          :key="number"
          :value="number"
        >
          최소 {{ number }}개
        </option>
      </select>

      <select
        v-model="fields[questionIndex].value.maxChoice"
        :name="`questionForm[${questionIndex}].maxChoice`"
        class="w-full rounded-md border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
        :required="!isQuestionDisabled"
        :disabled="isQuestionDisabled"
      >
        <option
          v-for="number in fields[questionIndex].value.options.length - 1"
          :key="number"
          :value="number + 1"
          :disabled="number + 1 < fields[questionIndex].value.minChoice"
        >
          최대 {{ number + 1 }}개
        </option>
      </select>
    </div>
  </div>
</template>
