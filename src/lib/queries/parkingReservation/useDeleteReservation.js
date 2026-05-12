import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteReservation } from '@/apis/parkingReservation.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: deleteReservationMutation,
    isPending: isDeleteReservationPending,
    isSuccess: isDeleteReservationSuccess,
  } = useMutation({
    mutationFn: ({ reservationUuidList }) => {
      return deleteReservation({
        aptUuid: userInfo.aptUuid,
        visitReservationUuidList: reservationUuidList.join(','),
      });
    },

    onSuccess: () => {
      swalSuccessModal({
        text: '방문예약이 삭제되었습니다.',
      });

      queryClient.invalidateQueries(['reservationList', userInfo.aptUuid]);
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
    deleteReservationMutation,
    isDeleteReservationPending,
    isDeleteReservationSuccess,
  };
};

export default useDeleteReservation;
