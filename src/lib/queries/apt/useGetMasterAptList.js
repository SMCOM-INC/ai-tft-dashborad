import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getMasterAptList } from '@/apis/apt.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';

const useGetMasterAptList = (options = {}) => {
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  // options가 computed인지 일반 객체인지 확인
  const resolvedOptions = computed(() => {
    return options.value ?? options;
  });

  const queryParams = computed(() => ({
    page: resolvedOptions.value.pageable?.page ?? queryString.value.page ?? 0,
    size: resolvedOptions.value.pageable?.size ?? queryString.value.size ?? 10,
    searchType:
      resolvedOptions.value.searchParams?.searchType ??
      queryString.value.searchType,
    keyword:
      resolvedOptions.value.searchParams?.keyword ?? queryString.value.keyword,
    contentUuidList:
      resolvedOptions.value.searchParams?.contentUuidList ??
      queryString.value.contentUuidList,
  }));

  const {
    data: aptTableList,
    isLoading: isAptListLoading,
    isError: isAptListError,
    error: aptListError,
  } = useQuery({
    queryKey: ['aptList', queryString, resolvedOptions],
    queryFn: () => {
      return getMasterAptList(queryParams.value);
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
    aptTableList,
    isAptListLoading,
    isAptListError,
    aptListError,
  };
};

export default useGetMasterAptList;
