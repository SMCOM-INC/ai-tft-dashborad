import { computed } from 'vue';

import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';

const useDashboardChartData = ({ isError, data, mockData }) => {
  const { hasParkingService } = useCheckParkingService();

  const chartData = computed(() => {
    if (isError.value || !hasParkingService.value) {
      return mockData;
    }

    return data.value;
  });

  return {
    chartData,
  };
};

export default useDashboardChartData;
