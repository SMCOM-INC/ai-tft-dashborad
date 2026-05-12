import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreInOutHistoryExcel } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import { getDateTimeRange } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreInOutHistoryExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: storeInOutHistoryExcel,
    isLoading: isStoreInOutHistoryExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['storeInOutHistoryExcel'],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getStoreInOutHistoryExcel({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page || 0,
        size: queryString.value.size || 10,
        keyword: queryString.value.keyword,
        startDateTime:
          getDateTimeRange(queryString.value.period)?.startDate ||
          defaultRange.startDate,
        endDateTime:
          getDateTimeRange(queryString.value.period)?.endDate ||
          defaultRange.endDate,
        settlementFlag: queryString.value.settlementFlag === 'NORMAL',
      });
    },
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchStoreInOutHistoryExcel = async () => {
    await refetch();

    if (!storeInOutHistoryExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: storeInOutHistoryExcel.value,
      type: 'xlsx',
      fileName: '상가 입출차내역',
    });
  };

  return {
    isStoreInOutHistoryExcelLoading,
    refetchStoreInOutHistoryExcel,
  };
};

export default useGetStoreInOutHistoryExcel;
