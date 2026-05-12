import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getRegularList } from '@/apis/parkingRegular.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetRegularList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString, getCurrentRoutePath } = useNavigate();

  const queryString = computed(() => getQueryString());
  const isHouseholdType = computed(() => {
    return getCurrentRoutePath().includes('house');
  });

  const {
    data: regularList,
    isLoading: isRegularListLoading,
    isError: isRegularListError,
    error: regularListError,
  } = useQuery({
    queryKey: ['regularList', userInfo.aptUuid, queryString, isHouseholdType],
    queryFn: () => {
      return getRegularList({
        aptUuid: userInfo.aptUuid,
        type: isHouseholdType.value ? 'household' : 'business',
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        businessTypeUuidList: queryString.value.businessTypeUuidList,
      });
    },
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
    regularList,
    isRegularListLoading,
    isRegularListError,
    regularListError,
  };
};

export default useGetRegularList;
