import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';

import { getSurveyDetailDefaultEtcList } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 기본 - 질문항목의 기타 리스트
const useGetSurveyDetailDefaultEtcList = ({ questionUuid }) => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    data: surveyDetailDefaultEtcList,
    isLoading: isSurveyDetailDefaultEtcListLoading,
    error: surveyDetailDefaultEtcListError,
  } = useQuery({
    queryKey: [
      'surveyDetailDefaultEtcList',
      userInfo.aptUuid,
      getParams().surveyUuid,
    ],
    queryFn: () =>
      getSurveyDetailDefaultEtcList({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        questionUuid,
      }),
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(getParams().surveyUuid) &&
      validateQueryEnabledParams(questionUuid),
    select: (data) => data.data.success,
  });

  watch(surveyDetailDefaultEtcListError, async (newError) => {
    if (!newError?.data?.error) return;

    const { errorCode, message } = newError.data.error;

    switch (errorCode) {
      default:
        swalErrorModal({
          text: message,
        });
    }
  });

  return { surveyDetailDefaultEtcList, isSurveyDetailDefaultEtcListLoading };
};

export default useGetSurveyDetailDefaultEtcList;
