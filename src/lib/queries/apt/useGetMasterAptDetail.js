import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getMasterAptDetail } from '@/apis/apt.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetMasterAptDetail = (uuid, options = {}) => {
  const userInfoStore = useUserInfoStore();

  const {
    data: aptDetail,
    isLoading: isAptDetailLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['aptDetail', uuid],
    queryFn: () => getMasterAptDetail(uuid),
    select: (data) => {
      userInfoStore.setUserInfo(data.data.success);
      return data.data.success;
    },
    enabled: options.enabled !== undefined ? options.enabled : true,
  });

  const isHouseholdNumberRegistered = computed(() => aptDetail.value?.useFlag);

  return {
    aptDetail,
    isAptDetailLoading,
    isError,
    error,
    isHouseholdNumberRegistered,
    refetch,
  };
};

export default useGetMasterAptDetail;
