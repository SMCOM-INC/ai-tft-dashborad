import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getComplaintList } from '@/apis/boardComplaints.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetComplaintList = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: complaintPostList,
    isLoading: isComplaintPostListLoading,
    isError: isComplaintPostListError,
    error: complaintPostListError,
  } = useQuery({
    queryKey: ['complaintPostList', aptUuid, queryString],
    queryFn: () => {
      const commonValue = {
        aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        status: queryString.value.status,
        categoryUuidList: queryString.value.categoryUuidList,
      };

      if (queryString.value.startDate && queryString.value.endDate) {
        return getComplaintList({
          ...commonValue,
          startDate: toStartDateTime(queryString.value.startDate),
          endDate: toEndDateTime(queryString.value.endDate),
        });
      }

      return getComplaintList(commonValue);
    },
    enabled: !!aptUuid,
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
    complaintPostList,
    isComplaintPostListLoading,
    isComplaintPostListError,
    complaintPostListError,
  };
};

export default useGetComplaintList;
