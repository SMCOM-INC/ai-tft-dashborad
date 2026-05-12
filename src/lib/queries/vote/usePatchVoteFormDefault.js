import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchVoteFormDefault } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 기본정보 저장 및 수정
const usePatchVoteFormDefault = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getParams, navigateTo } = useNavigate();

  const {
    mutateAsync: patchVoteFormDefaultMutationAsync,
    isPending: isPatchVoteFormDefaultPending,
    isSuccess: isPatchVoteFormDefaultSuccess,
    reset: resetPatchVoteFormDefault,
  } = useMutation({
    mutationFn: ({
      title,
      voteType,
      voteAuthType,
      content,
      voteManagerName,
      voteManagerPosition,
      imageFileUuidList,
    }) => {
      return patchVoteFormDefault({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
        title,
        voteType,
        voteAuthType,
        content: JSON.stringify(content),
        voteManagerName,
        voteManagerPosition,
        imageFileUuidList,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteFormDetail']);

      swalSuccessModal({ text: '투표 기본정보가 저장되었습니다.' });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'NOT_FOUND_VOTE':
          swalErrorModal({ text: message });
          navigateTo('/vote/list');
          break;
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    patchVoteFormDefaultMutationAsync,
    isPatchVoteFormDefaultPending,
    isPatchVoteFormDefaultSuccess,
    resetPatchVoteFormDefault,
  };
};

export default usePatchVoteFormDefault;
