import { useMutation } from '@tanstack/vue-query';

import { postNoticePushAlarmResend } from '@/apis/boardNotice.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostNoticePushAlarmResend = (aptUuid) => {
  const {
    mutate: resendNoticePushMutation,
    isPending: isResendNoticePushPending,
    isSuccess: isResendNoticePushSuccess,
    reset: resetResendNoticePush,
  } = useMutation({
    mutationFn: (noticeUuid) => postNoticePushAlarmResend(aptUuid, noticeUuid),
    onSuccess: () => {
      swalSuccessModal({ text: '푸시알림이 재발송되었습니다.' });
    },
    onError: (error) => {
      const message = error?.data?.error?.message;
      swalErrorModal({
        text: message || '푸시알림 재발송에 실패했습니다.',
      });
    },
  });

  return {
    resendNoticePushMutation,
    isResendNoticePushPending,
    isResendNoticePushSuccess,
    resetResendNoticePush,
  };
};

export default usePostNoticePushAlarmResend;
