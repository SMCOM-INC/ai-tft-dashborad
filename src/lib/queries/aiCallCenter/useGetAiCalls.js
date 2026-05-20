import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAiCalls } from '@/apis/aiCallCenter.js';
import { AI_DEFAULT_DATE_RANGE } from '@/constants/aiCallCenter.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';

export const useGetAiCalls = () => {
  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const startDate = computed(
    () => queryParams.value.startDate || AI_DEFAULT_DATE_RANGE[0],
  );
  const endDate = computed(
    () => queryParams.value.endDate || AI_DEFAULT_DATE_RANGE[1],
  );

  const {
    data: aiCalls,
    isLoading: isAiCallsLoading,
    isError: isAiCallsError,
    error: aiCallsError,
    refetch: refetchAiCalls,
  } = useQuery({
    queryKey: ['aiCalls', startDate, endDate],
    queryFn: () => {
      return getAiCalls({
        startDate: startDate.value,
        endDate: endDate.value,
      });
    },
    enabled: computed(() => !!startDate.value && !!endDate.value),
    select: (response) => response.data,
  });

  return {
    aiCalls,
    isAiCallsLoading,
    isAiCallsError,
    aiCallsError,
    refetchAiCalls,
  };
};

export default useGetAiCalls;
