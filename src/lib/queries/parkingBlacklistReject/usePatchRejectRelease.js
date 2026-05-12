import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchRejectRelease } from '@/apis/parkingBlacklistReject.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePatchRejectRelease = (rejectUuid) => {
  const queryClient = useQueryClient();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: patchRejectReleaseMutationAsync,
    isPending: isPatchRejectReleasePending,
    isError: isPatchRejectReleaseError,
    error: patchRejectReleaseError,
  } = useMutation({
    mutationFn: (data) => patchRejectRelease(rejectUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['rejectCarDetail', rejectUuid]);
      swalSuccessModal({
        text: '주차 거부 해제 반려되었습니다.',
      });
      navigateTo('/parking/restriction/parking-reject');
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || '주차 거부 해제 반려에 실패했습니다.',
      });
    },
  });

  return {
    patchRejectReleaseMutationAsync,
    isPatchRejectReleasePending,
    isPatchRejectReleaseError,
    patchRejectReleaseError,
  };
};

export default usePatchRejectRelease;
