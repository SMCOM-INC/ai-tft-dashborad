import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getBlackListList } from '@/apis/parkingBlacklistReject.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetBlackListList = () => {
  const { getQueryString } = useNavigate();

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryString = computed(() => getQueryString());

  const {
    data: blacklistCarList,
    isLoading: isBlacklistCarListLoading,
    isError: isBlacklistCarListError,
    error: blacklistCarListError,
  } = useQuery({
    queryKey: ['blacklistCarList', aptUuid, queryString],
    queryFn: () => {
      const commonValue = {
        aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
      };

      if (queryString.value.startDate && queryString.value.endDate) {
        return getBlackListList({
          ...commonValue,
          startDate: toStartDateTime(queryString.value.startDate),
          endDate: toEndDateTime(queryString.value.endDate),
        });
      }

      return getBlackListList(commonValue);
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
    blacklistCarList,
    isBlacklistCarListLoading,
    isBlacklistCarListError,
    blacklistCarListError,
  };
};

export default useGetBlackListList;
