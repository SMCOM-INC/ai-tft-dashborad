import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

import { getGlobalNoticeList } from '@/apis/boardGlobalNotice.js';

const useGetGlobalNoticeList = (initialParams) => {
  const params = ref(initialParams);
  const queryKey = computed(() => ['globalNoticeList', params]);

  const {
    data: globalNoticeList,
    isLoading: isGlobalNoticeListLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getGlobalNoticeList(params.value.pageable, params.value.searchParams),
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
    globalNoticeList,
    isGlobalNoticeListLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetGlobalNoticeList;
