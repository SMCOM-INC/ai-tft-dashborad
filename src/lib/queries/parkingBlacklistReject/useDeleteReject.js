import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteReject } from '@/apis/parkingBlacklistReject.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 거부차량 삭제
const useDeleteReject = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const queryClient = useQueryClient();
  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: deleteRejectMutationAsync,
    isPending: isDeleteRejectPending,
    isError: isDeleteRejectError,
    error: deleteRejectError,
  } = useMutation({
    mutationFn: async ({ rejectUuidList }) => {
      await Promise.all(
        rejectUuidList.map((rejectUuid) => deleteReject({ rejectUuid })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rejectCarList', aptUuid]);
      swalSuccessModal({
        text: '거부차량이 삭제되었습니다.',
      });

      // 상세 페이지에서 삭제 시 목록으로 이동
      if (
        getCurrentRoutePath().includes(
          '/parking/restriction/parking-reject/detail',
        )
      ) {
        navigateTo('/parking/restriction/parking-reject');
      }
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;

      switch (errorCode) {
        default:
          swalErrorModal({ text: message || '거부차량 삭제에 실패했습니다.' });
      }
    },
  });

  return {
    deleteRejectMutationAsync,
    isDeleteRejectPending,
    isDeleteRejectError,
    deleteRejectError,
  };
};

export default useDeleteReject;
