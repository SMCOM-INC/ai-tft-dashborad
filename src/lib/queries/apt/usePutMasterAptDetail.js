import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { putMasterAptDetail } from '@/apis/apt.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePutMasterAptDetail = () => {
  const queryClient = useQueryClient();

  const isValidFileObject = (obj) => {
    return (
      obj &&
      typeof obj === 'object' &&
      'size' in obj &&
      'type' in obj &&
      obj.size > 0
    );
  };

  const {
    mutate: updateAptDetailMutation,
    isPending: isUpdateAptDetailPending,
    isSuccess: isUpdateAptDetailSuccess,
    reset: resetUpdateAptDetail,
  } = useMutation({
    mutationFn: ({ aptUuid, data }) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'logoFile' && isValidFileObject(data[key])) {
          formData.append('logoFile', data[key]);
        } else if (key !== 'logoFile') {
          formData.append(key, data[key]);
        }
      });

      return putMasterAptDetail(aptUuid, formData);
    },
    onSuccess: (_, { aptUuid }) => {
      queryClient.invalidateQueries({ queryKey: ['aptDetail', aptUuid] });
      swalSuccessModal({ text: '단지 정보가 성공적으로 수정되었습니다.' });
    },
    onError: (error) => {
      const message = error?.data?.error?.message;
      swalErrorModal({
        text: message || '단지 정보 수정에 실패했습니다.',
      });
    },
  });

  return {
    updateAptDetailMutation,
    isUpdateAptDetailPending,
    isUpdateAptDetailSuccess,
    resetUpdateAptDetail,
  };
};

export default usePutMasterAptDetail;
