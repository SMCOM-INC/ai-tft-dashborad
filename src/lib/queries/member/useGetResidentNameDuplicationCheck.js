import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getResidentNameDuplicationCheck } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetResidentNameDuplicationCheck = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();
  const residentUuid = computed(() => {
    return getParams().uuid;
  });

  const {
    data: residentNameDuplicationCheck,
    isLoading: isResidentNameDuplicationCheckLoading,
    isError: isResidentNameDuplicationCheckError,
  } = useQuery({
    queryKey: [
      'residentNameDuplicationCheck',
      userInfo.aptUuid,
      residentUuid.value,
    ],
    queryFn: () => {
      return getResidentNameDuplicationCheck({
        aptUuid: userInfo.aptUuid,
        residentUuid: residentUuid.value,
      });
    },
    select: (data) => data.data.success,
  });

  return {
    residentNameDuplicationCheck,
    isResidentNameDuplicationCheckLoading,
    isResidentNameDuplicationCheckError,
  };
};

export default useGetResidentNameDuplicationCheck;
