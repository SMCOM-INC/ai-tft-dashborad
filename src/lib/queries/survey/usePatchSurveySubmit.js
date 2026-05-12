import { useMutation } from '@tanstack/vue-query';

import { patchSurveySubmit } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 설문조사 제출
const usePatchSurveySubmit = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateTo, getCurrentRoutePath } = useNavigate();

  const formatDate = (date) => {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const utcDate = new Date(date.getTime() - offset);
    return utcDate.toISOString().slice(0, 10);
  };

  const {
    mutateAsync: patchSurveySubmitMutationAsync,
    isPending: isPatchSurveySubmitPending,
  } = useMutation({
    mutationKey: ['patchSurveySubmit'],
    mutationFn: ({
      openSurveyDate,
      openSurveyHours,
      openSurveyMinutes,
      closeSurveyDate,
      closeSurveyHours,
      closeSurveyMinutes,
    }) => {
      return patchSurveySubmit({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        startDateTime: `${formatDate(openSurveyDate)} ${openSurveyHours}:${openSurveyMinutes}:00`,
        endDateTime: `${formatDate(closeSurveyDate)} ${closeSurveyHours}:${closeSurveyMinutes}:00`,
      });
    },
    onSuccess: () => {
      const isEditPage = getCurrentRoutePath().includes('edit');

      swalSuccessModal({
        text: `설문조사가 ${isEditPage ? '수정' : '완성'}되었습니다.`,
      });

      navigateTo(
        `/survey/detail/${getParams().groupUuid}/${getParams().surveyUuid}`,
      );
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

  return {
    patchSurveySubmitMutationAsync,
    isPatchSurveySubmitPending,
  };
};

export default usePatchSurveySubmit;
