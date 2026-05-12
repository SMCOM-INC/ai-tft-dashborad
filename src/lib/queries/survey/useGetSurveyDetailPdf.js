import { useQuery } from '@tanstack/vue-query';

import { getSurveyDetailPdf } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 설문조사 PDF
export const useGetSurveyDetailPdf = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    data: surveyDetailParticipantsPdf,
    isLoading: isSurveyDetailParticipantsPdfLoading,
    refetch,
  } = useQuery({
    queryKey: ['surveyDetailPdf', getParams().surveyUuid],
    queryFn: () =>
      getSurveyDetailPdf({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchSurveyDetailParticipantsPdf = async () => {
    if (
      !validateQueryEnabledParams(userInfo.aptUuid) ||
      !validateQueryEnabledParams(getParams().surveyUuid)
    ) {
      swalErrorModal({ text: '잘못된 요청입니다.' });
      return;
    }

    await refetch();

    if (!surveyDetailParticipantsPdf.value) {
      swalErrorModal({ text: '다운로드에 실패하였습니다.' });

      return;
    }

    return downloadFile({
      data: surveyDetailParticipantsPdf.value,
      type: 'pdf',
      fileName: '설문조사결과',
    });
  };

  return {
    surveyDetailParticipantsPdf,
    isSurveyDetailParticipantsPdfLoading,
    refetchSurveyDetailParticipantsPdf,
  };
};

export default useGetSurveyDetailPdf;
