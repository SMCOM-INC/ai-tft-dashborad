import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteBlackList } from '@/apis/parkingBlacklistReject.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteBlackList = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteBlackListMutationAsync,
    isPending: isDeleteBlackListPending,
    isError: isDeleteBlackListError,
    error: deleteBlackListError,
  } = useMutation({
    mutationFn: async ({ blacklistUuidList }) => {
      await Promise.all(
        blacklistUuidList.map((blacklistUuid) =>
          deleteBlackList({ blacklistUuid }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blacklistCarList', aptUuid]);

      swalSuccessModal({
        text: '블랙리스트가 삭제되었습니다.',
      });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;

      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    deleteBlackListMutationAsync,
    isDeleteBlackListPending,
    isDeleteBlackListError,
    deleteBlackListError,
  };
};

export { useDeleteBlackList };
export default useDeleteBlackList;
