import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchInOutHistory } from '@/apis/parkingInoutHistory.js';

const usePatchInOutHistory = (aptUuid) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      patchInOutHistory(
        aptUuid,
        data.inOutHistoryUuid,
        data.inOutHistoryDetail,
      ),
    onSuccess: (_, { data }) => {
      queryClient.invalidateQueries([
        'inOutHistoryDetail',
        aptUuid,
        data.inOutHistoryUuid,
      ]);
    },
  });
};

export default usePatchInOutHistory;
