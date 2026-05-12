import { useQuery } from '@tanstack/vue-query';

import { getFireInspectionList } from '@/apis/fireInspection.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 점검 목록 조회
const useGetFireInspectionList = () => {
  const { userInfo } = useUserInfoStore();

  const { data: fireInspectionList, isLoading: isFireInspectionListLoading } =
    useQuery({
      queryKey: ['fireInspectionList', userInfo.aptUuid],
      queryFn: () =>
        getFireInspectionList({
          aptUuid: userInfo.aptUuid,
        }),
      enabled: validateQueryEnabledParams(userInfo.aptUuid),
      select: (data) => {
        return { content: data.data.success };
      },
    });

  return { fireInspectionList, isFireInspectionListLoading };
};

export default useGetFireInspectionList;
