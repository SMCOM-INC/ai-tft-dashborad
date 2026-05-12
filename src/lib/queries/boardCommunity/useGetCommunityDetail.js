import { useQuery } from '@tanstack/vue-query';

import { getCommunityDetail } from '@/apis/boardCommunity.js';

const useGetCommunityPostDetail = (aptUuid, communityUuid) => {
  const {
    data: communityPostDetail,
    isLoading: isCommunityPostDetailLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['communityPostDetail', aptUuid, communityUuid],
    queryFn: () => getCommunityDetail(aptUuid, communityUuid),
    select: (data) => data.data.success,
  });

  return { communityPostDetail, isCommunityPostDetailLoading, isError, error };
};

export default useGetCommunityPostDetail;
