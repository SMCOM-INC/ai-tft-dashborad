import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';

import { getSurveyDetailDefaultSubjectiveList } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 기본 - 질문항목의 서술형 답변 리스트
const useGetSurveyDetailDefaultSubjectiveList = ({ questionUuid }) => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    data: surveyDetailDefaultSubjectiveList,
    isLoading: isSurveyDetailDefaultSubjectiveListLoading,
    error: surveyDetailDefaultSubjectiveListError,
  } = useQuery({
    queryKey: [
      'surveyDetailDefaultSubjectiveList',
      userInfo.aptUuid,
      getParams().surveyUuid,
    ],
    queryFn: () =>
      getSurveyDetailDefaultSubjectiveList({
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

  watch(surveyDetailDefaultSubjectiveListError, async (newError) => {
    if (!newError?.data?.error) return;

    const { errorCode, message } = newError.data.error;

    switch (errorCode) {
      default:
        swalErrorModal({
          text: message,
        });
    }
  });

  return {
    surveyDetailDefaultSubjectiveList,
    isSurveyDetailDefaultSubjectiveListLoading,
  };
};

export default useGetSurveyDetailDefaultSubjectiveList;
