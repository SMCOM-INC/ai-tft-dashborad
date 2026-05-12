import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchGlobalNoticePost } from '@/apis/boardGlobalNotice.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePatchGlobalNoticePost = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: patchGlobalNoticeAsync,
    isPending: isPatchGlobalNoticeLoading,
    isSuccess: isPatchGlobalNoticeSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ globalNoticeUuid, formData }) =>
      patchGlobalNoticePost(globalNoticeUuid, formData),
    onSuccess: (data, variables) => {
      // 전체 공지사항 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['globalNoticeList'],
      });
      // 해당 상세 데이터 캐시도 무효화
      queryClient.invalidateQueries({
        queryKey: ['globalNoticeDetail', variables.globalNoticeUuid],
      });

      swalSuccessModal({
        title: '수정 완료',
        text: '전체 공지사항이 성공적으로 수정되었습니다.',
      });
    },
    onError: () => {
      swalErrorModal({
        title: '수정 실패',
        text: '전체 공지사항 수정이 실패했습니다.',
      });
    },
  });

  return {
    patchGlobalNoticeAsync,
    isPatchGlobalNoticeLoading,
    isPatchGlobalNoticeSuccess,
    isError,
    error,
  };
};

export default usePatchGlobalNoticePost;
