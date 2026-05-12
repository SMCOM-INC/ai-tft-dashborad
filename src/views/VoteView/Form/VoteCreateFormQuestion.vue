<script setup>
  import QuestionFormCard from '@components/common/QuestionForm/QuestionFormCard.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import VoteCreateFormQuestionAddButton from '@views/VoteView/Form/VoteCreateFormQuestionAddButton.vue';
  import { useFieldArray, useForm } from 'vee-validate';
  import { watch } from 'vue';

  import useVoteQuestionInit from '@/lib/composables/vote/useVoteQuestionInit.js';
  import { voteSaveVoteFormQuestionSchema } from '@/schemas/vote.js';
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

  const { initQuestionForm, initQuestion } = useVoteQuestionInit();
  initQuestion();

  const { setFormValues, setCanMultiple } = useQuestionFormStore();

  const { errors, setValues, values } = useForm({
    validationSchema: voteSaveVoteFormQuestionSchema,
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

      // 투표유형 값 지정
      const isAgainst = newValue.voteType === 'AGAINST';

      // form 복수선택 가능 여부 설정
      setCanMultiple(!isAgainst);

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
      <VoteCreateFormQuestionAddButton />
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
