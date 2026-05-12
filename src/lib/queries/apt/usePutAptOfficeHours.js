import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { putAptOfficeHours } from '@/apis/apt.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePutAptOfficeHours = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateAptOfficeHoursMutation,
    isPending: isUpdateAptOfficeHoursPending,
    isSuccess: isUpdateAptOfficeHoursSuccess,
    reset: resetUpdateAptOfficeHours,
  } = useMutation({
    mutationFn: (data) => putAptOfficeHours(aptUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['aptOfficeHours', aptUuid],
      });
      swalSuccessModal({ text: '운영시간이 수정되었습니다.' });
    },
    onError: (error) => {
      const message = error?.data?.error?.message;
      swalErrorModal({
        text: message || '운영시간 수정에 실패했습니다.',
      });
    },
  });

  return {
    updateAptOfficeHoursMutation,
    isUpdateAptOfficeHoursPending,
    isUpdateAptOfficeHoursSuccess,
    resetUpdateAptOfficeHours,
  };
};

export default usePutAptOfficeHours;
