import { useQuery } from '@tanstack/vue-query';

import { getGlobalNoticeDetail } from '@/apis/boardGlobalNotice.js';

const useGetGlobalNoticeDetail = (globalNoticeUuid) => {
  const {
    data: globalNoticeDetail,
    isLoading: isGlobalNoticeDetailLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['globalNoticeDetail', globalNoticeUuid],
    queryFn: () => getGlobalNoticeDetail(globalNoticeUuid),
    select: (data) => data.data.success,
    enabled: !!globalNoticeUuid,
  });

  return {
    globalNoticeDetail,
    isGlobalNoticeDetailLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetGlobalNoticeDetail;
