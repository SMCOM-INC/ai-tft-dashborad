<script setup>
  import AnimatedNumber from '@components/common/AnimatedNumber.vue';
  import CardBase from '@components/common/CardBase.vue';
  import { computed } from 'vue';

  import { AI_EVALUATION_SCORE_RANGES } from '@/constants/aiCallCenter.js';
  import { scorePalette } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    totalCount: { type: Number, default: 0 },
    avgScoreTotal: { type: Number, default: 0 },
    distribution: { type: Array, default: () => [] },
  });

  const segments = computed(() => {
    const lookup = new Map(
      props.distribution.map((item) => [item.range, item.count]),
    );
    const total = props.distribution.reduce(
      (sum, item) => sum + (item.count ?? 0),
      0,
    );

    return AI_EVALUATION_SCORE_RANGES.map((range, i) => {
      const count = lookup.get(range.key) ?? 0;
      return {
        key: range.key,
        label: range.label,
        color: scorePalette[i],
        count,
        percent: total > 0 ? (count / total) * 100 : 0,
      };
    });
  });

  const activeSegments = computed(() =>
    segments.value.filter((seg) => seg.count > 0),
  );

  const hasDistribution = computed(() => activeSegments.value.length > 0);
</script>

<template>
  <CardBase>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
      <div class="flex flex-col gap-1.5">
        <p class="text-[13px] font-medium text-linear-text-secondary">
          기간 내 평가 건수
        </p>
        <div class="flex items-baseline gap-1.5">
          <p
            class="font-inter text-[40px] font-semibold leading-none tracking-tight text-linear-accent tabular-nums"
          >
            <AnimatedNumber :value="props.totalCount" />
          </p>
          <span class="text-[15px] font-medium text-linear-text-secondary">
            건
          </span>
        </div>
      </div>

      <div class="flex-1 space-y-2.5 sm:border-l sm:border-linear-border sm:pl-8">
        <div class="flex items-baseline justify-between">
          <p class="text-[13px] font-medium text-linear-text-secondary">
            점수 구간 구성
          </p>
          <div class="flex items-baseline gap-1">
            <span class="text-[12px] text-linear-text-muted">종합 평균</span>
            <span
              class="font-inter text-[16px] font-semibold tracking-tight text-linear-text tabular-nums"
            >
              <AnimatedNumber :value="props.avgScoreTotal" :decimals="2" />
            </span>
            <span class="text-[12px] text-linear-text-muted">점</span>
          </div>
        </div>

        <div
          class="flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-linear-muted"
        >
          <div
            v-for="seg in activeSegments"
            :key="seg.key"
            class="h-full transition-all duration-data ease-out-quint"
            :style="`width: ${seg.percent}%; background-color: ${seg.color}`"
            :title="`${seg.label} · ${seg.count}건`"
          ></div>
        </div>

        <div v-if="hasDistribution" class="flex flex-wrap gap-x-4 gap-y-1.5">
          <div
            v-for="seg in activeSegments"
            :key="seg.key"
            class="flex items-center gap-1.5"
          >
            <span
              class="h-2 w-2 rounded-full"
              :style="`background-color: ${seg.color}`"
            ></span>
            <span class="text-[12px] text-linear-text-secondary">
              {{ seg.label }}
            </span>
            <span class="text-[12px] font-medium text-linear-text tabular-nums">
              {{ Math.round(seg.percent) }}%
            </span>
          </div>
        </div>
        <p v-else class="text-[12px] text-linear-text-muted">
          평가 데이터가 없습니다
        </p>
      </div>
    </div>
  </CardBase>
</template>
