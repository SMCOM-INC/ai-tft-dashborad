import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreChargeHistoryExcel } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreChargeHistoryExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: storeChargeHistoryExcel,
    isLoading: isStoreChargeHistoryExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['storeChargeHistoryExcel'],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getStoreChargeHistoryExcel({
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
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchStoreChargeHistoryExcel = async () => {
    await refetch();

    if (!storeChargeHistoryExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: storeChargeHistoryExcel.value,
      type: 'xlsx',
      fileName: '상가 충전내역',
    });
  };

  return {
    isStoreChargeHistoryExcelLoading,
    refetchStoreChargeHistoryExcel,
  };
};

export default useGetStoreChargeHistoryExcel;
