<script setup>
  import IconChevronLeftGray from '@assets/icons/icon-chevron-left-gray.svg';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import VoteDetailContentOptionMoreModal from '@views/VoteView/Detail/VoteDetailContentOptionMoreModal.vue';
  import { computed, ref } from 'vue';

  import { VOTE_STATE } from '@/constants/vote.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
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

  const modalType = ref(null);
  const selectedOption = ref(false);

  const questionMaxCountMap = computed(() => {
    const result = {};

    props.fetchData?.questionList?.forEach((question) => {
      const counts = question.questionOptionList
        ?.filter((option) => option.optionCount !== 0)
        ?.map((option) => {
          return option?.optionCount || 0;
        });

      if (counts.length <= 0) {
        return;
      }

      const max = Math.max(...counts);

      result[question.uuid] = max;
    });

    return result;
  });

  const openOptionMoreModal = (value) => {
    selectedOption.value = value;
    modalType.value = 'optionMore';
  };

  const closeModal = () => {
    modalType.value = null;
  };

  const calculateVotePercentage = (optionVotes, totalVotes) => {
    if (optionVotes === 0 || totalVotes === 0) {
      return undefined;
    }

    const percentage = (optionVotes / totalVotes) * 100;
    return Number(Math.round(percentage)); // 소수점 제거
  };
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
        <table class="w-full">
          <thead>
            <tr>
              <th
                class="w-4/5 rounded-tl-md bg-defaults-tertiary-background-mono-inverse px-4 py-3 text-left text-defaults-primary-text-primary-inverse pretendard-14Medium"
              >
                {{ decodeUrl(question?.content) || '-' }}
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
                  v-if="option?.fileList?.length > 0"
                  type="button"
                  class="flex items-center gap-1 whitespace-nowrap rounded-[4px] bg-defaults-secondary-background-secondary px-2 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
                  @click="openOptionMoreModal(option)"
                >
                  첨부된 이미지보기
                  <IconChevronLeftGray class="h-2 w-2 rotate-180" />
                </button>
              </th>
              <th
                v-if="fetchData?.voteStatus === VOTE_STATE.CLOSE"
                :class="`rounded-br-md bg-primary2-pc-indigo-25  ${
                  questionMaxCountMap[question.uuid] === option.optionCount
                    ? 'text-brand-default-text-brand pretendard-14SemiBold'
                    : 'pretendard-14Regular'
                }`"
              >
                {{
                  `${option.optionCount}표(${calculateVotePercentage(option.optionCount, question.questionFullCount) || 0}%)`
                }}
              </th>
              <th
                v-else-if="fetchData?.voteStatus === VOTE_STATE.PROGRESS"
                class="rounded-br-md bg-primary2-pc-indigo-25 pretendard-14Regular"
              >
                집계전
              </th>
              <th
                v-else-if="fetchData?.voteStatus === VOTE_STATE.PENDING"
                class="rounded-br-md bg-primary2-pc-indigo-25 pretendard-14Regular"
              >
                투표전
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <!-- 옵션 자세히보기 모달 -->
  <VoteDetailContentOptionMoreModal
    v-if="modalType === 'optionMore'"
    :option-info="selectedOption"
    @close="closeModal"
  />
</template>
