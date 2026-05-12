import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getInOutHistoryList } from '@/apis/parkingInoutHistory.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetInOutHistoryList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: inOutHistoryList,
    isLoading: isInOutHistoryListLoading,
    isFetching: isInOutHistoryListFetching,
    isError: isInOutHistoryListError,
    error: inOutHistoryListError,
  } = useQuery({
    queryKey: ['inOutHistoryList', userInfo.aptUuid, queryString],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getInOutHistoryList({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        startDateTime: queryString.value.startDate
          ? toStartDateTime(queryString.value.startDate)
          : defaultRange.startDate,
        endDateTime: queryString.value.endDate
          ? toEndDateTime(queryString.value.endDate)
          : defaultRange.endDate,
        registTypeList: queryString.value.registTypeList || [],
        carTypeList: queryString.value.carTypeList || [],
        visitPurposeUuidList: queryString.value.visitPurposeUuidList || [],
        businessTypeUuidList: queryString.value.businessTypeUuidList || [],
      });
    },
    select: (data) => ({
      content: data.data.success.content,
      totalPages: data.data.success.totalPages,
      totalElements: data.data.success.totalElements,
      numberOfElements: data.data.success.numberOfElements,
      page: data.data.success.number,
      size: data.data.success.size,
    }),
    enabled: !!userInfo.aptUuid,
  });

  return {
    inOutHistoryList,
    isInOutHistoryListLoading,
    isInOutHistoryListFetching,
    isInOutHistoryListError,
    inOutHistoryListError,
  };
};

export default useGetInOutHistoryList;
