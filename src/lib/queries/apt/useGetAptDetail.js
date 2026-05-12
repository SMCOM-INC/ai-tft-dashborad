import { useQuery } from '@tanstack/vue-query';

import { getAptDetail } from '@/apis/apt.js';
import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

const useGetAptDetail = () => {
  const userInfoStore = useUserInfoStore();
  const tokenStore = useTokenStore();

  const {
    data: aptDetail,
    isLoading: isAptDetailLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['aptAdminAptDetail'],
    queryFn: () => getAptDetail(),
    enabled: tokenStore.token.userRole === 'apt_admin',
    select: (data) => {
      userInfoStore.setUserInfo(data.data.success);
      return data.data.success;
    },
  });

  return {
    aptDetail,
    isAptDetailLoading,
    isError,
    error,
  };
};

export default useGetAptDetail;
