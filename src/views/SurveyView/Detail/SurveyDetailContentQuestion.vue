<script setup>
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import SurveyDetailContentQuestionChoice from '@views/SurveyView/Detail/SurveyDetailContentQuestionChoice.vue';
  import SurveyDetailContentQuestionText from '@views/SurveyView/Detail/SurveyDetailContentQuestionText.vue';

  import { QUESTION_TYPE } from '@/constants/common.js';

  defineProps({
    fetchData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });
</script>

<template>
  <div class="flex flex-col gap-3">
    <h3 class="pb-3 pretendard-20SemiBold">질문 항목</h3>
    <template v-if="isLoading">
      <SkeletonBase v-for="item in 5" :key="item" class="m-4 h-5 rounded-md" />
    </template>
    <template v-else>
      <div
        v-for="question in fetchData?.questionList"
        :key="question?.uuid"
        class="rounded-md border border-defaults-primary-border-primary"
      >
        <SurveyDetailContentQuestionText
          v-if="question.type === QUESTION_TYPE.SUBJECTIVE"
          :question="question"
        />
        <SurveyDetailContentQuestionChoice
          v-else
          :question="question"
          :survey-state="fetchData.state"
        />
      </div>
    </template>
  </div>
</template>
