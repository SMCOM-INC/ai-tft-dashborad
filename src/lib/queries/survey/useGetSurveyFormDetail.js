import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';

import { getSurveyFormDetail } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 폼(미완성 조회)
const useGetSurveyFormDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateTo } = useNavigate();

  const {
    data: surveyFormDetail,
    isLoading: isSurveyFormDetailLoading,
    error: surveyFormDetailError,
    isError: isSurveyFormDetailError,
  } = useQuery({
    queryKey: ['surveyFormDetail', userInfo.aptUuid, getParams().surveyUuid],
    queryFn: () =>
      getSurveyFormDetail({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
      }),
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(getParams().surveyUuid),
    select: (data) => data.data.success,
  });

  watch(surveyFormDetailError, async (newError) => {
    if (!newError?.data?.error) return;

    const { errorCode, message } = newError.data.error;

    switch (errorCode) {
      default:
        swalErrorModal({
          text: message,
          callback: () => navigateTo('/survey/list'),
        });
    }
  });

  return {
    surveyFormDetail,
    isSurveyFormDetailLoading,
    isSurveyFormDetailError,
  };
};

export default useGetSurveyFormDetail;
