import { useQuery } from '@tanstack/vue-query';

import { getAptAdminGlobalNoticeDetail } from '@/apis/boardGlobalNotice.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetAptAdminGlobalNoticeDetail = (apartmantNoticeUuid) => {
  const { userInfo } = useUserInfoStore();

  const {
    data: aptAdminGlobalNoticeDetail,
    isLoading: isAptAdminGlobalNoticeDetailLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'aptAdminGlobalNoticeDetail',
      userInfo.aptUuid,
      apartmantNoticeUuid,
    ],
    queryFn: () =>
      getAptAdminGlobalNoticeDetail(userInfo.aptUuid, apartmantNoticeUuid),
    enabled: !!userInfo.aptUuid && !!apartmantNoticeUuid,
    select: (data) => data.data.success,
  });

  return {
    aptAdminGlobalNoticeDetail,
    isAptAdminGlobalNoticeDetailLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetAptAdminGlobalNoticeDetail;
