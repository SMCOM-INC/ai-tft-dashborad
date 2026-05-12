import { useQuery } from '@tanstack/vue-query';

import { getSurveyFormSampleExcel } from '@/apis/survey.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 참여자리스트 엑셀 샘플 다운로드
export const useGetSurveyFormSampleExcel = () => {
  const { userInfo } = useUserInfoStore();

  const {
    data: surveyFormSampleExcel,
    isLoading: isSurveyFormSampleExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['surveyFormSampleExcel'],
    queryFn: () =>
      getSurveyFormSampleExcel({
        aptUuid: userInfo.aptUuid,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchSurveyFormSampleExcel = async () => {
    if (!validateQueryEnabledParams(userInfo.aptUuid)) {
      swalErrorModal({ text: '잘못된 요청입니다.' });
      return;
    }

    await refetch();

    if (!surveyFormSampleExcel.value) {
      swalErrorModal({ text: '다운로드에 실패하였습니다.' });

      return;
    }

    return downloadFile({
      data: surveyFormSampleExcel.value,
      type: 'xlsx',
      fileName: '설문조사 등록 샘플',
    });
  };

  return {
    surveyFormSampleExcel,
    isSurveyFormSampleExcelLoading,
    refetchSurveyFormSampleExcel,
  };
};

export default useGetSurveyFormSampleExcel;
