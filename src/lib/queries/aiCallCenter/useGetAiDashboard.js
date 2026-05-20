import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAiDashboard } from '@/apis/aiCallCenter.js';
import { AI_DEFAULT_DATE_RANGE } from '@/constants/aiCallCenter.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';

export const useGetAiDashboard = () => {
  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const startDate = computed(
    () => queryParams.value.startDate || AI_DEFAULT_DATE_RANGE[0],
  );
  const endDate = computed(
    () => queryParams.value.endDate || AI_DEFAULT_DATE_RANGE[1],
  );

  const {
    data: aiDashboard,
    isLoading: isAiDashboardLoading,
    isError: isAiDashboardError,
    error: aiDashboardError,
    refetch: refetchAiDashboard,
  } = useQuery({
    queryKey: ['aiDashboard', startDate, endDate],
    queryFn: () => {
      return getAiDashboard({
        startDate: startDate.value,
        endDate: endDate.value,
      });
    },
    enabled: computed(() => !!startDate.value && !!endDate.value),
    select: (response) => response.data,
  });

  return {
    aiDashboard,
    isAiDashboardLoading,
    isAiDashboardError,
    aiDashboardError,
    refetchAiDashboard,
  };
};

export default useGetAiDashboard;
