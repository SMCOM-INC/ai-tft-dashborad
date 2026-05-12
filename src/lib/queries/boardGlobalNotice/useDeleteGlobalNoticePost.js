import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteGlobalNoticePost } from '@/apis/boardGlobalNotice.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const useDeleteGlobalNoticePost = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteGlobalNoticeMutationAsync,
    isPending: isDeleteGlobalNoticePending,
    isError,
  } = useMutation({
    mutationFn: (globalNoticeUuid) => deleteGlobalNoticePost(globalNoticeUuid),
    onSuccess: () => {
      // 전체 공지사항 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['globalNoticeList'],
      });

      // 성공 알림
      swalSuccessModal({
        title: '삭제 완료',
        text: '전체 공지사항이 삭제되었습니다.',
      });
    },
    onError: () => {
      swalErrorModal({
        title: '삭제 실패',
        text: '전체 공지사항 삭제 중 오류가 발생했습니다.',
      });
    },
  });

  return {
    deleteGlobalNoticeMutationAsync,
    isDeleteGlobalNoticePending,
    isError,
  };
};

export default useDeleteGlobalNoticePost;
