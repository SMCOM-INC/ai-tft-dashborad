import { useMutation } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getMileageExcel } from '@/apis/parkingMileage.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetMileageExcel = () => {
  const { getQueryString } = useNavigate();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryString = computed(() => getQueryString());

  const {
    mutateAsync: refetchMileageExcel,
    isPending: isMileageExcelLoading,
    isError: isMileageExcelError,
    error: mileageExcelError,
  } = useMutation({
    mutationFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getMileageExcel({
        aptUuid,
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
        remainingMileageLoeFilter: queryString.value.hours,
      });
    },
  });

  return {
    refetchMileageExcel,
    isMileageExcelLoading,
    isMileageExcelError,
    mileageExcelError,
  };
};

export default useGetMileageExcel;
