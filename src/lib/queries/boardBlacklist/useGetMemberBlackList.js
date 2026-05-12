import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

import { getMemberBlackList } from '@/apis/boardBlacklist.js';

const useGetMemberBlackList = (aptUuid, initialParams) => {
  const params = ref(initialParams);
  const queryKey = computed(() => ['memberBlackList', aptUuid, params.value]);

  const {
    data: memberBlackLists,
    isLoading: isBlackListsLoading,
    isPending: isBlackListPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => {
      const queryParams = {
        aptUuid,
        page: params.value.pageable.page,
        size: params.value.pageable.size,
        sort: params.value.pageable.sort,
      };
      return getMemberBlackList(aptUuid, queryParams);
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
    memberBlackLists,
    isBlackListsLoading,
    isBlackListPending,
    isError,
    error,
    refetch,
  };
};

export default useGetMemberBlackList;
