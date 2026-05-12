import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteSurvey } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 설문조사 삭제
export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateReplace, navigateTo } = useNavigate();

  const {
    mutateAsync: deleteSurveyMutationAsync,
    isPending: isDeleteSurveyPending,
  } = useMutation({
    mutationFn: ({ surveyUuid }) => {
      return deleteSurvey({
        aptUuid: userInfo.aptUuid,
        surveyUuid: surveyUuid || getParams().surveyUuid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveyList']);

      swalSuccessModal({
        text: '설문조사가 삭제되었습니다.',
      });

      navigateReplace('/survey/list');
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'NOT_FOUND_VOTE':
          swalErrorModal({ text: message });
          navigateTo('/survey/list');
          break;
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { deleteSurveyMutationAsync, isDeleteSurveyPending };
};

export default useDeleteSurvey;
