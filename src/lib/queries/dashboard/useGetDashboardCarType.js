import { useQuery } from '@tanstack/vue-query';

import { getDashboardCarType } from '@/apis/dashboard.js';
import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetDashboardCarType = ({ date }) => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const { hasParkingService } = useCheckParkingService();

  const {
    data: dashboardCarType,
    isLoading: isDashboardCarTypeLoading,
    isError: isDashboardCarTypeError,
    refetch: refetchDashboardCarType,
  } = useQuery({
    queryKey: ['dashboardCarType', aptUuid, date],
    queryFn: () =>
      getDashboardCarType({
        aptUuid,
        yearMonth: date.value,
      }),
    select: (data) => {
      const apiData = data.data.success;

      // 배열을 객체로 변환: [{ carType: "GENERAL", rate: 80.65 }] -> { GENERAL: 80.65 }
      const carTypeObj = {};
      apiData.forEach((item) => {
        carTypeObj[item.carType] = item.rate;
      });

      return carTypeObj;
    },
    enabled: !!aptUuid && !!date.value && hasParkingService.value,
  });

  return {
    dashboardCarType,
    isDashboardCarTypeLoading,
    isDashboardCarTypeError,
    refetchDashboardCarType,
  };
};

export default useGetDashboardCarType;
