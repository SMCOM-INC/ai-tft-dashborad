import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getRejectDetail } from '@/apis/parkingBlacklistReject.js';

const useGetRejectDetail = (rejectUuid) => {
  const queryKey = computed(() => ['rejectCarDetail', rejectUuid]);

  const {
    data: rejectCarDetail,
    isLoading: isRejectCarDetailLoading,
    isError: isRejectCarDetailError,
    error: rejectCarDetailError,
  } = useQuery({
    queryKey,
    queryFn: () => getRejectDetail(rejectUuid),
    select: (data) => data.data.success,
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });

  return {
    rejectCarDetail,
    isRejectCarDetailLoading,
    isRejectCarDetailError,
    rejectCarDetailError,
  };
};

export default useGetRejectDetail;
