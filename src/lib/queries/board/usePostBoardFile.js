import { useMutation } from '@tanstack/vue-query';

import { postBoardFile } from '@/apis/board.js';
import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 게시판 파일 등록
export const usePostBoardFile = () => {
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: postBoardFileMutationAsync,
    isPending: isBoardFilePending,
  } = useMutation({
    mutationFn: ({ editorDomain, file }) => {
      const formData = new FormData();

      formData.append('contentType', editorDomain);
      formData.append('file', file);

      // master 에서 공지사항 등록시에는 aptUUid 전달불가
      // aptUuid 가 없어도 api call 이 가능함
      // editorDomain은 aptUuid 가 선택 안 됐을 때, 'APARTMENT_NOTICE' 로 임의 지정 됨.
      const aptUuid =
        userInfo.aptUuid || BOARD_EDITOR_CONTENT_TYPE.APARTMENT_NOTICE;

      return postBoardFile({ aptUuid, formData });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { postBoardFileMutationAsync, isPending: isBoardFilePending };
};

export default usePostBoardFile;
