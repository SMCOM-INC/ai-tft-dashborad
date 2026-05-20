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
  let simInterval = null;

  const seriesData = computed(() => {
    const entries = Object.entries(props.data).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return entries.map(([date, count]) => ({ x: date, y: count }));
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: [{ name: '상담 건수', data: seriesData.value }],
      chart: {
        ...apexBase.chart,
        type: 'line',
        height: 280,
        group: 'dashboard-lines',
        id: 'daily-count',
      },
      colors: [chartPalette[0]],
      stroke: { curve: 'smooth', width: 2.5 },
      markers: { size: 0, hover: { size: 5 } },
      yaxis: {
        ...apexBase.yaxis,
        title: { text: '건수', style: { fontSize: '12px', color: '#6C727E' } },
        labels: {
          ...apexBase.yaxis.labels,
          formatter: (val) => Math.round(val).toString(),
        },
      },
      tooltip: {
        ...apexBase.tooltip,
        y: { formatter: (val) => `${val}건` },
      },
    });

  const startLiveSim = () => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    simInterval = setInterval(() => {
      if (!chart || seriesData.value.length === 0) return;
      const data = [...seriesData.value];
      const last = data[data.length - 1];
      const noise = Math.round(last.y * (Math.random() * 0.1 - 0.05));
      data[data.length - 1] = {
        x: last.x,
        y: Math.max(0, last.y + noise),
      };
      chart.updateSeries([{ name: '상담 건수', data }], false);
    }, 1500);
  };

  onMounted(() => {
    if (!chartRef.value) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render().then(() => startLiveSim());
  });

  onUnmounted(() => {
    if (simInterval) clearInterval(simInterval);
    if (chart) chart.destroy();
  });

  watch(seriesData, (newData) => {
    if (chart) chart.updateSeries([{ name: '상담 건수', data: newData }]);
  });
</script>

<template>
  <CardBase>
    <div class="space-y-4">
      <h2
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        일자별 상담 건수
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
