import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreList } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: storeList,
    isLoading: isStoreListLoading,
    isError: isStoreListError,
    error: storeListError,
  } = useQuery({
    queryKey: ['storeList', userInfo.aptUuid, queryString],
    queryFn: () => {
      return getStoreList({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page || 0,
        size: queryString.value.size || 10,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
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
    enabled: !!userInfo.aptUuid,
  });

  return {
    storeList,
    isStoreListLoading,
    isStoreListError,
    storeListError,
  };
};

export default useGetStoreList;
