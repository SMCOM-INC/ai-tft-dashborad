import { useQuery } from '@tanstack/vue-query';

import { getDashboardAptInfo } from '@/apis/dashboard.js';
import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetDashboardAptInfo = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const { hasParkingService } = useCheckParkingService();

  const {
    data: dashboardAptInfo,
    isLoading: isDashboardAptInfoLoading,
    isError: isDashboardAptInfoError,
    refetch: refetchDashboardAptInfo,
  } = useQuery({
    queryKey: ['dashboardAptInfo', aptUuid],
    queryFn: () => getDashboardAptInfo({ aptUuid }),
    select: (data) => {
      const value = data.data.success;

      return {
        regularCount: value.regularCount,
        waitingResidentCount: {
          count: value.waitingResidentCount,
        },
        notOutParkingCount: {
          count: value.notOutParkingCount,
        },
        blackListCount: {
          count: value.blackListCount,
        },
        reservationCount: {
          count: value.inParkingReservationRate,
          subInfo: {
            actual: value.inParkingReservationCount,
            reserved: value.reservationCount,
          },
        },
      };
    },
    enabled: !!aptUuid && hasParkingService.value,
  });

  return {
    dashboardAptInfo,
    isDashboardAptInfoLoading,
    isDashboardAptInfoError,
    refetchDashboardAptInfo,
  };
};

export default useGetDashboardAptInfo;
