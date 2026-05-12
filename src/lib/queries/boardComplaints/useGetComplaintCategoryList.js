import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getComplaintCategoryList } from '@/apis/boardComplaints.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetComplaintCategoryList = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const queryKey = computed(() => ['complaintCategoryList', aptUuid]);

  const {
    data: complaintCategoryList,
    isLoading: isComplaintCategoryListLoading,
  } = useQuery({
    queryKey,
    queryFn: () => getComplaintCategoryList({ aptUuid }),
    select: (data) => data.data.success,
    enabled: !!aptUuid,
  });

  return {
    complaintCategoryList,
    isComplaintCategoryListLoading,
  };
};

export default useGetComplaintCategoryList;
