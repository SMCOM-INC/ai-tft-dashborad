import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchVoteGroup } from '@/apis/vote.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 그룹 수정
const usePatchVoteGroup = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateVoteGroupMutationAsync,
    isPending: isUpdateVoteGroupPending,
  } = useMutation({
    mutationFn: ({ groupUuid, groupName }) => {
      return patchVoteGroup({
        aptUuid: userInfo.aptUuid,
        groupUuid,
        groupName,
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

  return { updateVoteGroupMutationAsync, isUpdateVoteGroupPending };
};

export default usePatchVoteGroup;
