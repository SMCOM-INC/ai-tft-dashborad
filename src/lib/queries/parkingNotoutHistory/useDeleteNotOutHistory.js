import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

import { deleteInOutHistory } from '@/apis/parkingInoutHistory.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 미출차 삭제
const useDeleteNotOutHistory = (outHistoryResendRef) => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { navigateReplace, navigateBack, getCurrentRoutePath } = useNavigate();

  const isDetailPage = computed(() => getCurrentRoutePath().includes('detail'));

  const {
    mutateAsync: deleteNotOutHistoryMutationAsync,
    isPending: isDeleteNotOutHistoryPending,
    isError: isDeleteNotOutHistoryError,
    error: deleteNotOutHistoryError,
  } = useMutation({
    // eslint-disable-next-line no-unused-vars
    mutationFn: ({ uuid, skipSuccess = false, skipError = false }) => {
      return deleteInOutHistory({ aptUuid: userInfo.aptUuid, uuid });
    },
    onSuccess: (data, variables) => {
      // 전역 성공 처리 스킵 옵션이 있으면 실행하지 않음
      if (variables.skipSuccess) {
        return;
      }

      queryClient.invalidateQueries(['outHistoryList', userInfo.aptUuid]);

      swalSuccessModal({
        text: '미출차가 삭제되었습니다.',
      });

      if (isDetailPage.value) {
        navigateReplace('/parking/notout-history');
        navigateBack();
      }
    },
    onError: (error, variables) => {
      // 전역 에러 처리 스킵 옵션이 있으면 실행하지 않음
      if (variables.skipError) {
        return;
      }

      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'RE_SEND_IN_OUT_PARKING_COUNT_EXIST': {
          outHistoryResendRef.value.handleOpenModal();
          break;
        }
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    deleteNotOutHistoryMutationAsync,

    isDeleteNotOutHistoryPending,
    isDeleteNotOutHistoryError,
    deleteNotOutHistoryError,
  };
};

export default useDeleteNotOutHistory;
