import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getReservationList } from '@/apis/parkingReservation.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import {
  getDateTimeRange,
  toEndDateTime,
  toStartDateTime,
} from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetReservationList = () => {
  const { getQueryString } = useNavigate();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryString = computed(() => getQueryString());

  const {
    data: reservationList,
    isLoading: isReservationListLoading,
    isError: isReservationListError,
    error: reservationListError,
  } = useQuery({
    queryKey: ['reservationList', aptUuid, queryString],
    queryFn: () => {
      const defaultRange = getDateTimeRange('thisMonth');

      return getReservationList({
        aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        startDate: queryString.value.startDate
          ? toStartDateTime(queryString.value.startDate)
          : defaultRange.startDate,
        endDate: queryString.value.endDate
          ? toEndDateTime(queryString.value.endDate)
          : defaultRange.endDate,
        inParkingFlag: queryString.value.inParkingFlag || null,
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
    reservationList,
    isReservationListLoading,
    isReservationListError,
    reservationListError,
  };
};

export default useGetReservationList;
