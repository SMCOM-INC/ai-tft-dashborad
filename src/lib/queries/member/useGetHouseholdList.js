import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getHouseholdList } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetHouseholdList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const { aptUuid } = userInfo;

  const {
    data: householdList,
    isLoading: isHouseholdListLoading,
    isFetching: isHouseholdListFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['householdList', aptUuid, queryParams],
    queryFn: () => {
      return getHouseholdList({
        aptUuid,
        page: queryParams.value.page,
        size: queryParams.value.size,
        searchType: queryParams.value.searchType,
        keyword: queryParams.value.keyword,
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
    householdList,
    isHouseholdListLoading,
    isHouseholdListFetching,
    isError,
    error,
  };
};

export default useGetHouseholdList;
