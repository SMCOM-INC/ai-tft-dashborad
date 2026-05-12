import { useQuery } from '@tanstack/vue-query';

import { getSurveySmsReservationList } from '@/apis/survey.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 설문조사 메시지발송예약 리스트 조회
const useGetSurveySmsReservationList = ({ surveyUuid }) => {
  const { userInfo } = useUserInfoStore();

  const {
    data: surveySmsReservationList,
    isLoading: isSurveySmsReservationListLoading,
    error: surveySmsReservationListError,
  } = useQuery({
    queryKey: ['surveySmsReservationList', userInfo.aptUuid, surveyUuid],
    queryFn: () =>
      getSurveySmsReservationList({
        aptUuid: userInfo.aptUuid,
        surveyUuid,
      }),
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(surveyUuid),
    select: (data) => data.data.success,
  });

  return {
    surveySmsReservationList,
    isSurveySmsReservationListLoading,
    surveySmsReservationListError,
  };
};

export default useGetSurveySmsReservationList;
