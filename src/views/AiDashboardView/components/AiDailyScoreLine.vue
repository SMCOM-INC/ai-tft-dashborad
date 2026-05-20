<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import ApexCharts from 'apexcharts';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

  import {
    apexBase,
    chartPalette,
    mergeChartOptions,
  } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  const seriesData = computed(() => {
    const entries = Object.entries(props.data).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return entries.map(([date, score]) => ({ x: date, y: Number(score) }));
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: [{ name: '평균 종합점수', data: seriesData.value }],
      chart: {
        ...apexBase.chart,
        type: 'line',
        height: 280,
        group: 'dashboard-lines',
        id: 'daily-score',
      },
      colors: [chartPalette[2]],
      stroke: { curve: 'smooth', width: 2.5 },
      markers: { size: 0, hover: { size: 5 } },
      yaxis: {
        ...apexBase.yaxis,
        min: 0,
        max: 100,
        title: { text: '점수', style: { fontSize: '12px', color: '#6C727E' } },
      },
      tooltip: {
        ...apexBase.tooltip,
        y: { formatter: (val) => `${val.toFixed(2)}점` },
      },
    });

  onMounted(() => {
    if (!chartRef.value) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render();
  });

  onUnmounted(() => {
    if (chart) chart.destroy();
  });

  watch(seriesData, (newData) => {
    if (chart) chart.updateSeries([{ name: '평균 종합점수', data: newData }]);
  });
</script>

<template>
  <CardBase>
    <div class="space-y-4">
      <h2
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        일자별 평균 점수
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
