import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchNoticePost } from '@/apis/boardNotice.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePatchNoticePost = (aptUuid) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: ({ noticeUuid, data }) => {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === 'uploadFile' || key === 'imageFile') {
          const files = Array.isArray(data[key]) ? data[key] : [data[key]];
          files.forEach((file) => {
            formData.append(`${key}`, file);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      return patchNoticePost(noticeUuid, formData);
    },
    onSuccess: (_, { noticeUuid }) => {
      queryClient.invalidateQueries({
        queryKey: ['noticeDetail', aptUuid, noticeUuid],
      });
      queryClient.invalidateQueries({
        queryKey: ['noticeList', aptUuid],
      });
      swalSuccessModal({ text: '공지사항이 성공적으로 수정되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data?.error || {};
      swalErrorModal({ text: message || '공지사항 수정이 실패했습니다.' });
    },
  });

  return {
    updateNoticeMutationAsync: mutateAsync,
    isUpdateNoticeLoading: isPending,
    isUpdateNoticeSuccess: isSuccess,
  };
};

export default usePatchNoticePost;
