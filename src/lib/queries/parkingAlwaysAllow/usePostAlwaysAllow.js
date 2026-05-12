import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postAlwaysAllow } from '@/apis/parkingAlwaysAllow.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 항상허용 등록
const usePostAlwaysAllow = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { navigateTo } = useNavigate();

  const {
    mutate: postAlwaysAllowMutation,
    isPending: isPostAlwaysAllowPending,
    isSuccess: isPostAlwaysAllowSuccess,
  } = useMutation({
    mutationFn: ({
      carNum,
      dong,
      ho,
      phone,
      visitPurposeUuid,
      memo,
      parkingWallPadAlarm,
    }) => {
      return postAlwaysAllow({
        aptUuid: userInfo.aptUuid,
        carNum,
        dong,
        ho,
        phone,
        visitPurposeUuid,
        memo,
        notificationFlag: parkingWallPadAlarm,
      });
    },
    onSuccess: () => {
      swalSuccessModal({
        title: '항상허용이 등록되었습니다.',
      });
      queryClient.invalidateQueries(['alwaysAllowList', userInfo.aptUuid]);
      navigateTo('/parking/always-allow');
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message,
      });
    },
  });

  return {
    postAlwaysAllowMutation,
    isPostAlwaysAllowPending,
    isPostAlwaysAllowSuccess,
  };
};

export default usePostAlwaysAllow;
