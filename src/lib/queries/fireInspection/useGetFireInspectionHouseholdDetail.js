import { useQuery } from '@tanstack/vue-query';

import { getFireInspectionHouseholdDetail } from '@/apis/fireInspection.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 세대 점검 상세 조회
const useGetFireInspectionHouseholdDetail = ({
  fireInspectionUuid,
  householdFireInspectionUuid,
}) => {
  const { userInfo } = useUserInfoStore();

  const {
    data: fireInspectionHouseholdDetail,
    isLoading: isFireInspectionHouseholdDetailLoading,
    error: fireInspectionHouseholdDetailError,
  } = useQuery({
    queryKey: [
      'fireInspectionHouseholdDetail',
      userInfo.aptUuid,
      fireInspectionUuid,
      householdFireInspectionUuid,
    ],
    queryFn: () =>
      getFireInspectionHouseholdDetail({
        aptUuid: userInfo.aptUuid,
        fireInspectionUuid: fireInspectionUuid.value,
        householdFireInspectionUuid: householdFireInspectionUuid.value,
      }),
    enabled: () =>
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(fireInspectionUuid.value) &&
      validateQueryEnabledParams(householdFireInspectionUuid.value),
    select: (data) => data.data.success,
  });

  return {
    fireInspectionHouseholdDetail,
    isFireInspectionHouseholdDetailLoading,
    fireInspectionHouseholdDetailError,
  };
};

export default useGetFireInspectionHouseholdDetail;
