import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreChargeHistoryList } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreChargeHistory = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: storeChargeHistory,
    isLoading: isStoreChargeHistoryLoading,
    isError: isStoreChargeHistoryError,
    error: storeChargeHistoryError,
  } = useQuery({
    queryKey: ['storeChargeHistory', userInfo.aptUuid, queryString],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getStoreChargeHistoryList({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page || 0,
        size: queryString.value.size || 10,
        keyword: queryString.value.keyword,
        startDateTime: queryString.value?.startDate
          ? toStartDateTime(queryString.value.startDate)
          : defaultRange.startDate,
        endDateTime: queryString.value?.endDate
          ? toEndDateTime(queryString.value.endDate)
          : defaultRange.endDate,
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
      } = data.data.success.storeParkingMinuteChargeList;

      return {
        content,
        totalPages,
        totalElements,
        numberOfElements,
        page: number,
        size,
        totalChargeMinute: data.data.success.totalChargeMinute,
        totalChargePrice: data.data.success.totalChargePrice,
        chargeMinute: data.data.success.chargeMinute,
        chargePrice: data.data.success.chargePrice,
        refundChargeMinute: data.data.success.refundChargeMinute,
        refundChargePrice: data.data.success.refundChargePrice,
      };
    },
    enabled: !!userInfo.aptUuid,
  });

  return {
    storeChargeHistory,
    isStoreChargeHistoryLoading,
    isStoreChargeHistoryError,
    storeChargeHistoryError,
  };
};

export default useGetStoreChargeHistory;
