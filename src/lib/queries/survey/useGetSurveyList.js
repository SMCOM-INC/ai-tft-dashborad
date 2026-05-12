import { useQuery } from '@tanstack/vue-query';
import { computed, watch } from 'vue';

import { getSurveyList } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 설문조사리스트 조회 및 검색
const useGetSurveyList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: surveyList,
    isLoading: isSurveyListLoading,
    isError: isSurveyListError,
    error: surveyListError,
  } = useQuery({
    queryKey: ['surveyList', userInfo.aptUuid, queryString],
    queryFn: () =>
      getSurveyList({
        aptUuid: userInfo.aptUuid,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
      }),
    enabled: validateQueryEnabledParams(userInfo.aptUuid),
    select: (data) => data.data.success,
  });

  watch(surveyListError, async (newError) => {
    if (!newError?.data?.error) return;

    const { errorCode, message } = newError.data.error;

    switch (errorCode) {
      default:
        swalErrorModal({ text: message });
    }
  });

  return {
    surveyList,
    isSurveyListLoading,
    isSurveyListError,
    surveyListError,
  };
};

export default useGetSurveyList;
