<script setup>
  import TossCard from '@views/AiDashboardView/components/TossCard.vue';
  import ApexCharts from 'apexcharts';
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

  import { apexBase, mergeChartOptions } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;
  let simInterval = null;

  const isEmpty = computed(() => Object.keys(props.data || {}).length === 0);

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
        type: 'area',
        height: 280,
        group: 'dashboard-lines',
        id: 'daily-count',
      },
      colors: ['#3182F6'],
      stroke: { curve: 'smooth', width: 2.5 },
      markers: { size: 0, hover: { size: 5 } },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.18,
          opacityTo: 0,
          stops: [0, 95],
        },
      },
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

  const renderChart = async () => {
    await nextTick();
    if (!chartRef.value || chart) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render().then(() => startLiveSim());
  };

  const destroyChart = () => {
    if (simInterval) {
      clearInterval(simInterval);
      simInterval = null;
    }
    if (chart) {
      chart.destroy();
      chart = null;
    }
  };

  onMounted(() => {
    if (!isEmpty.value) renderChart();
  });

  onUnmounted(destroyChart);

  watch(isEmpty, (empty) => {
    if (empty) destroyChart();
    else renderChart();
  });

  watch(seriesData, (newData) => {
    if (chart) chart.updateSeries([{ name: '상담 건수', data: newData }]);
  });
</script>

<template>
  <TossCard>
    <div class="space-y-4">
      <header class="flex items-start gap-2.5">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-toss-blue-50"
        >
          <span class="font-tossface text-[18px] leading-none">📈</span>
        </span>
        <div class="space-y-0.5">
          <h2 class="text-[16px] font-bold tracking-tight text-toss-grey-900">
            일자별 상담 건수
          </h2>
          <p class="text-[12px] text-toss-grey-500">
            선택 기간 동안의 일별 상담량 추이
          </p>
        </div>
      </header>
      <div
        v-if="isEmpty"
        class="flex h-[280px] flex-col items-center justify-center gap-1 text-center"
      >
        <p class="text-[13px] font-medium text-toss-grey-700">
          표시할 데이터가 없어요
        </p>
        <p class="text-[12px] text-toss-grey-500">
          선택한 기간에 상담 내역이 없어요
        </p>
      </div>
      <div v-else ref="chartRef" class="w-full"></div>
    </div>
  </TossCard>
</template>
