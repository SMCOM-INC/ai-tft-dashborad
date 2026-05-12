import { useQuery } from '@tanstack/vue-query';

import { getComplaintCommentList } from '@/apis/boardComplaints.js';

const useGetComplaintCommentList = (aptUuid, complaintUuid, options = {}) => {
  const {
    data: complaintPostCommentList,
    isLoading: isComplaintPostCommentListLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['complaintPostCommentList', aptUuid, complaintUuid],
    queryFn: () => getComplaintCommentList(aptUuid, complaintUuid),
    select: (data) => data.data.success,
    enabled: options.enabled !== undefined ? options.enabled : true,
    refetchInterval: 30000, // 30초마다 댓글 갱신
  });

  return {
    complaintPostCommentList,
    isComplaintPostCommentListLoading,
    isError,
    error,
  };
};

export default useGetComplaintCommentList;
