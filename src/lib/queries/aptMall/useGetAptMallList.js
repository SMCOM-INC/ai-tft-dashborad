import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getAptMallList } from '@/apis/aptMall.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetAptMallList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const { data: aptMallList, isLoading: isAptMallListLoading } = useQuery({
    queryKey: ['aptMallList', userInfo.aptUuid, queryString],
    queryFn: () =>
      getAptMallList({
        aptUuid: userInfo.aptUuid,
        size: queryString.value?.size,
        page: queryString.value?.page,
      }),
    select: (data) => {
      const {
        content,
        totalPages,
        totalElements,
        numberOfElements,
        number,
        size,
      } = data.data.success;

      return {
        content,
        totalPages,
        totalElements,
        numberOfElements,
        page: number,
        size,
      };
    },
  });

  return { aptMallList, isAptMallListLoading };
};

export default useGetAptMallList;
