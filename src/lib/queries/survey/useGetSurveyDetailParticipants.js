import { useQuery } from '@tanstack/vue-query';
import { computed, watch } from 'vue';

import { getSurveyDetailParticipants } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 참여자 조회
const useGetSurveyDetailParticipants = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: surveyDetailParticipants,
    isLoading: isSurveyDetailParticipantsLoading,
    error,
  } = useQuery({
    queryKey: [
      'surveyDetailParticipants',
      userInfo.aptUuid,
      getParams().surveyUuid,
      queryString,
    ],
    queryFn: () => {
      return getSurveyDetailParticipants({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        size: queryString.value?.size,
        page: queryString.value?.page,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        statusSearchType: queryString.value.statusSearchType,
      });
    },
    enabled:
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(getParams().surveyUuid),
    select: (data) => {
      const {
        content,
        totalPages,
        totalElements,
        numberOfElements,
        number,
        size,
      } = data.data.success;

      watch(error, async (newError) => {
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
        content,
        totalPages,
        totalElements,
        numberOfElements,
        page: number,
        size,
      };
    },
  });

  return { surveyDetailParticipants, isSurveyDetailParticipantsLoading };
};

export default useGetSurveyDetailParticipants;
