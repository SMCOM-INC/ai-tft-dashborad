import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getLatestGlobalNoticeWithThumbnail } from '@/apis/boardGlobalNotice.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetLatestGlobalNoticeWithThumbnail = () => {
  const { userInfo } = useUserInfoStore();

  // aptUuid가 있을 때만 쿼리 실행
  const aptUuid = computed(() => userInfo?.aptUuid);

  const {
    data: latestGlobalNotice,
    isLoading: isLatestGlobalNoticeLoading,
    isError: isLatestGlobalNoticeError,
    error: latestGlobalNoticeError,
  } = useQuery({
    queryKey: ['latestGlobalNoticeWithThumbnail', aptUuid],
    queryFn: () => getLatestGlobalNoticeWithThumbnail(aptUuid.value),
    enabled: !!aptUuid.value, // aptUuid가 있을 때만 실행
    select: (data) => data?.data.success,
  });

  return {
    latestGlobalNotice,
    isLatestGlobalNoticeLoading,
    isLatestGlobalNoticeError,
    latestGlobalNoticeError,
  };
};

export default useGetLatestGlobalNoticeWithThumbnail;
