<script setup>
  import IconChevronDown from '@assets/icons/icon-chevron-down-black.svg';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SurveyCreateFormDefault from '@views/SurveyView/Form/SurveyCreateFormDefault.vue';
  import SurveyCreateFormExcel from '@views/SurveyView/Form/SurveyCreateFormExcel.vue';
  import SurveyCreateFormQuestion from '@views/SurveyView/Form/SurveyCreateFormQuestion.vue';
  import SurveyCreateSubmitBar from '@views/SurveyView/Form/SurveyCreateSubmitBar.vue';
  import { computed, ref, shallowRef, watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import useGetSurveyFormDetail from '@/lib/queries/survey/useGetSurveyFormDetail.js';

  const { getCurrentRoutePath } = useNavigate();

  const {
    surveyFormDetail,
    isSurveyFormDetailLoading,
    isSurveyFormDetailError,
  } = useGetSurveyFormDetail();

  const hasGuard = ref(true);

  // shallowRef : 컴포넌트 객체의 반응형을 유지하되, 내부 속성까지 reactive 처리하지 않도록
  const sections = ref([
    {
      key: 'basic',
      title: 'STEP 1 : 기본 정보',
      isOpen: true,
      component: shallowRef(SurveyCreateFormDefault),
    },
    {
      key: 'participants',
      title: 'STEP 2 : 참여자 업로드',
      isOpen: true,
      component: shallowRef(SurveyCreateFormExcel),
    },
    {
      key: 'questions',
      title: 'STEP 3 : 질문 항목',
      isOpen: true,
      component: shallowRef(SurveyCreateFormQuestion),
    },
  ]);

  const isCreatePage = computed(() => {
    return getCurrentRoutePath().includes('create');
  });

  const toggleSection = (key) => {
    const target = sections.value.find((section) => section.key === key);
    if (target) {
      target.isOpen = !target.isOpen;
      return;
    }
  };

  const submitSuccess = () => {
    hasGuard.value = false;
  };

  watch(isSurveyFormDetailError, (newValue) => {
    if (newValue) {
      hasGuard.value = false;
    }
  });

  useUnsavedChangesGuard([hasGuard]);
</script>

<template>
  <div class="pb-[130px]">
    <div class="flex justify-between">
      <PageTitleBase
        :title="isCreatePage ? '설문 생성' : '설문 수정'"
        has-back-button
      />
    </div>
    <div class="mx-auto max-w-[924px]">
      <section v-for="section in sections" :key="section.key">
        <button
          type="button"
          class="mb-7 flex w-full cursor-pointer items-center justify-between border-b-2 border-b-defaults-primary-border-mono p-4"
          @click="toggleSection(section.key)"
        >
          <h2 class="pretendard-20SemiBold">{{ section.title }}</h2>
          <IconChevronDown
            :class="`h-7 w-7 transition-transform duration-200 ${section.isOpen ? 'rotate-180' : ''}`"
          />
        </button>
        <component
          :is="section.component"
          v-bind="{
            detailInfo: surveyFormDetail,
            isDetailInfoLoading: isSurveyFormDetailLoading,
          }"
          :class="`mb-6 overflow-hidden p-1 transition-all duration-300 ${
            section.isOpen ? 'opacity-100' : 'h-[0px] opacity-0'
          }`"
        />
      </section>
    </div>
    <SurveyCreateSubmitBar
      :detail="surveyFormDetail"
      @submit-success="submitSuccess"
    />
  </div>
</template>
