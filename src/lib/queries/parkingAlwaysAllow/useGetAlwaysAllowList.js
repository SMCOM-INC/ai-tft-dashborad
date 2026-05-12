import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAlwaysAllowList } from '@/apis/parkingAlwaysAllow.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 항상허용 리스트 조회
const useGetAlwaysAllowList = () => {
  const { getQueryString } = useNavigate();
  const { userInfo } = useUserInfoStore();
  const queryString = computed(() => getQueryString());

  const {
    data: alwaysAllowList,
    isLoading: isAlwaysAllowListLoading,
    isError: isAlwaysAllowError,
    error: alwaysAllowError,
  } = useQuery({
    queryKey: ['alwaysAllowList', userInfo.aptUuid, queryString],
    queryFn: () =>
      getAlwaysAllowList({
        aptUuid: userInfo.aptUuid,
        size: queryString.value.size,
        page: queryString.value.page,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
      }),
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
    alwaysAllowList,
    isAlwaysAllowListLoading,
    isAlwaysAllowError,
    alwaysAllowError,
  };
};

export default useGetAlwaysAllowList;
