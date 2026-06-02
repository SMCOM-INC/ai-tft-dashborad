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

  const tossPalette = [
    '#3182F6',
    '#15B36B',
    '#F2A024',
    '#F04452',
    '#8B95A1',
    '#1B64DA',
    '#B0B8C1',
    '#4E5968',
  ];

  const chartRef = ref(null);
  let chart = null;

  const isEmpty = computed(() => Object.keys(props.data || {}).length === 0);

  const formatted = computed(() => {
    const entries = Object.entries(props.data).sort(([, a], [, b]) => b - a);
    return {
      labels: entries.map(([label]) => label),
      series: entries.map(([, count]) => count),
    };
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: formatted.value.series,
      labels: formatted.value.labels,
      chart: { ...apexBase.chart, type: 'donut', height: 280 },
      colors: tossPalette,
      stroke: { width: 2, colors: ['#FFFFFF'] },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            size: '60%',
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: false,
                label: '총',
                fontSize: '12px',
                fontFamily: "'Inter', 'Pretendard', sans-serif",
                color: '#6B7684',
                formatter: (w) =>
                  w.globals.seriesTotals
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString(),
              },
              value: {
                fontSize: '20px',
                fontFamily: "'Inter', 'Pretendard', sans-serif",
                color: '#191F28',
                fontWeight: 700,
              },
            },
          },
        },
      },
      legend: {
        ...apexBase.legend,
        position: 'right',
        offsetY: 16,
      },
      tooltip: {
        ...apexBase.tooltip,
        y: { formatter: (val) => `${val}건` },
      },
    });

  const renderChart = async () => {
    await nextTick();
    if (!chartRef.value || chart) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render();
  };

  const destroyChart = () => {
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

  watch(formatted, (newValue) => {
    if (chart) {
      chart.updateOptions({
        series: newValue.series,
        labels: newValue.labels,
      });
    }
  });
</script>

<template>
  <TossCard>
    <div class="space-y-4">
      <header class="flex items-start gap-2.5">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-toss-grey-100"
        >
          <span class="font-tossface text-[18px] leading-none">🍩</span>
        </span>
        <div class="space-y-0.5">
          <h2 class="text-[16px] font-bold tracking-tight text-toss-grey-900">
            대분류별 상담 분포
          </h2>
          <p class="text-[12px] text-toss-grey-500">상담 카테고리 비중</p>
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
          선택한 기간에 분류된 상담이 없어요
        </p>
      </div>
      <div v-else ref="chartRef" class="w-full"></div>
    </div>
  </TossCard>
</template>
