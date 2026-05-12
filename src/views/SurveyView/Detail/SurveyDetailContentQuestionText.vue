<script setup>
  import IconChevronLeftGray from '@assets/icons/icon-chevron-left-gray.svg';
  import SurveyDetailContentSubjectiveAnswerModal from '@views/SurveyView/Detail/SurveyDetailContentSubjectiveAnswerModal.vue';
  import { computed, ref } from 'vue';

  import decodeUrl from '@/lib/utils/decodeUrl.js';


  const props = defineProps({
    question: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const modalType = ref(null);

  const answerCount = computed(() => {
    return props.question.questionAnswerCount;
  });

  const openSubjectiveAnswerModal = () => {
    modalType.value = 'subjectiveAnswer';
  };

  const closeModal = () => {
    modalType.value = null;
  };
</script>

<template>
  <div class="w-full">
    <div
      class="flex h-[52px] w-full items-center justify-between rounded-md bg-defaults-tertiary-background-mono-inverse px-4 py-3 text-left text-defaults-primary-text-primary-inverse pretendard-14Medium"
    >
      <div class="flex items-center gap-4">
        <span>{{ decodeUrl(question.title) || '-' }}</span>
        <span>(서술형 응답 {{ answerCount }}개)</span>
      </div>
      <button
        v-if="answerCount > 0"
        type="button"
        class="flex items-center gap-1 whitespace-nowrap rounded-[4px] bg-defaults-secondary-background-secondary px-2 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
        @click="openSubjectiveAnswerModal"
      >
        응답 전체보기
        <IconChevronLeftGray class="h-2 w-2 rotate-180" />
      </button>
    </div>
  </div>
  <!-- 서술형 응답 자세히보기 모달 -->
  <SurveyDetailContentSubjectiveAnswerModal
    v-if="modalType === 'subjectiveAnswer'"
    :question-uuid="question.uuid"
    @close="closeModal"
  />
</template>
