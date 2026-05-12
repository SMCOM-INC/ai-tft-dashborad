import useGetAptDetail from '@/lib/queries/apt/useGetAptDetail.js';
import useGetMasterAptDetail from '@/lib/queries/apt/useGetMasterAptDetail.js';
import useGetStoreAdminDetail from '@/lib/queries/store/useGetStoreAdminDetail.js';
import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

const useLNBAptDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();

  const getDetailData = () => {
    switch (token.userRole) {
      case 'master':
        return useGetMasterAptDetail(userInfo.aptUuid);
      case 'store_admin':
        return useGetStoreAdminDetail();
      case 'apt_admin':
      default:
        return useGetAptDetail();
    }
  };

  const { aptDetail, isAptDetailLoading } = getDetailData();

  return { aptDetail, isAptDetailLoading };
};

export default useLNBAptDetail;
