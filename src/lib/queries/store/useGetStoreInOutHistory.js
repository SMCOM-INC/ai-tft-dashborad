import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreInOutHistoryList } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreInOutHistory = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const getSettlementFlag = (flag) => {
    switch (flag) {
      case 'NORMAL':
        return true;
      case 'EXTRA':
        return false;
      case 'ALL':
        return undefined;
      default:
        return undefined;
    }
  };

  const {
    data: storeInOutHistory,
    isLoading: isStoreInOutHistoryLoading,
    isError: isStoreInOutHistoryError,
    error: storeInOutHistoryError,
  } = useQuery({
    queryKey: ['storeInOutHistory', userInfo.aptUuid, queryString],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getStoreInOutHistoryList({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        keyword: queryString.value.keyword,
        startDateTime: queryString.value.startDate
          ? toStartDateTime(queryString.value.startDate)
          : defaultRange.startDate,
        endDateTime: queryString.value.endDate
          ? toEndDateTime(queryString.value.endDate)
          : defaultRange.endDate,
        settlementFlag: getSettlementFlag(queryString.value.settlementFlag),
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
    storeInOutHistory,
    isStoreInOutHistoryLoading,
    isStoreInOutHistoryError,
    storeInOutHistoryError,
  };
};

export default useGetStoreInOutHistory;
