import { useQuery } from '@tanstack/vue-query';

import { getDashboardParkingCount } from '@/apis/dashboard.js';
import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetDashboardParkingCount = ({ date, parkingType }) => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const { hasParkingService } = useCheckParkingService();

  const {
    data: dashboardParkingCount,
    isLoading: isDashboardParkingCountLoading,
    isError: isDashboardParkingCountError,
    refetch: refetchDashboardParkingCount,
  } = useQuery({
    queryKey: ['dashboardParkingCount', aptUuid, date, parkingType],
    queryFn: () =>
      getDashboardParkingCount({
        aptUuid,
        date: date.value,
        inOutType: parkingType.value,
      }),
    select: (data) => {
      return data.data.success;
    },
    enabled: !!aptUuid && !!date.value && hasParkingService.value,
  });

  return {
    dashboardParkingCount,
    isDashboardParkingCountLoading,
    isDashboardParkingCountError,
    refetchDashboardParkingCount,
  };
};

export default useGetDashboardParkingCount;
