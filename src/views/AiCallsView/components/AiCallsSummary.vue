<script setup>
  import KpiCard from '@components/common/KpiCard.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import { computed } from 'vue';

  const props = defineProps({
    summary: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  const cards = computed(() => [
    {
      label: '상담 건수',
      value: props.summary.count,
      unit: '건',
      decimals: 0,
    },
    {
      label: '종합 평균',
      value: props.summary.avgScoreTotal,
      unit: '점',
      decimals: 2,
    },
    {
      label: '신속성 평균',
      value: props.summary.avgScoreSpeed,
      unit: '점',
      decimals: 2,
    },
    {
      label: '정확성 평균',
      value: props.summary.avgScoreAccuracy,
      unit: '점',
      decimals: 2,
    },
    {
      label: '전문성 평균',
      value: props.summary.avgScoreProfessionalism,
      unit: '점',
      decimals: 2,
    },
  ]);
</script>

<template>
  <div v-if="isLoading" class="grid grid-cols-5 gap-6">
    <SkeletonBase v-for="i in 5" :key="i" class="h-[112px] rounded-linear-md" />
  </div>
  <div v-else class="grid grid-cols-5 gap-6">
    <KpiCard
      v-for="card in cards"
      :key="card.label"
      :label="card.label"
      :value="card.value"
      :unit="card.unit"
      :decimals="card.decimals"
    />
  </div>
</template>
