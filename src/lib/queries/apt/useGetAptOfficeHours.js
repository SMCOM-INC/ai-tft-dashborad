import { useQuery } from '@tanstack/vue-query';

import { getAptOfficeHours } from '@/apis/apt.js';

const useGetAptOfficeHours = (aptUuid) => {
  const {
    data: aptOfficeHours,
    isLoading: isAptOfficeHoursLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['aptOfficeHours', aptUuid],
    queryFn: () => getAptOfficeHours(aptUuid),
    select: (data) => data.data.success,
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });

  return { aptOfficeHours, isAptOfficeHoursLoading, isError, error };
};

export default useGetAptOfficeHours;
