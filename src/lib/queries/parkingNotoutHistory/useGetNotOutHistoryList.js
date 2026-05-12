import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getNotOutHistoryList } from '@/apis/parkingNotoutHistory.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetNotOutHistoryList = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: notOutHistoryList,
    isLoading: isNotOutHistoryListLoading,
    isFetching: isNotOutHistoryListFetching,
    isError: isNotOutHistoryListError,
    error: notOutHistoryListError,
  } = useQuery({
    queryKey: ['notOutHistoryList', aptUuid, queryString],
    queryFn: () => {
      const commonValues = {
        aptUuid,
        page: queryString.value.page || 0,
        size: queryString.value.size || 10,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        carTypeList: queryString.value.carTypeList,
      };

      if (queryString.value.startDate && queryString.value.endDate) {
        return getNotOutHistoryList({
          ...commonValues,
          startDateTime: toStartDateTime(queryString.value.startDate),
          endDateTime: toEndDateTime(queryString.value.endDate),
        });
      }

      return getNotOutHistoryList(commonValues);
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
    notOutHistoryList,
    isNotOutHistoryListLoading,
    isNotOutHistoryListFetching,
    isNotOutHistoryListError,
    notOutHistoryListError,
  };
};

export default useGetNotOutHistoryList;
