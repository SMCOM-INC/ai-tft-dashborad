import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteSurveyGroup } from '@/apis/survey.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 그룹 삭제
export const useDeleteSurveyGroup = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteSurveyGroupMutationAsync,
    isPending: isDeleteSurveyGroupPending,
  } = useMutation({
    mutationFn: ({ groupUuid }) => {
      return deleteSurveyGroup({
        aptUuid: userInfo.aptUuid,
        groupUuid,
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

  return { deleteSurveyGroupMutationAsync, isDeleteSurveyGroupPending };
};

export default useDeleteSurveyGroup;
