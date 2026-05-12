import { useQuery } from '@tanstack/vue-query';

import { getGlobalNoticeCategories } from '@/apis/boardGlobalNotice.js';

const useGetGlobalNoticeCategories = () => {
  return useQuery({
    queryKey: ['globalNoticeCategories'],
    queryFn: getGlobalNoticeCategories,
    select: (data) => data.data.success,
  });
};

export default useGetGlobalNoticeCategories;
