import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postSurveySmsReservation } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { formatDateObject } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 설문조사 메시지 발송 예약
const usePostSurveySmsReservation = () => {
  const queryClient = useQueryClient();
  const { getCurrentRoutePath } = useNavigate();

  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: createSurveySmsReservationMutationAsync,
    isPending: isCreateSurveySmsReservationPending,
  } = useMutation({
    mutationFn: ({
      surveyUuid,
      reservationDate,
      reservationHours,
      reservationMinutes,
    }) => {
      const sendDateTime = `${formatDateObject(reservationDate, 'hyphen')} ${reservationHours}:${reservationMinutes}:00`;

      return postSurveySmsReservation({
        aptUuid: userInfo.aptUuid,
        surveyUuid,
        sendDateTime,
      });
    },
    onSuccess: () => {
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
    createSurveySmsReservationMutationAsync,
    isCreateSurveySmsReservationPending,
  };
};

export default usePostSurveySmsReservation;
