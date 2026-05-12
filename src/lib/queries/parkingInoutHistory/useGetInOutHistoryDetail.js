import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getInOutHistoryDetail } from '@/apis/parkingInoutHistory.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetInOutHistoryDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const queryKey = computed(() => [
    'inOutHistoryDetail',
    userInfo.aptUuid,
    getParams().uuid,
  ]);

  const {
    data: inOutHistoryDetail,
    isLoading: isInOutHistoryDetailLoading,
    isError: isInOutHistoryDetailError,
    error: inOutHistoryDetailError,
  } = useQuery({
    queryKey,
    queryFn: () => getInOutHistoryDetail(userInfo.aptUuid, getParams().uuid),
    select: (data) => data.data.success,
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });

  return {
    inOutHistoryDetail,
    isInOutHistoryDetailLoading,
    isInOutHistoryDetailError,
    inOutHistoryDetailError,
  };
};

export default useGetInOutHistoryDetail;
