import { useQuery } from '@tanstack/vue-query';

import { getDashboardMileageHouseCount } from '@/apis/dashboard.js';
import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetDashboardMileageHouseCount = ({ date }) => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const { hasParkingService } = useCheckParkingService();

  const {
    data: dashboardMileageHouseCount,
    isLoading: isDashboardMileageHouseCountLoading,
    isError: isDashboardMileageHouseCountError,
    refetch: refetchDashboardMileageHouseCount,
  } = useQuery({
    queryKey: ['dashboardMileageHouseCount', aptUuid, date],
    queryFn: () =>
      getDashboardMileageHouseCount({
        aptUuid,
        yearMonth: date.value,
      }),
    select: (data) => {
      return data.data.success;
    },
    enabled: !!aptUuid && !!date.value && hasParkingService.value,
  });

  return {
    dashboardMileageHouseCount,
    isDashboardMileageHouseCountLoading,
    isDashboardMileageHouseCountError,
    refetchDashboardMileageHouseCount,
  };
};

export default useGetDashboardMileageHouseCount;
