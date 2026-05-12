import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchSurveyGroup } from '@/apis/survey.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 그룹 수정
const usePatchSurveyGroup = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateSurveyGroupMutationAsync,
    isPending: isUpdateSurveyGroupPending,
  } = useMutation({
    mutationFn: ({ groupUuid, groupName }) => {
      return patchSurveyGroup({
        aptUuid: userInfo.aptUuid,
        groupUuid,
        groupName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveyList']);
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { updateSurveyGroupMutationAsync, isUpdateSurveyGroupPending };
};

export default usePatchSurveyGroup;
