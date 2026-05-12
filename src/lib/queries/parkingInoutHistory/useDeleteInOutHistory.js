import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteInOutHistory } from '@/apis/parkingInoutHistory.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteInOutHistory = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: deleteInOutHistoryMutationAsync,
    isPending: isDeleteInOutHistoryPending,
    isError: isDeleteInOutHistoryError,
    error: deleteInOutHistoryError,
  } = useMutation({
    // eslint-disable-next-line no-unused-vars
    mutationFn: ({ uuid, skipSuccess = false, skipError = false }) => {
      return deleteInOutHistory({ aptUuid: userInfo.aptUuid, uuid });
    },
    onSuccess: (data, variables) => {
      if (variables.skipSuccess) return;

      queryClient.invalidateQueries(['inOutHistoryList', userInfo.aptUuid]);

      swalSuccessModal({
        title: '삭제 성공',
        text: '입출차가 삭제되었습니다.',
      });

      // 상세 페이지에서 삭제 시 목록으로 이동
      if (getCurrentRoutePath().includes('/parking/inout-history/detail')) {
        navigateTo('/parking/inout-history');
      }
    },
    onError: (error, variables) => {
      if (variables.skipError) throw error;

      const { message } = error.data.error;
      swalErrorModal({ text: message });
    },
  });

  return {
    deleteInOutHistoryMutationAsync,
    isDeleteInOutHistoryError,
    deleteInOutHistoryError,
    isDeleteInOutHistoryPending,
  };
};

export default useDeleteInOutHistory;
