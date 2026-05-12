import { computed } from 'vue';

import { DASHBOARD_ERROR_MESSAGES } from '@/constants/dashboard.js';
import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';

const useDashboardChartError = (isError) => {
  const { hasParkingService } = useCheckParkingService();

  const showOverlay = computed(() => {
    return !hasParkingService.value || isError.value;
  });

  const overlayMessage = computed(() => {
    if (!hasParkingService.value) {
      return DASHBOARD_ERROR_MESSAGES.SERVICE_UNAVAILABLE;
    }
    if (isError.value) {
      return DASHBOARD_ERROR_MESSAGES.API_ERROR;
    }
    return '';
  });

  const showDatePicker = computed(() => {
    // 주차 서비스 등록 & 에러 없음
    return hasParkingService.value && !isError.value;
  });

  const showRetryButton = computed(() => {
    // 주차 서비스 등록 & API 에러 발생
    return hasParkingService.value && isError.value;
  });

  return {
    showOverlay,
    overlayMessage,
    showDatePicker,
    showRetryButton,
  };
};

export default useDashboardChartError;
