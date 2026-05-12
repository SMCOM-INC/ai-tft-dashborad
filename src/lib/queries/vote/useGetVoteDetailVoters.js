import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getVoteDetailVoters } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 참여자 조회
const useGetVoteDetailVoters = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const { data: voteDetailVoters, isLoading: isVoteDetailVotersLoading } =
    useQuery({
      queryKey: [
        'voteDetailVoters',
        userInfo.aptUuid,
        getParams().voteUuid,
        queryString,
      ],
      queryFn: () => {
        return getVoteDetailVoters({
          aptUuid: userInfo.aptUuid,
          voteUuid: getParams().voteUuid,
          size: queryString.value?.size,
          page: queryString.value?.page,
          searchType: queryString.value.searchType,
          keyword: queryString.value.keyword,
          statusSearchType: queryString.value.statusSearchType,
        });
      },
      enabled:
        validateQueryEnabledParams(userInfo.aptUuid) &&
        validateQueryEnabledParams(getParams().voteUuid),
      select: (data) => {
        const {
          content,
          totalPages,
          totalElements,
          numberOfElements,
          number,
          size,
        } = data.data.success;

        return {
          content,
          totalPages,
          totalElements,
          numberOfElements,
          page: number,
          size,
        };
      },
    });

  return { voteDetailVoters, isVoteDetailVotersLoading };
};

export default useGetVoteDetailVoters;
