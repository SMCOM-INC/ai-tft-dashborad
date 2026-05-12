import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchSurveyTitle } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 설문조사명 수정
const usePatchSurveyTitle = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { navigateTo } = useNavigate();

  const {
    mutateAsync: patchSurveyTitleMutationAsync,
    isPending: isPatchSurveyTitlePending,
  } = useMutation({
    mutationFn: ({ surveyUuid, title }) => {
      return patchSurveyTitle({
        aptUuid: userInfo.aptUuid,
        surveyUuid,
        title,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveyList']);

      swalSuccessModal({
        text: '설문조사명이 수정되었습니다.',
      });
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

  return { patchSurveyTitleMutationAsync, isPatchSurveyTitlePending };
};

export default usePatchSurveyTitle;
