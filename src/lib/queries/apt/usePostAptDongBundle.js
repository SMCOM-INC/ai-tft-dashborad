import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postAptDongBundle } from '@/apis/apt.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostAptDongBundle = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createBatchDongMutation,
    isPending: isCreateBatchDongPending,
    isSuccess: isCreateBatchDongSuccess,
    reset: resetCreateBatchDong,
  } = useMutation({
    mutationFn: ({ aptUuid, payload }) => postAptDongBundle(aptUuid, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['householdDongList', variables.aptUuid]);
      swalSuccessModal({ text: '동이 등록되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message });
    },
  });

  return {
    createBatchDongMutation,
    isCreateBatchDongPending,
    isCreateBatchDongSuccess,
    resetCreateBatchDong,
  };
};

export default usePostAptDongBundle;
