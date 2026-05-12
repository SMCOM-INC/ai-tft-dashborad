import { useQuery } from '@tanstack/vue-query';

import { getAptMallDetail } from '@/apis/aptMall.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 주문 상세 조회
const useGetAptMallDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const { data: aptMallDetail, isLoading: isAptMallDetailLoading } = useQuery({
    queryKey: ['aptMallDetail', userInfo.aptUuid, getParams().aptMallUuid],
    queryFn: () =>
      getAptMallDetail({
        aptUuid: userInfo.aptUuid,
        aptMallUuid: getParams().aptMallUuid,
      }),
    enabled: !!getParams().aptMallUuid,
    select: (data) => data.data.success,
  });

  return { aptMallDetail, isAptMallDetailLoading };
};

export default useGetAptMallDetail;
