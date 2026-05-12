import { useQuery } from '@tanstack/vue-query';

import { getStoreSettingPolicy } from '@/apis/store.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreSettingPolicy = () => {
  const { userInfo } = useUserInfoStore();

  const {
    data: storeSettingPolicy,
    isLoading: isStoreSettingPolicyLoading,
    error: storeSettingPolicyError,
  } = useQuery({
    queryKey: ['storeSettingPolicy', userInfo.aptUuid],
    queryFn: () => {
      return getStoreSettingPolicy({
        aptUuid: userInfo.aptUuid,
      });
    },
    select: (data) => {
      return data.data.success;
    },
    enabled: !!userInfo.aptUuid,
  });

  return {
    storeSettingPolicy,
    isStoreSettingPolicyLoading,
    storeSettingPolicyError,
  };
};

export default useGetStoreSettingPolicy;
