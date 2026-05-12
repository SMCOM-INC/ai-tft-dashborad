import { useQuery } from '@tanstack/vue-query';

import { getNoticeCategoryList } from '@/apis/boardNotice.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetNoticeCategoryList = () => {
  const { userInfo } = useUserInfoStore();

  const {
    data: aptNoticeCategoryList,
    isLoading: isAptNoticeCategoryListLoading,
    isError: isAptNoticeCategoryListError,
    error: aptNoticeCategoryListError,
  } = useQuery({
    queryKey: ['noticeCategoryList', userInfo.aptUuid],
    queryFn: () => {
      return getNoticeCategoryList({ aptUuid: userInfo.aptUuid });
    },
    enabled: !!userInfo.aptUuid,
    select: (data) => data.data.success,
  });

  return {
    aptNoticeCategoryList,
    isAptNoticeCategoryListLoading,
    isAptNoticeCategoryListError,
    aptNoticeCategoryListError,
  };
};

export default useGetNoticeCategoryList;
