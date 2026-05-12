import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getVoteList } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 투표리스트 조회 및 검색
const useGetVoteList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const { data: voteList, isLoading: isVoteListLoading } = useQuery({
    queryKey: ['voteList', userInfo.aptUuid, queryString],
    queryFn: () =>
      getVoteList({
        aptUuid: userInfo.aptUuid,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
      }),
    enabled: validateQueryEnabledParams(userInfo.aptUuid),
    select: (data) => data.data.success,
  });

  return { voteList, isVoteListLoading };
};

export default useGetVoteList;
