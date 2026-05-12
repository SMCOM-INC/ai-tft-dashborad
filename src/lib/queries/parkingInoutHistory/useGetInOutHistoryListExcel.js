import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getInOutHistoryListExcel } from '@/apis/parkingInoutHistory.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 입출차내역 엑셀 다운로드
export const useGetInOutHistoryListExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: inOutHistoryListExcel,
    isLoading: isInOutHistoryListExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['inOutHistoryListExcel'],
    queryFn: () => {
      // queryFn 내부에서 써야함. api 호출마다 재갱신되어야함
      const defaultRange = getDateTimeRange('thisMonth');

      return getInOutHistoryListExcel({
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
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchInOutHistoryListExcel = async () => {
    await refetch();

    if (!inOutHistoryListExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: inOutHistoryListExcel.value,
      type: 'xlsx',
      fileName: '입출차 내역',
    });
  };

  return {
    inOutHistoryListExcel,
    isInOutHistoryListExcelLoading,
    refetchInOutHistoryListExcel,
  };
};

export default useGetInOutHistoryListExcel;
