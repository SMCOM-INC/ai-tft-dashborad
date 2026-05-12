import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postVoteFormExcel } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import useUploadProgress from '@/lib/composables/common/useUploadProgress.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 참여자리스트 엑셀 저장 및 수정
const usePostVoteFormExcel = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();
  const { getParams } = useNavigate();

  // 업로드 진행율 컴포저블
  const { progressPercent, createUploadProgressHandler } = useUploadProgress();
  const uploadHandler = createUploadProgressHandler();

  const {
    mutateAsync: postVoteFormExcelMutationAsync,
    isPending: isPostVoteFormExcelPending,
    isSuccess: isPostVoteFormExcelSuccess,
    data: postVoteFormExcelData,
    isError: isPostVoteFormExcelError,
    error: postVoteFormExcelError,
  } = useMutation({
    mutationFn: ({ file }) => {
      const formData = new FormData();
      formData.append('file', file);

      return postVoteFormExcel({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
        formData,
        onUploadProgress: uploadHandler.onUploadProgress,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voteFormDetail']);

      // 프로그레스 완료
      uploadHandler.onSuccess();
    },
  });
  return {
    postVoteFormExcelMutationAsync,
    isPostVoteFormExcelPending,
    isPostVoteFormExcelSuccess,
    postVoteFormExcelData,
    isPostVoteFormExcelError,
    postVoteFormExcelError,
    voteFormExcelProgressPercent: progressPercent,
  };
};

export default usePostVoteFormExcel;
