import { useMutation, useQueryClient } from '@tanstack/vue-query';
import _ from 'lodash';

import { postGlobalNoticePost } from '@/apis/boardGlobalNotice.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePostGlobalNoticePost = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: postGlobalNoticeAsync,
    isPending: isPostGlobalNoticeLoading,
    isSuccess: isPostGlobalNoticeSuccess,
    isError,
  } = useMutation({
    mutationFn: (data) => {
      // JSON 형식으로 직접 전송
      return postGlobalNoticePost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['globalNoticeList'],
      });

      swalSuccessModal({
        title: '등록 완료',
        text: '전체 공지사항이 성공적으로 등록되었습니다.',
      });
    },
    onError: (error) => {
      const message = _.get(
        error,
        'data.error.message',
        '전체 공지사항 등록이 실패했습니다.',
      );
      swalErrorModal({
        title: '등록 실패',
        text: message,
      });
    },
  });

  return {
    postGlobalNoticeAsync,
    isPostGlobalNoticeLoading,
    isPostGlobalNoticeSuccess,
    isError,
  };
};

export default usePostGlobalNoticePost;
