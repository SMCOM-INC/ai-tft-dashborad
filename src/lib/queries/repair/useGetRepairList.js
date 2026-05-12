import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getRepairList } from '@/apis/repair.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetRepairList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: repairList,
    isLoading: isRepairListLoading,
    isError: isRepairListError,
    error: repairListError,
    refetch,
  } = useQuery({
    queryKey: ['repairList', userInfo.aptUuid, queryString],
    queryFn: () => {
      return getRepairList({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        type: queryString.value.searchType,
        keyword: queryString.value.keyword,
        startDate: queryString.value.startDate
          ? toStartDateTime(queryString.value.startDate)
          : null,
        endDate: queryString.value.endDate
          ? toEndDateTime(queryString.value.endDate)
          : null,
        visitStartDate: queryString.value.visitStartDate
          ? toStartDateTime(queryString.value.visitStartDate)
          : null,
        visitEndDate: queryString.value.visitEndDate
          ? toEndDateTime(queryString.value.visitEndDate)
          : null,
        state: queryString.value.state,
      });
    },
    enabled: !!userInfo.aptUuid,
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
    repairList,
    isRepairListLoading,
    isRepairListError,
    repairListError,
    refetch,
  };
};

export default useGetRepairList;
