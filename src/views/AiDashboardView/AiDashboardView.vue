<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import KpiCard from '@components/common/KpiCard.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import AiCategoryDonut from '@views/AiDashboardView/components/AiCategoryDonut.vue';
  import AiDailyCountLine from '@views/AiDashboardView/components/AiDailyCountLine.vue';
  import AiDailyScoreLine from '@views/AiDashboardView/components/AiDailyScoreLine.vue';
  import { computed } from 'vue';

  import { AI_DEFAULT_DATE_RANGE } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetAiDashboard from '@/lib/queries/aiCallCenter/useGetAiDashboard.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const { aiDashboard, isAiDashboardLoading } = useGetAiDashboard();

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
      <div class="space-y-1">
        <h1
          class="font-inter text-[24px] font-semibold tracking-tight text-linear-text"
        >
          대시보드
        </h1>
        <p class="text-[14px] text-linear-text-muted">
          기간별 상담 통계를 한눈에 확인합니다.
        </p>
      </div>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div v-if="isAiDashboardLoading" class="space-y-6">
      <div class="grid grid-cols-3 gap-6">
        <SkeletonBase
          v-for="i in 3"
          :key="i"
          class="h-[112px] rounded-linear-md"
        />
      </div>
      <SkeletonBase class="h-[320px] rounded-linear-md" />
      <div class="grid grid-cols-2 gap-6">
        <SkeletonBase class="h-[320px] rounded-linear-md" />
        <SkeletonBase class="h-[320px] rounded-linear-md" />
      </div>
    </div>

    <template v-else>
      <div class="grid grid-cols-3 gap-6">
        <div class="stagger-item" :style="{ '--i': 0 }">
          <KpiCard
            label="기간 내 총 상담 건수"
            :value="stats.totalCount"
            unit="건"
            pulse
          />
        </div>
        <div class="stagger-item" :style="{ '--i': 1 }">
          <KpiCard
            label="어제 상담 건수"
            :value="stats.yesterdayCount"
            unit="건"
          />
        </div>
        <div class="stagger-item" :style="{ '--i': 2 }">
          <KpiCard
            label="기간 평균 종합 점수"
            :value="stats.avgScore"
            unit="점"
            :decimals="2"
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
