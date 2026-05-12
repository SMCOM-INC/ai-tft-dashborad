import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getRejectList } from '@/apis/parkingBlacklistReject.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetRejectList = () => {
  const { getQueryString } = useNavigate();

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryString = computed(() => getQueryString());

  const {
    data: rejectCarList,
    isLoading: isRejectCarListLoading,
    isError: isRejectCarListError,
    error: rejectCarListError,
  } = useQuery({
    queryKey: ['rejectCarList', aptUuid, queryString],
    queryFn: () => {
      const commonValue = {
        aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
      };

      if (queryString.value.startDate && queryString.value.endDate) {
        return getRejectList({
          ...commonValue,
          startDate: queryString.value.startDate,
          endDate: queryString.value.endDate,
        });
      }

      return getRejectList(commonValue);
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
    rejectCarList,
    isRejectCarListLoading,
    isRejectCarListError,
    rejectCarListError,
  };
};

export default useGetRejectList;
