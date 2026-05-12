import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

import { getResidentListByPhone } from '@/apis/repair.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetResidentListByPhone = () => {
  const { userInfo } = useUserInfoStore();

  const phone = ref('');

  const {
    data: residentListByPhone,
    isLoading: isResidentListByPhoneLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['memberDetail', userInfo.aptUuid, phone],
    queryFn: () => getResidentListByPhone(userInfo.aptUuid, phone.value),
    enabled: !!userInfo.aptUuid && !!phone.value,
    select: (data) => data.data.success,
  });

  const refetchMemberDetail = (submitValues) => {
    phone.value = submitValues;
    refetch();
  };

  return {
    residentListByPhone,
    isResidentListByPhoneLoading,
    isError,
    error,
    refetchMemberDetail,
  };
};

export default useGetResidentListByPhone;
