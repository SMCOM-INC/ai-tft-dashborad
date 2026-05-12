import { useQuery } from '@tanstack/vue-query';
import { watchEffect } from 'vue';

import { getVoteFormDetail } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 폼(미완성 조회)
const useGetVoteFormDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateTo } = useNavigate();

  const {
    data: voteFormDetail,
    isLoading: isVoteFormDetailLoading,
    error: voteFormDetailError,
    isError: isVoteFormDetailError,
  } = useQuery({
    queryKey: ['voteFormDetail', userInfo.aptUuid, getParams().voteUuid],
    queryFn: () =>
      getVoteFormDetail({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
      }),
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(getParams().voteUuid),
    select: (data) => data.data.success,
  });

  watchEffect(() => {
    if (isVoteFormDetailError.value) {
      swalErrorModal({
        text: voteFormDetailError.value.data.error.message,
        callback: () => navigateTo('/vote/list'),
      });
    }
  });

  return { voteFormDetail, isVoteFormDetailLoading, isVoteFormDetailError };
};

export default useGetVoteFormDetail;
