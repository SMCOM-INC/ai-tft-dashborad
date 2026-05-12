import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteMemberBlackList } from '@/apis/boardBlacklist.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteMemberBlackList = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const {
    mutateAsync: deleteMemberBlackListMutation,
    isPending: isDeleteMemberBlackListPending,
    isError: isDeleteMemberBlackListError,
    error: deleteMemberBlackListError,
  } = useMutation({
    mutationFn: ({ blackListUuidList }) => {
      return deleteMemberBlackList({ aptUuid, blackListUuidList });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberBlackList', aptUuid]);
      swalSuccessModal({
        text: '게시판 블랙리스트가 삭제되었습니다.',
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
    deleteMemberBlackListMutation,
    isDeleteMemberBlackListPending,
    isDeleteMemberBlackListError,
    deleteMemberBlackListError,
  };
};

export default useDeleteMemberBlackList;
