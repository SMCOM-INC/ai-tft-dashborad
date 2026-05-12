import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getHouseholdDetail } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetHouseholdDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();
  const householdUuid = computed(() => {
    return getParams().uuid;
  });

  const { data: householdDetail, isLoading: isHouseholdDetailLoading } =
    useQuery({
      queryKey: ['householdDetail', userInfo.aptUuid, householdUuid.value],
      queryFn: () => {
        return getHouseholdDetail({
          aptUuid: userInfo.aptUuid,
          householdUuid: householdUuid.value,
        });
      },
      select: (data) => data.data.success,
    });

  return {
    householdDetail,
    isHouseholdDetailLoading,
  };
};

export default useGetHouseholdDetail;
