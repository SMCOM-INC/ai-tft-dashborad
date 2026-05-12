<script setup>
  import QuestionFormCard from '@components/common/QuestionForm/QuestionFormCard.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import SurveyCreateFormQuestionAddButton from '@views/SurveyView/Form/SurveyCreateFormQuestionAddButton.vue';
  import { useFieldArray, useForm } from 'vee-validate';
  import { watch } from 'vue';

  import useSurveyQuestionInit from '@/lib/composables/survey/useSurveyQuestionInit.js';
  import { surveySaveSurveyFormQuestionSchema } from '@/schemas/survey.js';
  import { useQuestionFormStore } from '@/stores/questionForm.js';

  const props = defineProps({
    detailInfo: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isDetailInfoLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const { initQuestionForm, initQuestion } = useSurveyQuestionInit();
  initQuestion();

  const { setFormValues } = useQuestionFormStore();

  const { errors, setValues, values } = useForm({
    validationSchema: surveySaveSurveyFormQuestionSchema,
    initialValues: { questionForm: [] },
  });

  const { fields } = useFieldArray('questionForm');

  watch(
    values,
    (newVal) => {
      // form 값을 store와 동기화
      setFormValues(newVal);
    },
    { deep: true, immediate: true },
  );

  watch(
    () => props.detailInfo,
    async (newValue) => {
      if (!newValue) {
        return;
      }

      // 폼 초기화
      const questionForm = await initQuestionForm(newValue.questionList);
      setValues(questionForm);
    },
    { immediate: true },
  );
</script>

<template>
  <div>
    <template v-if="isDetailInfoLoading">
      <SkeletonBase v-for="item in 5" :key="item" class="m-4 h-7 rounded-md" />
    </template>
    <div class="flex flex-col items-end gap-7">
      <SurveyCreateFormQuestionAddButton />
      <ol class="w-full space-y-7">
        <QuestionFormCard
          v-for="(field, index) in fields"
          :key="field.id"
          :question-index="index"
          :errors="errors"
        />
      </ol>
    </div>
  </div>
</template>
