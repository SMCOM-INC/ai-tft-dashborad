import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteAlwaysAllow } from '@/apis/parkingAlwaysAllow.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteAlwaysAllow = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: deleteAlwaysAllowMutation,
    isPending: isDeleteAlwaysAllowPending,
    isError: isDeleteAlwaysAllowError,
    error: deleteAlwaysAllowError,
    isSuccess: isDeleteAlwaysAllowSuccess,
  } = useMutation({
    mutationFn: ({ alwaysAllowUuidList }) => {
      return deleteAlwaysAllow({
        aptUuid: userInfo.aptUuid,
        alwaysAllowUuidList: alwaysAllowUuidList.join(','),
      });
    },

    onSuccess: () => {
      swalSuccessModal({
        title: '항상허용 삭제 완료',
        text: '항상허용이 삭제되었습니다.',
      });

      queryClient.invalidateQueries(['alwaysAllowList', userInfo.aptUuid]);
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        title: '항상허용 삭제 실패',
        text: message || '항상허용 삭제에 실패했습니다.',
      });
    },
  });

  return {
    deleteAlwaysAllowMutation,
    isDeleteAlwaysAllowPending,
    isDeleteAlwaysAllowError,
    deleteAlwaysAllowError,
    isDeleteAlwaysAllowSuccess,
  };
};

export default useDeleteAlwaysAllow;
