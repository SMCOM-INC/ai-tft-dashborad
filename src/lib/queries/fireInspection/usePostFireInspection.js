import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postFireInspection } from '@/apis/fireInspection.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 신규 점검 등록
export const usePostFireInspection = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: createFireInspectionMutationAsync,
    isPending: isCreateFireInspectionPending,
  } = useMutation({
    mutationFn: ({ title, startDate, endDate }) => {
      return postFireInspection({
        aptUuid: userInfo.aptUuid,
        title,
        startDate,
        endDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fireInspectionList'] });
      swalSuccessModal({ text: '점검이 등록되었습니다.' });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { createFireInspectionMutationAsync, isCreateFireInspectionPending };
};

export default usePostFireInspection;
