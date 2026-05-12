import { useQuery } from '@tanstack/vue-query';

import { getStoreAdminDetail } from '@/apis/store.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreAdminDetail = () => {
  const userInfoStore = useUserInfoStore();

  const { data: aptDetail, isLoading: isAptDetailLoading } = useQuery({
    queryKey: ['storeAdminAptDetail'],
    queryFn: () => getStoreAdminDetail(),
    select: (data) => {
      userInfoStore.setUserInfo(data.data.success);
      return data.data.success;
    },
  });

  return {
    aptDetail,
    isAptDetailLoading,
  };
};

export default useGetStoreAdminDetail;
