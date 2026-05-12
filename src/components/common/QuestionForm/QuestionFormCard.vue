<script setup>
  import QuestionFormActions from '@components/common/QuestionForm/QuestionFormActions.vue';
  import QuestionFormMultipleChoice from '@components/common/QuestionForm/QuestionFormMultipleChoice.vue';
  import QuestionFormOption from '@components/common/QuestionForm/QuestionFormOption.vue';
  import QuestionFormRequiredSelector from '@components/common/QuestionForm/QuestionFormRequiredSelector.vue';
  import QuestionFormTitle from '@components/common/QuestionForm/QuestionFormTitle.vue';
  import QuestionFormTypeSelector from '@components/common/QuestionForm/QuestionFormTypeSelector.vue';
  import { useFieldArray } from 'vee-validate';
  import { computed, watch } from 'vue';

  import { QUESTION_TYPE } from '@/constants/common.js';
  import useQuestionForm from '@/lib/composables/common/useQuestionForm.js';
  import { useQuestionFormStore } from '@/stores/questionForm.js';

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

  const { fields } = useFieldArray('questionForm');
  const questionFormStore = useQuestionFormStore();

  // 질문 유형에 따른 옵션 개수 및 초기값 설정
  const questionIndexRef = computed(() => props.questionIndex);

  const { handleQuestionType, setChoiceCount } =
    useQuestionForm(questionIndexRef);

  // 질문 유형 변경 시, 옵션 및 최대최소값 설정
  handleQuestionType();

  watch(
    () => fields.value[props.questionIndex].value.options,
    () => {
      const questionValues = fields.value[props.questionIndex].value;

      if (questionValues.questionType !== QUESTION_TYPE.MULTIPLE_CHOICE) {
        return;
      }

      setChoiceCount(questionValues);
    },
    { deep: true },
  );
</script>

<template>
  <div class="relative flex w-full gap-4">
    <div
      class="w-full space-y-6 rounded-lg border bg-defaults-primary-background-primary p-5 shadow-md"
    >
      <div class="flex items-start gap-4">
        <div class="flex w-full flex-col gap-2">
          <!-- 질문 제목 -->
          <QuestionFormTitle :question-index="questionIndex" :errors="errors" />

          <!-- 복수선택 최소 및 최대 선택 개수 -->
          <QuestionFormMultipleChoice
            v-if="
              fields[questionIndex].value.questionType ===
                QUESTION_TYPE.MULTIPLE_CHOICE && questionFormStore.canMultiple
            "
            :question-index="questionIndex"
          />
        </div>

        <!-- 질문 유형 선택 -->
        <div class="flex items-center gap-4">
          <QuestionFormTypeSelector :question-index="questionIndex" />
          <QuestionFormRequiredSelector :question-index="questionIndex" />
        </div>
      </div>

      <!-- 옵션 리스트 -->
      <div
        v-if="
          fields[questionIndex].value.questionType === QUESTION_TYPE.SUBJECTIVE
        "
        class="w-3/4 border-b border-dotted border-defaults-primary-border-primary-inverse px-4 py-1 text-defaults-secondary-text-secondary"
      >
        서술형 답변
      </div>

      <QuestionFormOption
        v-else
        :question-index="questionIndex"
        :errors="errors"
      />
    </div>

    <!-- 질문 관리 버튼 -->
    <QuestionFormActions :question-index="questionIndex" :errors="errors" />
  </div>
</template>
