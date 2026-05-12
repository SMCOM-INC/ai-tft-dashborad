import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getResidentDetail } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetResidentDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();
  const residentUuid = computed(() => {
    return getParams().uuid;
  });

  const {
    data: residentDetail,
    isLoading: isResidentDetailLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['residentDetail', userInfo.aptUuid, residentUuid.value],
    queryFn: () => {
      return getResidentDetail({
        aptUuid: userInfo.aptUuid,
        residentUuid: residentUuid.value,
      });
    },
    select: (data) => data.data.success,
  });

  return {
    residentDetail,
    isResidentDetailLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetResidentDetail;
