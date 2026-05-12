import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';

import { getSurveyDetailDefault } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 기본
const useGetSurveyDetailDefault = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    data: surveyDetailDefault,
    isLoading: isSurveyDetailDefaultLoading,
    error: surveyDetailDefaultError,
  } = useQuery({
    queryKey: ['surveyDetailDefault', userInfo.aptUuid, getParams().surveyUuid],
    queryFn: () =>
      getSurveyDetailDefault({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
      }),
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(getParams().surveyUuid),
    select: (data) => data.data.success,
  });

  watch(surveyDetailDefaultError, async (newError) => {
    if (!newError?.data?.error) return;

    const { errorCode, message } = newError.data.error;

    switch (errorCode) {
      default:
        swalErrorModal({
          text: message,
        });
    }
  });

  return { surveyDetailDefault, isSurveyDetailDefaultLoading };
};

export default useGetSurveyDetailDefault;
