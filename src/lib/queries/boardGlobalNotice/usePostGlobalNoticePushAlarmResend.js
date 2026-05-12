import { useMutation } from '@tanstack/vue-query';

import { postGlobalNoticePushAlarmResend } from '@/apis/boardGlobalNotice.js';

const usePostGlobalNoticePushAlarmResend = () => {
  const {
    mutate: resendGlobalNoticePushAlarm,
    isPending: isResendGlobalNoticePushAlarmLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (globalNoticeUuid) =>
      postGlobalNoticePushAlarmResend(globalNoticeUuid),
  });

  return {
    resendGlobalNoticePushAlarm,
    isResendGlobalNoticePushAlarmLoading,
    isError,
    error,
  };
};

export default usePostGlobalNoticePushAlarmResend;
