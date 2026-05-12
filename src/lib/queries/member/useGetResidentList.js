import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getResidentList } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetResidentList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const { aptUuid } = userInfo;

  const {
    data: residentList,
    isLoading: isResidentListLoading,
    isFetching: isResidentListFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['residentList', aptUuid, queryParams],
    queryFn: () => {
      return getResidentList({
        aptUuid,
        page: queryParams.value.page,
        size: queryParams.value.size,
        searchType: queryParams.value.searchType,
        keyword: queryParams.value.keyword,
        state:
          queryParams.value.state === 'all'
            ? undefined
            : queryParams.value.state,
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
    enabled: !!aptUuid,
  });

  return {
    residentList,
    isResidentListLoading,
    isResidentListFetching,
    isError,
    error,
  };
};

export default useGetResidentList;
