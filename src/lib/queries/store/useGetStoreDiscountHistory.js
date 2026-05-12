import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreDiscountHistoryList } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreDiscountHistory = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: storeDiscountHistory,
    isLoading: isStoreDiscountHistoryLoading,
    isError: isStoreDiscountHistoryError,
    error: storeDiscountHistoryError,
  } = useQuery({
    queryKey: ['storeDiscountHistory', userInfo.aptUuid, queryString],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getStoreDiscountHistoryList({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page || 0,
        size: queryString.value.size || 10,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        startDateTime: queryString.value?.startDate
          ? toStartDateTime(queryString.value.startDate)
          : defaultRange.startDate,
        endDateTime: queryString.value?.endDate
          ? toEndDateTime(queryString.value.endDate)
          : defaultRange.endDate,
        settlementFlag: queryString.value.settlementFlag === 'NORMAL',
      });
    },
    select: (data) => {
      const {
        content,
        totalPages,
        totalElements,
        numberOfElements,
        number,
        size,
      } = data.data.success;

      return {
        content,
        totalPages,
        totalElements,
        numberOfElements,
        page: number,
        size,
      };
    },
    enabled: !!userInfo.aptUuid,
  });

  return {
    storeDiscountHistory,
    isStoreDiscountHistoryLoading,
    isStoreDiscountHistoryError,
    storeDiscountHistoryError,
  };
};

export default useGetStoreDiscountHistory;
