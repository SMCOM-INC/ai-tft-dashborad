import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAptDongLineHoList } from '@/apis/apt.js';

const useGetAptDongLineHoList = (params, options = {}) => {
  const {
    data: householdHoList,
    refetch: refetchHoList,
    isLoading: isHouseholdHoListLoading,
    isError: isHouseholdHoListError,
    isSuccess: isHouseholdHoListSuccess,
    error: householdHoListError,
  } = useQuery({
    queryKey: ['householdHoList', params],
    queryFn: () =>
      getAptDongLineHoList(
        params.value.aptUuid,
        params.value.dongUuid,
        params.value.lineUuid,
      ),
    select: (data) => data.data.success,
    enabled: computed(
      () =>
        options.enabled?.value &&
        !!params.value.aptUuid &&
        !!params.value.dongUuid &&
        !!params.value.lineUuid,
    ),
  });

  return {
    householdHoList,
    isHouseholdHoListLoading,
    isHouseholdHoListError,
    householdHoListError,
    isHouseholdHoListSuccess,
    refetchHoList,
  };
};

export default useGetAptDongLineHoList;
