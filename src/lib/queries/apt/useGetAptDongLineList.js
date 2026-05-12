import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAptDongLineList } from '@/apis/apt.js';

const useGetDongLineList = (params, options = {}) => {
  const {
    data: householdLineList,
    refetch: refetchLineList,
    isLoading: isHouseholdLineListLoading,
    isError: isHouseholdLineListError,
    isSuccess: isHouseholdLineListSuccess,
    error: householdLineListError,
  } = useQuery({
    queryKey: ['householdLineList', params],
    queryFn: () => {
      return getAptDongLineList(params.value.aptUuid, params.value.dongUuid);
    },
    select: (data) => data.data.success,
    enabled: computed(() => options.enabled?.value && !!params.value.dongUuid),
  });

  return {
    householdLineList,
    isHouseholdLineListLoading,
    isHouseholdLineListError,
    householdLineListError,
    isHouseholdLineListSuccess,
    refetchLineList,
  };
};

export default useGetDongLineList;
