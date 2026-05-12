import { useQuery } from '@tanstack/vue-query';

import { getComplaintDetail } from '@/apis/boardComplaints.js';

const useGetComplaintDetail = (aptUuid, complaintUuid) => {
  const {
    data: complaintPostDetail,
    isLoading: isComplaintPostDetailLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['complaintPostDetail', aptUuid, complaintUuid],
    queryFn: () => getComplaintDetail(aptUuid, complaintUuid),
    select: (data) => data.data.success,
  });

  return { complaintPostDetail, isComplaintPostDetailLoading, isError, error };
};

export default useGetComplaintDetail;
