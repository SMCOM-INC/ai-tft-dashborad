<script setup>
  import ApexCharts from 'apexcharts';
  import { onMounted, onUnmounted, ref, watch } from 'vue';

  import {
    DASHBOARD_CHART_X_AXIS_LABEL_STYLE,
    DASHBOARD_CHART_Y_AXIS_LABEL_STYLE,
  } from '@/constants/dashboard.js';

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  const Y_AXIS_UNIT = 20;
  const Y_AXIS_MARGIN = 20;

  const createYAxisConfig = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return { min: 0, max: 20, tickAmount: 4 };
    }

    const maxRate = Math.max(...data.map((item) => item.rate || 0));
    const roundedMax = Math.ceil(maxRate / Y_AXIS_UNIT) * Y_AXIS_UNIT;
    const yMax = roundedMax + Y_AXIS_MARGIN;
    const tickAmount = yMax / Y_AXIS_UNIT;

    return {
      min: 0,
      max: yMax,
      tickAmount,
    };
  };

  const formatChartData = (data) => {
    return {
      categories: data.map((item) => item.rangeLabel),
      series: data.map((item) => item.rate),
    };
  };

  const createTooltip = (data) => {
    return ({ series, seriesIndex, dataPointIndex }) => {
      const item = data[dataPointIndex];
      const value = series[seriesIndex][dataPointIndex];

      return `
        <div class="p-2" style="background: white; border: 1px solid #e5e7eb; border-radius: 4px; font-family: Pretendard, sans-serif;">
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px;">${item.rangeLabel}</div>
          <div style="font-size: 12px;">세대 수 비율 : ${value}%</div>
        </div>
      `;
    };
  };

  const initChart = () => {
    if (!chartRef.value || !props.data) return;

    const yAxisConfig = createYAxisConfig(props.data);
    const { categories, series } = formatChartData(props.data);

    const options = {
      series: [
        {
          name: '세대 수 비율',
          data: series,
        },
      ],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: {
          show: false,
        },
        fontFamily: 'Pretendard, sans-serif',
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}%`,
        offsetY: -24,
        style: {
          fontSize: '14px',
          fontWeight: 500,
          colors: ['#111927'],
        },
      },
      xaxis: {
        categories,
        labels: {
          style: DASHBOARD_CHART_X_AXIS_LABEL_STYLE,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: yAxisConfig.min,
        max: yAxisConfig.max,
        tickAmount: yAxisConfig.tickAmount,
        labels: {
          formatter: (value) => `${value}%`,
          style: DASHBOARD_CHART_Y_AXIS_LABEL_STYLE,
        },
      },
      colors: ['#2563EB'],
      fill: {
        opacity: 1,
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        custom: createTooltip(props.data),
      },
    };

    chart = new ApexCharts(chartRef.value, options);
    chart.render();
  };

  onMounted(() => {
    initChart();
  });

  onUnmounted(() => {
    if (chart) {
      chart.destroy();
    }
  });

  watch(
    () => props.data,
    (newData) => {
      if (chart) {
        const yAxisConfig = createYAxisConfig(newData);
        const { categories, series } = formatChartData(newData);

        chart.updateOptions({
          series: [
            {
              name: '세대 수 비율',
              data: series,
            },
          ],
          xaxis: {
            categories,
            labels: {
              style: DASHBOARD_CHART_X_AXIS_LABEL_STYLE,
            },
          },
          yaxis: {
            min: yAxisConfig.min,
            max: yAxisConfig.max,
            tickAmount: yAxisConfig.tickAmount,
            labels: {
              formatter: (value) => `${value}%`,
              style: DASHBOARD_CHART_Y_AXIS_LABEL_STYLE,
            },
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
