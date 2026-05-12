import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteNoticePost } from '@/apis/boardNotice.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteNoticePost = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const {
    mutateAsync: deleteNoticePostMutation,
    isPending: isDeleteNoticePostPending,
    isError: isDeleteNoticePostError,
    error: deleteNoticePostError,
  } = useMutation({
    mutationFn: async ({ noticeUuidList }) => {
      await Promise.all(
        noticeUuidList.map((noticeUuid) => deleteNoticePost({ noticeUuid })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['noticeList', userInfo.aptUuid]);

      swalSuccessModal({
        title: '삭제 성공',
        text: '공지사항이 삭제되었습니다.',
      });

      if (getCurrentRoutePath().includes('/board/notice/detail')) {
        navigateTo('/board/notice');
      }
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;

      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    deleteNoticePostMutation,
    isDeleteNoticePostPending,
    isDeleteNoticePostError,
    deleteNoticePostError,
  };
};

export default useDeleteNoticePost;
