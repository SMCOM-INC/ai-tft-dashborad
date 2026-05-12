import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postAptHo } from '@/apis/apt.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostAptHo = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createHoMutation,
    isPending: isCreateHoPending,
    isSuccess: isCreateHoSuccess,
    reset: resetCreateHo,
  } = useMutation({
    mutationFn: ({ aptUuid, payload }) => postAptHo(aptUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['householdHoList'],
      });
      swalSuccessModal({ text: '세대가 등록되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message });
    },
  });

  return {
    createHoMutation,
    isCreateHoPending,
    isCreateHoSuccess,
    resetCreateHo,
  };
};

export default usePostAptHo;
