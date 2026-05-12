import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchSurveyFormExcel } from '@/apis/survey.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import useUploadProgress from '@/lib/composables/common/useUploadProgress.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 참여자리스트 엑셀 저장 및 수정
const usePatchSurveyFormExcel = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getParams } = useNavigate();

  // 업로드 진행율 컴포저블
  const { progressPercent, createUploadProgressHandler } = useUploadProgress();
  const uploadHandler = createUploadProgressHandler();

  const {
    mutateAsync: patchSurveyFormExcelMutationAsync,
    isPending: isPatchSurveyFormExcelPending,
    isSuccess: isPatchSurveyFormExcelSuccess,
    data: patchSurveyFormExcelData,
    isError: isPatchSurveyFormExcelError,
    error: patchSurveyFormExcelError,
  } = useMutation({
    mutationFn: ({ file }) => {
      const formData = new FormData();
      formData.append('file', file);

      return patchSurveyFormExcel({
        aptUuid: userInfo.aptUuid,
        surveyUuid: getParams().surveyUuid,
        formData,
        onUploadProgress: uploadHandler.onUploadProgress,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['surveyFormDetail']);

      // 프로그레스 완료
      uploadHandler.onSuccess();
    },
  });
  return {
    patchSurveyFormExcelMutationAsync,
    isPatchSurveyFormExcelPending,
    isPatchSurveyFormExcelSuccess,
    patchSurveyFormExcelData,
    isPatchSurveyFormExcelError,
    patchSurveyFormExcelError,
    surveyFormExcelProgressPercent: progressPercent,
  };
};

export default usePatchSurveyFormExcel;
