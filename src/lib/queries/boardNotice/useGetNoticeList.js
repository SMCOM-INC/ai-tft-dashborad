import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getNoticeList } from '@/apis/boardNotice.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import { toEndDateTime, toStartDateTime } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetNoticeList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const { aptUuid } = userInfo;

  const {
    data: noticeList,
    isLoading: isNoticeListLoading,
    isError: isNoticeListError,
    error: noticeListError,
  } = useQuery({
    queryKey: ['noticeList', aptUuid, queryString],
    queryFn: () => {
      const commonValues = {
        aptUuid,
        page: queryString.value.page,
        size: queryString.value.size,
        keyword: queryString.value.keyword,
        categoryUuid: queryString.value.categoryUuid,
        noticeType: queryString.value.noticeType,
      };

      if (queryString.value.startDate && queryString.value.endDate) {
        return getNoticeList({
          ...commonValues,
          startDate: toStartDateTime(queryString.value.startDate),
          endDate: toEndDateTime(queryString.value.endDate),
        });
      }

      return getNoticeList(commonValues);
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
    noticeList,
    isNoticeListLoading,
    isNoticeListError,
    noticeListError,
  };
};

export default useGetNoticeList;
