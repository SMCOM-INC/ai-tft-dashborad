import { useMutation } from '@tanstack/vue-query';

import { postSurvey } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 설문조사 생성
const usePostSurvey = () => {
  const { userInfo } = useUserInfoStore();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: createSurveyMutationAsync,
    isPending: isCreateSurveyPending,
  } = useMutation({
    mutationFn: ({ groupUuid, title }) => {
      return postSurvey({
        aptUuid: userInfo.aptUuid,
        groupUuid,
        title,
      });
    },
    onSuccess: (data, variables) => {
      const response = data.data.success;

      navigateTo({
        path: `/survey/create/${variables.groupUuid}/${response.message}`,
        state: { survey: 'create' },
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

  return { createSurveyMutationAsync, isCreateSurveyPending };
};

export default usePostSurvey;
