<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  // import SurveyDetailPdfDownButton from '@views/SurveyView/Detail/SurveyDetailPdfDownButton.vue';
  import SurveyDeleteModal from '@views/SurveyView/SurveyDeleteModal.vue';
  import { computed, ref } from 'vue';
  import { RouterView } from 'vue-router';

  import {
    DETAIL_TABS_LIST,
    // SURVEY_STATE
  } from '@/constants/survey.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useSurveyState from '@/lib/composables/survey/useSurveyState.js';
  import useGetSurveyDetailDefault from '@/lib/queries/survey/useGetSurveyDetailDefault.js';

  const { navigateTo, getParams } = useNavigate();

  const { surveyDetailDefault, isSurveyDetailDefaultLoading } =
    useGetSurveyDetailDefault();

  const modalType = ref(null);

  const state = computed(() => surveyDetailDefault.value?.state);
  const openTime = computed(() => surveyDetailDefault.value?.startDateTime);

  const { checkAuth, canEdit, canDelete } = useSurveyState({
    state,
    finishFlag: true,
    openTime,
  });

  const editSurvey = () => {
    navigateTo(
      `/survey/edit/${getParams().groupUuid}/${getParams().surveyUuid}`,
    );
  };

  const openDeleteModal = () => {
    modalType.value = 'deletion';
  };

  const closeModal = () => {
    modalType.value = null;
  };
</script>

<template>
  <div class="flex flex-col gap-7 p-10">
    <!-- 페이지 이름 및 버튼 -->
    <div class="flex justify-between">
      <div
        v-if="isSurveyDetailDefaultLoading"
        class="flex w-full justify-center"
      >
        <SpinnerCircle color="black" />
      </div>
      <template v-else>
        <PageTitleBase
          title="설문조사 상세"
          has-back-button
          back-url="/survey/list"
        />
        <div class="flex h-fit justify-end gap-4">
          <!-- <SurveyDetailPdfDownButton
            v-if="state === SURVEY_STATE.CLOSE"
            :disabled="state !== SURVEY_STATE.CLOSE"
          /> -->
          <div class="space-x-2">
            <ButtonBase
              v-if="canEdit"
              type="button"
              color="primary"
              size="md"
              :disabled="!canEdit"
              @click="editSurvey"
            >
              설문 수정하기
            </ButtonBase>
            <ButtonBase
              v-if="canDelete"
              type="button"
              color="destructive-outlined"
              size="md"
              :disabled="!canDelete"
              @click="openDeleteModal"
            >
              삭제하기
            </ButtonBase>
          </div>
        </div>
      </template>
    </div>
    <div
      v-if="checkAuth !== 'ALL'"
      class="rounded-lg bg-blue-s-info-25 p-4 text-defaults-secondary-text-secondary pretendard-14Medium"
    >
      <template v-if="checkAuth === 'NONE'">
        설문이 진행중이거나, 시작시간 1시간 이내인 경우 수정 및 삭제가
        불가합니다.
      </template>
      <template v-else-if="checkAuth === 'DELETE_ONLY'">
        설문 종료시, 삭제만 가능합니다.
      </template>
    </div>
    <!-- tab bar -->
    <TabBarBase :tab-list="DETAIL_TABS_LIST" />
    <!-- 설문 기본 정보, 설문 참여자-->
    <RouterView />
  </div>
  <!-- 설문 삭제 모달 -->
  <SurveyDeleteModal v-if="modalType === 'deletion'" @close="closeModal" />
</template>
