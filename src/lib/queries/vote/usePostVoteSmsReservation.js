import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postVoteSmsReservation } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { formatDateObject } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 투표 메시지 발송 예약
const usePostVoteSmsReservation = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: createVoteSmsReservationMutationAsync,
    isPending: isCreateVoteSmsReservationPending,
  } = useMutation({
    mutationFn: ({
      voteUuid,
      reservationDate,
      reservationHours,
      reservationMinutes,
    }) => {
      const date = `${formatDateObject(reservationDate, 'hyphen')} ${reservationHours}:${reservationMinutes}:00`;

      return postVoteSmsReservation({
        aptUuid: userInfo.aptUuid,
        voteUuid,
        startDate: date,
      });
    },
    onSuccess: () => {
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
    createVoteSmsReservationMutationAsync,
    isCreateVoteSmsReservationPending,
  };
};

export default usePostVoteSmsReservation;
