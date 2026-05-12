import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postMasterApt } from '@/apis/apt.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostMasterApt = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createAptMutation,
    isPending: isCreateAptPending,
    isSuccess: isCreateAptSuccess,
    reset: resetCreateApt,
  } = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === 'aptLogo' && data[key] instanceof File) {
          formData.append('aptLogo', data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      return postMasterApt(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aptList'] });
      queryClient.invalidateQueries({ queryKey: ['aptNameList'] });
      swalSuccessModal({ text: '단지가 성공적으로 등록되었습니다.' });
    },
    onError: (error) => {
      const message = error?.data?.error?.message;
      swalErrorModal({
        text: message || '단지 등록에 실패했습니다.',
      });
    },
  });

  return {
    createAptMutation,
    isCreateAptPending,
    isCreateAptSuccess,
    resetCreateApt,
  };
};

export default usePostMasterApt;
