import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteVoteSmsReservation } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 메시지 발송 예약 삭제
export const useDeleteVoteSmsReservation = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: deleteVoteSmsReservationMutationAsync,
    isPending: isDeleteVoteSmsReservationPending,
  } = useMutation({
    mutationFn: ({ voteUuid, reservationUuid }) => {
      return deleteVoteSmsReservation({
        aptUuid: userInfo.aptUuid,
        voteUuid,
        reservationUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteSmsReservationList']);

      if (getCurrentRoutePath().includes('detail')) {
        queryClient.invalidateQueries(['voteDetailDefault']);
      } else {
        queryClient.invalidateQueries(['voteList']);
      }
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    deleteVoteSmsReservationMutationAsync,
    isDeleteVoteSmsReservationPending,
  };
};

export default useDeleteVoteSmsReservation;
