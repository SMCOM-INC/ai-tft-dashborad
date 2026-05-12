import { useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';

import { getSurveyDetailParticipantsExcel } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 참여자 엑셀
export const useGetSurveyDetailParticipantsExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const keyword = ref(null);
  const searchType = ref(null);
  const statusSearchType = ref(null);

  const {
    data: surveyDetailParticipantsExcel,
    isLoading: isSurveyDetailParticipantsExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['surveyDetailParticipantsExcel'],
    queryFn: () =>
      getSurveyDetailParticipantsExcel({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        keyword: keyword.value,
        searchType: searchType.value,
        statusSearchType: statusSearchType.value,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const setParams = () => {
    const searchTypeMap = {
      NAME: 'NAME',
      PHONE: 'PHONE',
      DONG: 'DONG',
      HO: 'HO',
      DONG_HO: 'DONG_HO',
    };

    if (Object.keys(queryString.value).length === 0) {
      searchType.value = undefined;
      keyword.value = undefined;
      statusSearchType.value = undefined;
      return;
    }

    Object.entries(queryString.value).map(([key, value]) => {
      // 필터
      if (key === 'statusSearchType') {
        statusSearchType.value = value;
        return;
      }

      // 검색어
      if (value) {
        searchType.value = searchTypeMap[key] || null;
      } else {
        searchType.value = null;
      }

      keyword.value = value;

      return;
    });
  };

  const refetchSurveyDetailParticipantsExcel = async () => {
    if (
      !validateQueryEnabledParams(userInfo.aptUuid) ||
      !validateQueryEnabledParams(getParams().surveyUuid)
    ) {
      swalErrorModal({ text: '잘못된 요청입니다.' });
      return;
    }

    await refetch();

    if (!surveyDetailParticipantsExcel.value) {
      swalErrorModal({ text: '다운로드에 실패하였습니다.' });

      return;
    }

    return downloadFile({
      data: surveyDetailParticipantsExcel.value,
      type: 'xlsx',
      fileName: '설문조사 참여자 내역',
    });
  };

  watch(queryString, setParams, { immediate: true });

  return {
    surveyDetailParticipantsExcel,
    isSurveyDetailParticipantsExcelLoading,
    refetchSurveyDetailParticipantsExcel,
    setParams,
  };
};

export default useGetSurveyDetailParticipantsExcel;
