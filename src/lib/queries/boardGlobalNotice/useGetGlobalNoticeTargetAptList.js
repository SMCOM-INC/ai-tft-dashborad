import { useQuery } from '@tanstack/vue-query';

import { getGlobalNoticeTargetAptList } from '@/apis/boardGlobalNotice.js';

const useGetGlobalNoticeTargetAptList = () => {
  const {
    data: globalNoticeTargetAptList,
    isLoading: isGlobalNoticeTargetAptListLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['globalNoticeTargetAptList'],
    queryFn: () => getGlobalNoticeTargetAptList(),
    select: (data) => data.data.success,
  });

  return {
    globalNoticeTargetAptList,
    isGlobalNoticeTargetAptListLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetGlobalNoticeTargetAptList;
