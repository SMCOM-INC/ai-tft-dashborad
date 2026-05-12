import { useQuery } from '@tanstack/vue-query';

import { getAptList } from '@/apis/apt.js';

const useGetAptList = () => {
  const {
    data: aptNameList,
    isLoading: isAptNameListLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['aptNameList'],
    queryFn: () => getAptList(),
    select: (data) =>
      data.data.success.map((item) => ({
        aptUuid: item.uuid,
        aptName: item.name,
      })),
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 7 * 24 * 60 * 60 * 1000,
  });

  return { aptNameList, isAptNameListLoading, isError, error };
};

export default useGetAptList;
