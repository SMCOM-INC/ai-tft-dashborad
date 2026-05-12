import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getNotOutHistoryListExcel } from '@/apis/parkingNotoutHistory.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 미출차내역 엑셀 다운로드
export const useGetNotOutHistoryListExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: notOutHistoryListExcel,
    isLoading: isNotOutHistoryListExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['NotOutHistoryListExcel'],
    queryFn: () => {
      const commonValues = {
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        carTypeList: queryString.value.carTypeList || [],
      };

      if (queryString.value.startDate && queryString.value.endDate) {
        return getNotOutHistoryListExcel({
          ...commonValues,
          startDateTime: toStartDateTime(queryString.value.startDate),
          endDateTime: toEndDateTime(queryString.value.endDate),
        });
      }

      return getNotOutHistoryListExcel(commonValues);
    },
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchNotOutHistoryListExcel = async () => {
    await refetch();

    if (!notOutHistoryListExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: notOutHistoryListExcel.value,
      type: 'xlsx',
      fileName: '미출차 내역',
    });
  };

  return {
    notOutHistoryListExcel,
    isNotOutHistoryListExcelLoading,
    refetchNotOutHistoryListExcel,
  };
};

export default useGetNotOutHistoryListExcel;
