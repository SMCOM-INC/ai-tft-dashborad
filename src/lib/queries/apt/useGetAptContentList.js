import { useQuery } from '@tanstack/vue-query';

import { getAptContentList } from '@/apis/apt.js';

const useGetAptContentList = (options = {}) => {
  const {
    data: contentList,
    isLoading: isContentListLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['contentList'],
    queryFn: getAptContentList,
    select: (data) => data.data.success,
    enabled: options.enabled !== undefined ? options.enabled : true,
  });

  return { contentList, isContentListLoading, isError, error, isSuccess };
};

export default useGetAptContentList;
