import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchSurveyFormDefault } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 기본정보 저장 및 수정
const usePatchSurveyFormDefault = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getParams, navigateTo } = useNavigate();

  const {
    mutateAsync: patchSurveyFormDefaultMutationAsync,
    isPending: isPatchSurveyFormDefaultPending,
    isSuccess: isPatchSurveyFormDefaultSuccess,
    reset: resetPatchSurveyFormDefault,
  } = useMutation({
    mutationFn: ({
      title,
      surveyType,
      authType,
      content,
      imageFileUuidList,
    }) => {
      return patchSurveyFormDefault({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        title,
        surveyType,
        authType,
        content: JSON.stringify(content),
        imageFileUuidList,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveyFormDetail']);

      swalSuccessModal({ text: '설문조사 기본정보가 저장되었습니다.' });
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
    patchSurveyFormDefaultMutationAsync,
    isPatchSurveyFormDefaultPending,
    isPatchSurveyFormDefaultSuccess,
    resetPatchSurveyFormDefault,
  };
};

export default usePatchSurveyFormDefault;
