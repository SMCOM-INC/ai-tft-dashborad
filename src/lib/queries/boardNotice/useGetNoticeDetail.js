import { useQuery } from '@tanstack/vue-query';

import { getNoticeDetail } from '@/apis/boardNotice.js';

const useGetNoticeDetail = (aptUuid, noticeUuid) => {
  const {
    data: noticeDetail,
    isLoading: isNoticeDetailLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['noticeDetail', aptUuid, noticeUuid],
    queryFn: () => getNoticeDetail(aptUuid, noticeUuid),
    select: (data) => data.data.success,
  });

  return { noticeDetail, isNoticeDetailLoading, isError, error };
};

export default useGetNoticeDetail;
