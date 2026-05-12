import { useQuery } from '@tanstack/vue-query';

import { getVoteSmsReservationList } from '@/apis/vote.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 투표 메시지발송예약 리스트 조회
const useGetVoteSmsReservationList = ({ voteUuid }) => {
  const { userInfo } = useUserInfoStore();

  const {
    data: voteSmsReservationList,
    isLoading: isVoteSmsReservationListLoading,
  } = useQuery({
    queryKey: ['voteSmsReservationList', userInfo.aptUuid, voteUuid],
    queryFn: () =>
      getVoteSmsReservationList({
        aptUuid: userInfo.aptUuid,
        voteUuid,
      }),
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(voteUuid),
    select: (data) => data.data.success,
  });

  return { voteSmsReservationList, isVoteSmsReservationListLoading };
};

export default useGetVoteSmsReservationList;
