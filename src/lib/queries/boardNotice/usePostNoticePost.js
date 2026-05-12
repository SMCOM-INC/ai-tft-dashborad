import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { postNoticePost } from '@/apis/boardNotice.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostNoticePost = (aptUuid) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: (data) => {
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

      return postNoticePost(aptUuid, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['noticeList', aptUuid],
      });
      swalSuccessModal({ text: '공지사항이 성공적으로 등록되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data?.error || {};
      swalErrorModal({ text: message || '공지사항 등록이 실패했습니다.' });
    },
  });

  return {
    createNoticeMutationAsync: mutateAsync,
    isCreateNoticeLoading: isPending,
    isCreateNoticeSuccess: isSuccess,
  };
};

export default usePostNoticePost;
