import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getMileageDetail } from '@/apis/parkingMileage.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetMileageDetail = () => {
  const { getParams, getQueryString } = useNavigate();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryString = computed(() => getQueryString());

  const {
    data: mileageDetail,
    isLoading: isMileageDetailLoading,
    isError: isMileageDetailError,
    error: inMileageDetailError,
  } = useQuery({
    queryKey: ['mileageDetail', aptUuid, getParams().uuid, queryString],
    queryFn: () =>
      getMileageDetail({
        aptUuid,
        mileageUuid: getParams().uuid,
        page: queryString.value.page,
        size: queryString.value.size,
      }),
    enabled: !!getParams().uuid,
    select: (data) => ({
      content: data.data.success.content,
      totalPages: data.data.success.totalPages,
      totalElements: data.data.success.totalElements,
      numberOfElements: data.data.success.numberOfElements,
      page: data.data.success.number,
      size: data.data.success.size,
    }),
  });

  return {
    mileageDetail,
    isMileageDetailLoading,
    isMileageDetailError,
    inMileageDetailError,
  };
};

export default useGetMileageDetail;
