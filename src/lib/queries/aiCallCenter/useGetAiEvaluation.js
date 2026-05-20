import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAiEvaluation } from '@/apis/aiCallCenter.js';
import { AI_DEFAULT_DATE_RANGE } from '@/constants/aiCallCenter.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';

export const useGetAiEvaluation = () => {
  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const startDate = computed(
    () => queryParams.value.startDate || AI_DEFAULT_DATE_RANGE[0],
  );
  const endDate = computed(
    () => queryParams.value.endDate || AI_DEFAULT_DATE_RANGE[1],
  );

  const {
    data: aiEvaluation,
    isLoading: isAiEvaluationLoading,
    isError: isAiEvaluationError,
    error: aiEvaluationError,
    refetch: refetchAiEvaluation,
  } = useQuery({
    queryKey: ['aiEvaluation', startDate, endDate],
    queryFn: () => {
      return getAiEvaluation({
        startDate: startDate.value,
        endDate: endDate.value,
      });
    },
    enabled: computed(() => !!startDate.value && !!endDate.value),
    select: (response) => response.data,
  });

  return {
    aiEvaluation,
    isAiEvaluationLoading,
    isAiEvaluationError,
    aiEvaluationError,
    refetchAiEvaluation,
  };
};

export default useGetAiEvaluation;
