import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getCommunityCategoryList } from '@/apis/boardCommunity.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetCommunityCategoryList = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryKey = computed(() => ['communityCategoryList', aptUuid]);

  const {
    data: communityCategoryList,
    isLoading: isCommunityCategoryListLoading,
  } = useQuery({
    queryKey,
    queryFn: () => getCommunityCategoryList({ aptUuid }),
    select: (data) => {
      const { success } = data.data;
      return success.map((category) => ({
        uuid: category.categoryUuid,
        category: category.categoryName,
      }));
    },
    enabled: !!aptUuid,
  });

  return {
    communityCategoryList,
    isCommunityCategoryListLoading,
  };
};

export default useGetCommunityCategoryList;
