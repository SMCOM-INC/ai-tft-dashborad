import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteAptMall } from '@/apis/aptMall.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 주문 삭제
const useDeleteAptMall = () => {
  const queryClient = useQueryClient();

  const { userInfo } = useUserInfoStore();

  const { getParams } = useNavigate();

  const {
    mutateAsync: deleteAptMallMutationAsync,
    isPending: isDeleteAptMallPending,
  } = useMutation({
    mutationFn: () => {
      return deleteAptMall({
        aptUuid: userInfo.aptUuid,
        aptMallUuid: getParams().aptMallUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['aptMallDetail']);
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { deleteAptMallMutationAsync, isDeleteAptMallPending };
};

export default useDeleteAptMall;
