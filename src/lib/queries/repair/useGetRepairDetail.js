import { useQuery } from '@tanstack/vue-query';

import { getRepairDetail } from '@/apis/repair.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetRepairDetail = (repairUuid) => {
  const { userInfo } = useUserInfoStore();

  const {
    data: repairDetail,
    isLoading: isRepairDetailLoading,
    isError: isRepairDetailError,
    error: repairDetailError,
  } = useQuery({
    queryKey: ['repairDetail', userInfo.aptUuid, repairUuid],
    queryFn: () => getRepairDetail({ aptUuid: userInfo.aptUuid, repairUuid }),
    enabled: !!userInfo.aptUuid && !!repairUuid,
    select: (data) => {
      return data.data.success;
    },
  });

  return {
    repairDetail,
    isRepairDetailLoading,
    isRepairDetailError,
    repairDetailError,
  };
};

export default useGetRepairDetail;
