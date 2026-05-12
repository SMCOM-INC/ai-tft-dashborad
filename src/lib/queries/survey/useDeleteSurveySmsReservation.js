import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteSurveySmsReservation } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 메시지 발송 예약 삭제
export const useDeleteSurveySmsReservation = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: deleteSurveySmsReservationMutationAsync,
    isPending: isDeleteSurveySmsReservationPending,
  } = useMutation({
    mutationFn: ({ surveyUuid, reservationUuid }) => {
      return deleteSurveySmsReservation({
        aptUuid: userInfo.aptUuid,
        surveyUuid,
        reservationUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveySmsReservationList']);

      if (getCurrentRoutePath().includes('detail')) {
        queryClient.invalidateQueries(['surveyDetailDefault']);
      } else {
        queryClient.invalidateQueries(['surveyList']);
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
    deleteSurveySmsReservationMutationAsync,
    isDeleteSurveySmsReservationPending,
  };
};

export default useDeleteSurveySmsReservation;
