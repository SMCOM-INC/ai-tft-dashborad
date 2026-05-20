<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import ApexCharts from 'apexcharts';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

  import { AI_EVALUATION_SCORE_RANGES } from '@/constants/aiCallCenter.js';
  import {
    apexBase,
    mergeChartOptions,
    scorePalette,
  } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  const formatted = computed(() => {
    const lookup = new Map(props.data.map((item) => [item.range, item.count]));
    return AI_EVALUATION_SCORE_RANGES.map((r, i) => ({
      label: r.label,
      count: lookup.get(r.key) ?? 0,
      color: scorePalette[i],
    }));
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: [
        {
          name: '콜 수',
          data: formatted.value.map((d) => ({
            x: d.label,
            y: d.count,
            fillColor: d.color,
          })),
        },
      ],
      chart: { ...apexBase.chart, type: 'bar', height: 320 },
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderRadiusApplication: 'end',
          columnWidth: '55%',
          distributed: true,
        },
      },
      colors: scorePalette,
      legend: { show: false },
      xaxis: {
        ...apexBase.xaxis,
        categories: formatted.value.map((d) => d.label),
      },
      yaxis: {
        ...apexBase.yaxis,
        title: { text: '콜 수', style: { fontSize: '12px', color: '#6C727E' } },
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
        series: [
          {
            name: '콜 수',
            data: newValue.map((d) => ({
              x: d.label,
              y: d.count,
              fillColor: d.color,
            })),
          },
        ],
        xaxis: { categories: newValue.map((d) => d.label) },
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
        점수 구간별 분포
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
