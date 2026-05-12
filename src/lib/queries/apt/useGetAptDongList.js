import { useQuery } from '@tanstack/vue-query';

import { getAptDongList } from '@/apis/apt.js';

const useGetAptDongList = (aptUuid) => {
  const {
    data: householdDongList,
    refetch: refetchHouseholdDongList,
    isLoading: isHouseholdDongListLoading,
    isError: isHouseholdDongListError,
    isSuccess: isHouseholdDongListSuccess,
    error: householdDongListError,
  } = useQuery({
    queryKey: ['householdDongList', aptUuid],
    queryFn: () => getAptDongList(aptUuid),
    select: (data) => data.data.success,
  });

  return {
    householdDongList,
    isHouseholdDongListLoading,
    isHouseholdDongListError,
    householdDongListError,
    isHouseholdDongListSuccess,
    refetchHouseholdDongList,
  };
};

export default useGetAptDongList;
