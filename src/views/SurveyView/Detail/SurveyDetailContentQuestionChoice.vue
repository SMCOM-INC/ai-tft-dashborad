<script setup>
  import IconChevronLeftGray from '@assets/icons/icon-chevron-left-gray.svg';
  import SurveyDetailContentEtcAnswerModal from '@views/SurveyView/Detail/SurveyDetailContentEtcAnswerModal.vue';
  import { computed, ref } from 'vue';

  import { SURVEY_STATE } from '@/constants/survey.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';


  const props = defineProps({
    question: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    surveyState: {
      type: String,
      required: false,
      default: '',
    },
  });

  const modalType = ref(null);

  const optionMaxCount = computed(() => {
    const counts = props.question.questionOptionList
      ?.filter((option) => {
        return option.optionAnswerCount !== 0;
      })
      ?.map((option) => {
        return option?.optionAnswerCount || 0;
      });

    if (counts.length <= 0) {
      return;
    }

    const max = Math.max(...counts);

    return max;
  });

  const openEtcAnswerModal = () => {
    modalType.value = 'etcAnswer';
  };

  const closeModal = () => {
    modalType.value = null;
  };

  const calculateSurveyPercentage = (
    optionAnswerCount,
    questionAnswerCount,
  ) => {
    if (optionAnswerCount === 0 || questionAnswerCount === 0) {
      return undefined;
    }

    const percentage = (optionAnswerCount / questionAnswerCount) * 100;
    return Number(Math.round(percentage)); // 소수점 제거
  };
</script>

<template>
  <table class="w-full">
    <thead>
      <tr>
        <th
          class="w-4/5 rounded-tl-md bg-defaults-tertiary-background-mono-inverse px-4 py-3 text-left text-defaults-primary-text-primary-inverse pretendard-14Medium"
        >
          {{ decodeUrl(question?.title) || '-' }}
        </th>
        <th
          class="w-1/5 rounded-tr-md bg-brand-default-background-brand px-4 py-3 text-center text-defaults-primary-text-primary-inverse pretendard-14Medium"
        >
          득표수(득표율)
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(option, optionIndex) in question?.questionOptionList"
        :key="option?.content"
        :class="`${optionIndex === question?.questionOptionList.length - 1 ? undefined : 'border-b border-b-defaults-primary-border-primary'}`"
      >
        <th
          class="flex items-center justify-between gap-4 border-r border-r-defaults-primary-border-primary px-4 py-3 text-left pretendard-14Regular"
        >
          {{ decodeUrl(option?.content) || '-' }}
          <button
            v-if="
              question.etcFlag &&
              option.optionAnswerCount > 0 &&
              optionIndex === question?.questionOptionList.length - 1
            "
            type="button"
            class="flex items-center gap-1 whitespace-nowrap rounded-[4px] bg-defaults-secondary-background-secondary px-2 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
            @click="openEtcAnswerModal"
          >
            응답 전체보기
            <IconChevronLeftGray class="h-2 w-2 rotate-180" />
          </button>
        </th>
        <th
          v-if="surveyState === SURVEY_STATE.PENDING"
          class="rounded-br-md bg-primary2-pc-indigo-25 pretendard-14Regular"
        >
          설문전
        </th>
        <th
          v-else
          :class="`rounded-br-md bg-primary2-pc-indigo-25  ${
            optionMaxCount === option.optionAnswerCount
              ? 'text-brand-default-text-brand pretendard-14SemiBold'
              : 'pretendard-14Regular'
          }`"
        >
          {{
            `${option.optionAnswerCount}표(${calculateSurveyPercentage(option.optionAnswerCount, question.questionAnswerCount) || 0}%)`
          }}
        </th>
      </tr>
    </tbody>
  </table>
  <!-- 기타옵션 응답 자세히보기 모달 -->
  <SurveyDetailContentEtcAnswerModal
    v-if="modalType === 'etcAnswer'"
    :question-uuid="question.uuid"
    @close="closeModal"
  />
</template>
