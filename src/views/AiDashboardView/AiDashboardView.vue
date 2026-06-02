<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import AiCategoryDonut from '@views/AiDashboardView/components/AiCategoryDonut.vue';
  import AiDailyCountLine from '@views/AiDashboardView/components/AiDailyCountLine.vue';
  import AiDailyScoreLine from '@views/AiDashboardView/components/AiDailyScoreLine.vue';
  import TossStatCard from '@views/AiDashboardView/components/TossStatCard.vue';
  import { computed } from 'vue';

  import { AI_DEFAULT_DATE_RANGE } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetAiDashboard from '@/lib/queries/aiCallCenter/useGetAiDashboard.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const {
    aiDashboard,
    isAiDashboardLoading,
    isAiDashboardError,
    refetchAiDashboard,
  } = useGetAiDashboard();

  const stats = computed(() => ({
    totalCount: aiDashboard.value?.total_count ?? 0,
    yesterdayCount: aiDashboard.value?.yesterday_count ?? 0,
    avgScore: aiDashboard.value?.avg_score ?? 0,
  }));

  const dailyCount = computed(
    () => aiDashboard.value?.daily_consultation_count || {},
  );
  const dailyScore = computed(() => aiDashboard.value?.daily_avg_score || {});
  const categoryCount = computed(() => aiDashboard.value?.category_count || {});
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-end justify-between">
      <div class="space-y-1.5">
        <h1
          class="flex items-center gap-2 text-[26px] font-bold tracking-tight text-toss-grey-900"
        >
          <span class="font-tossface text-[24px] leading-none">📊</span>
          대시보드
        </h1>
        <p class="text-[14px] text-toss-grey-500">
          기간별 상담 통계를 한눈에 확인해요.
        </p>
      </div>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div v-if="isAiDashboardLoading" class="space-y-6">
      <div class="grid grid-cols-3 gap-6">
        <SkeletonBase v-for="i in 3" :key="i" class="h-[152px] rounded-[20px]" />
      </div>
      <SkeletonBase class="h-[360px] rounded-[20px]" />
      <div class="grid grid-cols-2 gap-6">
        <SkeletonBase class="h-[360px] rounded-[20px]" />
        <SkeletonBase class="h-[360px] rounded-[20px]" />
      </div>
    </div>

    <div
      v-else-if="isAiDashboardError"
      class="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-toss-grey-200 bg-toss-grey-50 py-20 text-center"
    >
      <span class="font-tossface text-[40px] leading-none">😵</span>
      <div class="space-y-1">
        <p class="text-[16px] font-bold text-toss-grey-900">
          데이터를 불러오지 못했어요
        </p>
        <p class="text-[14px] text-toss-grey-500">
          네트워크 상태를 확인한 뒤 다시 시도해 주세요.
        </p>
      </div>
      <button
        type="button"
        class="rounded-[14px] bg-toss-blue-500 px-5 py-2.5 text-[15px] font-bold text-white transition-all duration-micro ease-std hover:bg-toss-blue-600 active:translate-y-px"
        @click="refetchAiDashboard"
      >
        다시 시도
      </button>
    </div>

    <template v-else>
      <div class="grid grid-cols-3 gap-6">
        <div class="stagger-item" :style="{ '--i': 0 }">
          <TossStatCard
            emoji="📊"
            label="기간 내 총 상담 건수"
            :value="stats.totalCount"
            unit="건"
            hint="선택 기간 합계"
            accent
          />
        </div>
        <div class="stagger-item" :style="{ '--i': 1 }">
          <TossStatCard
            emoji="🗓️"
            label="어제 상담 건수"
            :value="stats.yesterdayCount"
            unit="건"
            hint="전일 기준"
          />
        </div>
        <div class="stagger-item" :style="{ '--i': 2 }">
          <TossStatCard
            emoji="⭐"
            label="기간 평균 종합 점수"
            :value="stats.avgScore"
            unit="점"
            :decimals="2"
            hint="100점 만점"
          />
        </div>
      </div>

      <div class="stagger-item" :style="{ '--i': 3 }">
        <AiDailyCountLine :data="dailyCount" />
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="stagger-item" :style="{ '--i': 4 }">
          <AiDailyScoreLine :data="dailyScore" />
        </div>
        <div class="stagger-item" :style="{ '--i': 5 }">
          <AiCategoryDonut :data="categoryCount" />
        </div>
      </div>
    </template>
  </div>
</template>
