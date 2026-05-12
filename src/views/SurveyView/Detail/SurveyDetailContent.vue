<script setup>
  import SurveyDetailContentDefault from '@views/SurveyView/Detail/SurveyDetailContentDefault.vue';
  import SurveyDetailContentDescription from '@views/SurveyView/Detail/SurveyDetailContentDescription.vue';
  import SurveyDetailContentQuestion from '@views/SurveyView/Detail/SurveyDetailContentQuestion.vue';
  import SurveyPriceInfo from '@views/SurveyView/SurveyPriceInfo.vue';

  import useGetSurveyDetailDefault from '@/lib/queries/survey/useGetSurveyDetailDefault.js';

  const { surveyDetailDefault, isSurveyDetailDefaultLoading } =
    useGetSurveyDetailDefault();
</script>

<template>
  <!-- 설문 기본 정보 -->
  <SurveyDetailContentDefault
    :fetch-data="surveyDetailDefault"
    :is-loading="isSurveyDetailDefaultLoading"
  />
  <!-- 가격 정책 안내 -->
  <SurveyPriceInfo class="mb-4" />
  <!-- 설문 상세내용 -->
  <SurveyDetailContentDescription
    :fetch-data="surveyDetailDefault"
    :is-loading="isSurveyDetailDefaultLoading"
  />
  <!-- 설문 항목 -->
  <SurveyDetailContentQuestion
    :fetch-data="surveyDetailDefault"
    :is-loading="isSurveyDetailDefaultLoading"
  />
</template>
