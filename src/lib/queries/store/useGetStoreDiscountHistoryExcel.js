import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreDiscountHistoryExcel } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreDiscountHistoryExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: storeDiscountHistoryExcel,
    isLoading: isStoreDiscountHistoryExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['storeDiscountHistoryExcel'],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getStoreDiscountHistoryExcel({
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
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchStoreDiscountHistoryExcel = async () => {
    await refetch();

    if (!storeDiscountHistoryExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: storeDiscountHistoryExcel.value,
      type: 'xlsx',
      fileName: '상가 할인내역',
    });
  };

  return {
    isStoreDiscountHistoryExcelLoading,
    refetchStoreDiscountHistoryExcel,
  };
};

export default useGetStoreDiscountHistoryExcel;
