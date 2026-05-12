import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getCommunityList } from '@/apis/boardCommunity.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetCommunityList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const { aptUuid } = userInfo;

  const {
    data: communityPostList,
    isLoading: isCommunityPostListLoading,
    isError: isCommunityPostListError,
    error: communityPostListError,
  } = useQuery({
    queryKey: ['communityPostList', aptUuid, queryString],
    queryFn: () => {
      const commonValue = {
        aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        categoryUuidList: queryString.value.categoryUuidList,
      };

      if (queryString.value.startDate && queryString.value.endDate) {
        return getCommunityList({
          ...commonValue,
          startDate: toStartDateTime(queryString.value.startDate),
          endDate: toEndDateTime(queryString.value.endDate),
        });
      }

      return getCommunityList(commonValue);
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
    communityPostList,
    isCommunityPostListLoading,
    isCommunityPostListError,
    communityPostListError,
  };
};

export default useGetCommunityList;
