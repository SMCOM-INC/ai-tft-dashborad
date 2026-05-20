<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import AiDistributionBar from '@views/AiEvaluationView/components/AiDistributionBar.vue';
  import AiScoreCard from '@views/AiEvaluationView/components/AiScoreCard.vue';
  import { computed } from 'vue';

  import {
    AI_DEFAULT_DATE_RANGE,
    AI_EVALUATION_SCORE_CARDS,
  } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetAiEvaluation from '@/lib/queries/aiCallCenter/useGetAiEvaluation.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const { aiEvaluation, isAiEvaluationLoading } = useGetAiEvaluation();

  const scoreCardValues = computed(() => ({
    avgScoreTotal: aiEvaluation.value?.avg_score_total ?? 0,
    avgScoreSpeed: aiEvaluation.value?.avg_score_speed ?? 0,
    avgScoreAccuracy: aiEvaluation.value?.avg_score_accuracy ?? 0,
    avgScoreProfessionalism: aiEvaluation.value?.avg_score_professionalism ?? 0,
  }));

  const totalCount = computed(() => aiEvaluation.value?.total_count ?? 0);
  const distribution = computed(() => aiEvaluation.value?.distribution || []);
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-end justify-between">
      <div class="space-y-1">
        <h1
          class="font-inter text-[24px] font-semibold tracking-tight text-linear-text"
        >
          품질평가
        </h1>
        <p class="text-[14px] text-linear-text-muted">
          기간별 평가 점수와 분포를 확인합니다.
        </p>
      </div>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div v-if="isAiEvaluationLoading" class="space-y-6">
      <SkeletonBase class="h-[88px] rounded-linear-md" />
      <div class="grid grid-cols-4 gap-6">
        <SkeletonBase
          v-for="i in 4"
          :key="i"
          class="h-[140px] rounded-linear-md"
        />
      </div>
      <SkeletonBase class="h-[360px] rounded-linear-md" />
    </div>

    <template v-else>
      <div class="stagger-item" :style="{ '--i': 0 }">
        <CardBase>
          <p class="text-[13px] font-medium text-linear-text-secondary">
            기간 내 평가 건수
          </p>
          <p
            class="font-inter text-[28px] font-semibold tracking-tight text-linear-text tabular-nums"
          >
            {{ totalCount.toLocaleString() }}건
          </p>
        </CardBase>
      </div>

      <div class="grid grid-cols-4 gap-6">
        <div
          v-for="(card, i) in AI_EVALUATION_SCORE_CARDS"
          :key="card.key"
          class="stagger-item"
          :style="{ '--i': i + 1 }"
        >
          <AiScoreCard
            :label="card.label"
            :value="scoreCardValues[card.key]"
            :max="card.max"
          />
        </div>
      </div>

      <div class="stagger-item" :style="{ '--i': 5 }">
        <AiDistributionBar :data="distribution" />
      </div>
    </template>
  </div>
</template>
