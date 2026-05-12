import { useQuery } from '@tanstack/vue-query';

import { getCommunityCommentList } from '@/apis/boardCommunity.js';

const useGetCommunityCommentList = (aptUuid, communityUuid, options = {}) => {
  const {
    data: communityPostCommentList,
    isPending: isCommunityPostCommentListLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['communityPostCommentList', aptUuid, communityUuid],
    queryFn: () => getCommunityCommentList({ aptUuid, communityUuid }),
    select: (data) => data.data.success,
    enabled: options.enabled !== undefined ? options.enabled : true,
    refetchInterval: 30000, // 30초마다 댓글 갱신
  });

  return {
    communityPostCommentList,
    isCommunityPostCommentListLoading,
    isError,
    error,
  };
};

export default useGetCommunityCommentList;
