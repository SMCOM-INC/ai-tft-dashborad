import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postBlackList } from '@/apis/parkingBlacklistReject.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePostBlackList = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const {
    mutateAsync: postBlackListMutationAsync,
    isPending: isPostBlackListPending,
    isError: isPostBlackListError,
    error: postBlackListError,
  } = useMutation({
    mutationFn: ({ carNum, reason }) => {
      return postBlackList({ aptUuid, carNum, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blacklistCarList', aptUuid]);

      swalSuccessModal({
        text: '블랙리스트가 등록되었습니다.',
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
    postBlackListMutationAsync,
    isPostBlackListPending,
    isPostBlackListError,
    postBlackListError,
  };
};

export default usePostBlackList;
