<script setup>
  import ApexCharts from 'apexcharts';
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

  import {
    DASHBOARD_CHART_X_AXIS_LABEL_STYLE,
    DASHBOARD_CHART_Y_AXIS_LABEL_STYLE,
    DASHBOARD_CHARTS_CAR_TYPE_WIDTH_PARKING_COUNT,
    DASHBOARD_PARKING_TYPE_OPTIONS,
  } from '@/constants/dashboard.js';

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
    parkingType: {
      type: String,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  const hasData = computed(() => {
    return (
      props.data.length > 0 && props.data.some((item) => item.totalCount > 0)
    );
  });

  const Y_AXIS_TICK_COUNT = 10;

  const createYAxisConfig = (data) => {
    const maxCount = Math.max(...data.map((item) => item.totalCount || 0));

    // y축 10개로 고정, 값에 맞게 간격 계산
    const tickInterval = Math.ceil(maxCount / Y_AXIS_TICK_COUNT);
    const yMax = tickInterval * Y_AXIS_TICK_COUNT;

    return {
      min: 0,
      max: yMax,
      tickAmount: Y_AXIS_TICK_COUNT,
    };
  };

  const formatSeries = (data) => {
    return DASHBOARD_CHARTS_CAR_TYPE_WIDTH_PARKING_COUNT.map((type) => ({
      name: type.label,
      data: data.map((item) => {
        const carTypeCount = item.carTypeCounts?.find(
          (ct) => ct.carType === type.key,
        );
        return carTypeCount?.count || 0;
      }),
    }));
  };

  const formatChartData = (data) => {
    return {
      categories: Array.from({ length: 24 }, (_, i) => `${i}시`),
      series: formatSeries(data),
      colors: DASHBOARD_CHARTS_CAR_TYPE_WIDTH_PARKING_COUNT.map(
        (type) => type.color,
      ),
    };
  };

  const createTooltip = (data) => {
    return ({ dataPointIndex }) => {
      const item = data[dataPointIndex];
      const totalCount = item.totalCount || 0;

      const carTypeRows = DASHBOARD_CHARTS_CAR_TYPE_WIDTH_PARKING_COUNT.map(
        (carType) => {
          const carTypeCount = item.carTypeCounts?.find(
            (ct) => ct.carType === carType.key,
          );
          const count = carTypeCount?.count || 0;
          return `
          <div style="display: flex; align-items: center; gap: 6px; font-size: 12px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${carType.color};"></div>
            <span>${carType.label}: ${count}대</span>
          </div>
        `;
        },
      ).join('');

      const parkingTypeLabel =
        DASHBOARD_PARKING_TYPE_OPTIONS.find(
          (opt) => opt.value === props.parkingType,
        )?.label || '';

      return `
        <div style="padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; font-family: Pretendard, sans-serif;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px;">${item.hour}시</div>
          <div style="font-size: 12px; margin-bottom: 8px; color: #6B7280;">총 ${parkingTypeLabel} 수: ${totalCount}대</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${carTypeRows}
          </div>
        </div>
      `;
    };
  };

  const initChart = () => {
    if (!chartRef.value) return;

    const yAxisConfig = createYAxisConfig(props.data);
    const { categories, series, colors } = formatChartData(props.data);

    const options = {
      series,
      chart: {
        type: 'bar',
        height: 340,
        stacked: true,
        toolbar: {
          show: false,
        },
        fontFamily: 'Pretendard, sans-serif',
        animations: {
          animateGradually: {
            enabled: false,
          },
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
        },
      },
      dataLabels: {
        enabled: false,
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
          style: DASHBOARD_CHART_Y_AXIS_LABEL_STYLE,
        },
      },
      grid: {
        borderColor: '#E5E7EB',
      },
      colors,
      fill: {
        opacity: 1,
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '14px',
        markers: {
          width: 12,
          height: 12,
          radius: 12,
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        custom: createTooltip(props.data),
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: 'darken',
            value: 0.15,
          },
        },
      },
    };

    chart = new ApexCharts(chartRef.value, options);
    chart.render();
  };

  onMounted(() => {
    if (hasData.value) {
      initChart();
    }
  });

  onUnmounted(() => {
    if (chart) {
      chart.destroy();
    }
  });

  watch(
    () => props.data,
    async (newData) => {
      // Case 1: 데이터 없음 - 차트 제거
      if (!hasData.value) {
        if (chart) {
          chart.destroy();
          chart = null;
        }
        return;
      }

      // Case 2: 데이터 있음 + 차트 없음 - 차트 생성
      if (!chart) {
        await nextTick();
        initChart();
        return;
      }

      // Case 3: 데이터 있음 + 차트 있음 - 차트 업데이트
      const { series } = formatChartData(newData);
      const yAxisConfig = createYAxisConfig(newData);

      chart.updateOptions(
        {
          yaxis: {
            min: yAxisConfig.min,
            max: yAxisConfig.max,
            tickAmount: yAxisConfig.tickAmount,
            labels: {
              style: DASHBOARD_CHART_Y_AXIS_LABEL_STYLE,
            },
          },
        },
        false,
        false,
      );

      chart.updateSeries(series, true);
    },
    { deep: true },
  );
</script>

<template>
  <div v-if="hasData" ref="chartRef" class="w-full"></div>
  <div
    v-else
    class="flex h-[340px] w-full items-center justify-center text-gray-500 pretendard-16Regular"
  >
    데이터가 존재하지 않습니다.
  </div>
</template>
