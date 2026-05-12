import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteVoteGroup } from '@/apis/vote.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 그룹 삭제
export const useDeleteVoteGroup = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteVoteGroupMutationAsync,
    isPending: isDeleteVoteGroupPending,
  } = useMutation({
    mutationFn: ({ groupUuid }) => {
      return deleteVoteGroup({
        aptUuid: userInfo.aptUuid,
        groupUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteList']);
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { deleteVoteGroupMutationAsync, isDeleteVoteGroupPending };
};

export default useDeleteVoteGroup;
