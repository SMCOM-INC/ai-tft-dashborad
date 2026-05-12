<script setup>
  import ApexCharts from 'apexcharts';
  import { onMounted, onUnmounted, ref, watch } from 'vue';

  import { DASHBOARD_CHARTS_CAR_TYPE } from '@/constants/dashboard.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  // 헬퍼 함수
  const getLegendPosition = () => {
    return window.innerWidth > 1742 ? 'right' : 'bottom';
  };

  const formatChartData = (data) => {
    const series = DASHBOARD_CHARTS_CAR_TYPE.map((type) => data[type.key] || 0);
    const hasData = series.some((value) => value > 0);

    return {
      series: hasData ? series : [],
      labels: DASHBOARD_CHARTS_CAR_TYPE.map((type) => type.label),
      colors: DASHBOARD_CHARTS_CAR_TYPE.map((type) => type.color),
      hasData,
    };
  };

  const initChart = () => {
    if (!chartRef.value) return;

    const { series, labels, colors, hasData } = formatChartData(props.data);

    const options = {
      series,
      chart: {
        type: 'donut',
        height: 250,
        fontFamily: 'Pretendard, sans-serif',
      },
      labels,
      colors,
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: hasData,
        position: getLegendPosition(),
        fontSize: '16px',
        width: 209,
        markers: {
          width: 12,
          height: 12,
        },
        itemMargin: {
          vertical: 8,
        },
        formatter(seriesName, optionsValue) {
          const value =
            optionsValue.w.globals.series[optionsValue.seriesIndex] || 0;

          return `<div style="display: flex; justify-content: space-between;">
            <span style="font-weight: 400; padding-left: 8px;">${seriesName}</span>
            <span style="font-weight: 500">${value}%</span>
          </div>`;
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '40%',
          },
        },
      },
      stroke: {
        width: 0,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => `${val}%`,
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Pretendard, sans-serif',
        },
      },
      noData: {
        text: '데이터가 없습니다',
        align: 'center',
        style: {
          color: '#6C727E',
          fontSize: '14px',
          fontFamily: 'Pretendard, sans-serif',
        },
      },
    };

    chart = new ApexCharts(chartRef.value, options);
    chart.render();
  };

  const handleResize = () => {
    if (chart) {
      chart.updateOptions({
        legend: {
          position: getLegendPosition(),
        },
      });
    }
  };

  onMounted(() => {
    initChart();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    if (chart) {
      chart.destroy();
    }
    window.removeEventListener('resize', handleResize);
  });

  watch(
    () => props.data,
    (newData) => {
      if (chart) {
        const { series, hasData } = formatChartData(newData);

        chart.updateOptions({
          series,
          legend: {
            show: hasData,
          },
        });
      }
    },
    { deep: true },
  );
</script>

<template>
  <div ref="chartRef" class="w-full"></div>
</template>

<style scoped>
  :deep(.apexcharts-legend-series) {
    width: 94% !important;
  }

  :deep(.apexcharts-legend-text) {
    width: 100% !important;
  }
</style>
