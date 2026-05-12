import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteFireInspection } from '@/apis/fireInspection.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 점검 삭제
export const useDeleteFireInspection = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: deleteFireInspectionMutationAsync,
    isPending: isDeleteFireInspectionPending,
  } = useMutation({
    mutationFn: ({ fireInspectionUuid }) => {
      return deleteFireInspection({
        aptUuid: userInfo.aptUuid,
        fireInspectionUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fireInspectionList'] });
      swalSuccessModal({ text: '점검이 삭제되었습니다.' });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { deleteFireInspectionMutationAsync, isDeleteFireInspectionPending };
};

export default useDeleteFireInspection;
