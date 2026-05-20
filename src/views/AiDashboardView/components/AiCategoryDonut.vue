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
      colors: chartPalette,
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
                color: '#6C727E',
                formatter: (w) =>
                  w.globals.seriesTotals
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString(),
              },
              value: {
                fontSize: '20px',
                fontFamily: "'Inter', 'Pretendard', sans-serif",
                color: '#08090A',
                fontWeight: 600,
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

  onMounted(() => {
    if (!chartRef.value) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render();
  });

  onUnmounted(() => {
    if (chart) chart.destroy();
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
  <CardBase>
    <div class="space-y-4">
      <h2
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        대분류별 상담 분포
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
