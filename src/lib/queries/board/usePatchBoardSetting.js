import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchBoardSetting } from '@/apis/board.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 게시판 설정 수정
const usePatchBoardSetting = () => {
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const queryClient = useQueryClient();

  const {
    mutateAsync: patchBoardSettingMutation,
    isPending: isPatchBoardSettingPending,
  } = useMutation({
    mutationFn: (data) => patchBoardSetting({ aptUuid, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['boardSettingDetail', aptUuid],
      });
      swalSuccessModal({ text: '게시판 설정이 수정되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message || '게시판 설정 수정에 실패했습니다.' });
    },
  });

  return {
    patchBoardSettingMutation,
    isPatchBoardSettingPending,
  };
};

export default usePatchBoardSetting;
