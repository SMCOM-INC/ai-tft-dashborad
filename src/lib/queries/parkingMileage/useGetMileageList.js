import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getMileageList } from '@/apis/parkingMileage.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetMileageList = () => {
  const { getQueryString } = useNavigate();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryString = computed(() => getQueryString());

  const {
    data: householdMileageList,
    isLoading: isHouseholdMileageListLoading,
    isError: isHouseholdMileageListError,
    error: householdMileageListError,
  } = useQuery({
    queryKey: ['householdMileageList', aptUuid, queryString],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getMileageList({
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
    enabled: !!aptUuid,
    select: (data) => ({
      content: data.data.success.content,
      totalPages: data.data.success.totalPages,
      totalElements: data.data.success.totalElements,
      numberOfElements: data.data.success.numberOfElements,
      page: data.data.success.number,
      size: data.data.success.size,
    }),
  });

  return {
    householdMileageList,
    isHouseholdMileageListLoading,
    isHouseholdMileageListError,
    householdMileageListError,
  };
};

export default useGetMileageList;
