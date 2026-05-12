import { useQuery } from '@tanstack/vue-query';

import { getStoreInOutHistoryDetail } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreInOutHistoryDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    data: storeInOutHistoryDetail,
    isLoading: isStoreInOutHistoryDetailLoading,
    isError: isStoreInOutHistoryDetailError,
    error: storeInOutHistoryDetailError,
  } = useQuery({
    queryKey: ['storeInOutHistoryDetail', userInfo.aptUuid],
    queryFn: () => {
      return getStoreInOutHistoryDetail({
        aptUuid: userInfo.aptUuid,
        inParkingUuid: getParams().uuid,
      });
    },
    select: (data) => {
      return data.data.success;
    },
    enabled: !!userInfo.aptUuid,
  });

  return {
    storeInOutHistoryDetail,
    isStoreInOutHistoryDetailLoading,
    isStoreInOutHistoryDetailError,
    storeInOutHistoryDetailError,
  };
};

export default useGetStoreInOutHistoryDetail;
