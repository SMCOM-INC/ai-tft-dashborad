import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

import { getCommunityReportDetail } from '@/apis/boardCommunity.js';

const useGetCommunityReportDetail = (aptUuid, communityUuid, initialParams) => {
  const params = ref(initialParams);
  const queryKey = computed(() => [
    'communityReportDetailList',
    aptUuid,
    communityUuid,
    params,
  ]);
  const {
    data: communityReportDetailList,
    isLoading: isCommunityReportDetailListLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getCommunityReportDetail(
        aptUuid,
        communityUuid,
        params.value.pageable,
        params.value.searchParams,
      ),
    select: (data) => ({
      content: data.data.success.content,
      totalPages: data.data.success.totalPages,
      totalElements: data.data.success.totalElements,
      numberOfElements: data.data.success.numberOfElements,
      page: data.data.success.number,
      size: data.data.success.size,
    }),
  });

  return {
    communityReportDetailList,
    isCommunityReportDetailListLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetCommunityReportDetail;
