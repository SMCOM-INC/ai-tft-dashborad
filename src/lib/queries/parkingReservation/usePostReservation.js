import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postReservation } from '@/apis/parkingReservation.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePostReservation = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutate: postReservationMutation,
    isPending: isPostReservationPending,
    isSuccess: isPostReservationSuccess,
  } = useMutation({
    mutationFn: ({
      carNum,
      dong,
      ho,
      inParkingScheduledDate,
      outParkingScheduledDate,
      phone,
      visitPurposeUuid,
      parkingWallPadAlarm,
    }) => {
      return postReservation({
        aptUuid: userInfo.aptUuid,
        carNum,
        dong,
        ho,
        inParkingScheduledDate,
        outParkingScheduledDate,
        phone,
        visitPurposeUuid,
        notificationFlag: parkingWallPadAlarm,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reservationList', userInfo.aptUuid]);

      swalSuccessModal({ text: '방문예약이 등록되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message,
      });
    },
  });

  return {
    postReservationMutation,
    isPostReservationPending,
    isPostReservationSuccess,
  };
};

export default usePostReservation;
