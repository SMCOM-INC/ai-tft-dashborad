import { useMutation } from '@tanstack/vue-query';

import { patchVoteSubmit } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 투표 제출
const usePatchVoteSubmit = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateTo, getCurrentRoutePath } = useNavigate();

  const formatDate = (date) => {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const utcDate = new Date(date.getTime() - offset);
    return utcDate.toISOString().slice(0, 10);
  };

  const {
    mutateAsync: patchVoteSubmitMutationAsync,
    isPending: isPatchVoteSubmitPending,
  } = useMutation({
    mutationKey: ['patchVoteSubmit'],
    mutationFn: ({
      openVoteDate,
      openVoteHours,
      openVoteMinutes,
      closeVoteDate,
      closeVoteHours,
      closeVoteMinutes,
    }) => {
      return patchVoteSubmit({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
        openVoteDateTime: `${formatDate(openVoteDate)} ${openVoteHours}:${openVoteMinutes}:00`,
        closeVoteDateTime: `${formatDate(closeVoteDate)} ${closeVoteHours}:${closeVoteMinutes}:00`,
      });
    },
    onSuccess: () => {
      const isEditPage = getCurrentRoutePath().includes('edit');

      swalSuccessModal({
        text: `투표가 ${isEditPage ? '수정' : '완성'}되었습니다.`,
      });

      navigateTo(
        `/vote/detail/${getParams().groupUuid}/${getParams().voteUuid}`,
      );
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
    patchVoteSubmitMutationAsync,
    isPatchVoteSubmitPending,
  };
};

export default usePatchVoteSubmit;
