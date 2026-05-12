import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getCommunityReportList } from '@/apis/boardCommunity.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetCommunityReportList = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const { getQueryString } = useNavigate();

  const queryString = computed(() => getQueryString());

  const {
    data: communityReportList,
    isLoading: isCommunityReportListLoading,
    isError: isCommunityReportListError,
    error: communityReportListError,
  } = useQuery({
    queryKey: ['communityReportList', aptUuid, queryString],
    queryFn: () => {
      return getCommunityReportList({
        aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        categoryUuidList: queryString.value.categoryUuidList,
        startDate: queryString.value.startDate
          ? toStartDateTime(queryString.value.startDate)
          : null,
        endDate: queryString.value.endDate
          ? toEndDateTime(queryString.value.endDate)
          : null,
      });
    },
    enabled: !!aptUuid,
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
    communityReportList,
    isCommunityReportListLoading,
    isCommunityReportListError,
    communityReportListError,
  };
};

export default useGetCommunityReportList;
