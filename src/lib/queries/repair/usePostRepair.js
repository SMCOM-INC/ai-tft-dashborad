import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postRepair } from '@/apis/repair.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePostRepair = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: createPostMutationAsync,
    isPending: isCreatePostPending,
  } = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      const { residentUuid } = data;

      Object.keys(data).forEach((key) => {
        if (key === 'fileList') {
          const files = Array.isArray(data[key]) ? data[key] : [data[key]];
          files.forEach((file, index) => {
            formData.append(`fileList[${index}].file`, file);
            formData.append(`fileList[${index}].orderNum`, index);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      formData.delete('residentUuid');
      return postRepair({ aptUuid: userInfo.aptUuid, residentUuid, formData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['repairList'],
      });

      swalSuccessModal({ text: '접수되었습니다.' });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { createPostMutationAsync, isCreatePostPending };
};

export default usePostRepair;
