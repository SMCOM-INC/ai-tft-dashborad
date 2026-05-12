import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAptAdminGlobalNoticeList } from '@/apis/boardGlobalNotice.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetAptAdminGlobalNoticeList = (fetchParams) => {
  const { userInfo } = useUserInfoStore();

  const queryKey = computed(() => [
    'aptAdminGlobalNoticeList',
    fetchParams,
    userInfo.aptUuid,
  ]);

  const {
    data: aptAdminGlobalNoticeList,
    isLoading: isAptAdminGlobalNoticeListLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getAptAdminGlobalNoticeList(
        userInfo.aptUuid,
        fetchParams.value.pageable,
        fetchParams.value.searchParams,
      ),
    enabled: !!userInfo.aptUuid, // aptUuid가 있을 때만 쿼리 실행
    select: (data) => data.data.success,
  });

  return {
    aptAdminGlobalNoticeList,
    isAptAdminGlobalNoticeListLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetAptAdminGlobalNoticeList;
