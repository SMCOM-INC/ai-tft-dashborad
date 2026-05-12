import { useQuery } from '@tanstack/vue-query';
import { watchEffect } from 'vue';

import { getVoteDetailDefault } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 기본
const useGetVoteDetailDefault = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateTo } = useNavigate();

  const {
    data: voteDetailDefault,
    isLoading: isVoteDetailDefaultLoading,
    error: voteDetailDefaultError,
    isError: isVoteDetailDefaultError,
  } = useQuery({
    queryKey: ['voteDetailDefault', userInfo.aptUuid, getParams().voteUuid],
    queryFn: () =>
      getVoteDetailDefault({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
      }),
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(getParams().voteUuid),
    select: (data) => data.data.success,
  });

  watchEffect(() => {
    if (isVoteDetailDefaultError.value) {
      swalErrorModal({
        text: voteDetailDefaultError.value.data.error.message || '에러 발생',
        icon: 'error',
        callback: () => navigateTo('/vote/list'),
      });
    }
  });

  return { voteDetailDefault, isVoteDetailDefaultLoading };
};

export default useGetVoteDetailDefault;
