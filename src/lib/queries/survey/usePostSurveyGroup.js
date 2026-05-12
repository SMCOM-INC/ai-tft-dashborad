import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postSurveyGroup } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 그룹 생성
const usePostSurveyGroup = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: createSurveyGroupMutationAsync,
    isPending: isCreateSurveyGroupPending,
  } = useMutation({
    mutationFn: ({ groupName }) => {
      return postSurveyGroup({
        aptUuid: userInfo.aptUuid,
        groupName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveyList']);

      navigateTo('/survey/list');
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { createSurveyGroupMutationAsync, isCreateSurveyGroupPending };
};

export default usePostSurveyGroup;
