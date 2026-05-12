import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchResidentDetail } from '@/apis/member.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';

const usePatchResidentDetail = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutate: patchResidentDetailMutation,
    isPending: isPatchResidentDetailPending,
    isSuccess: isPatchResidentDetailSuccess,
    reset: resetPatchResidentDetail,
  } = useMutation({
    mutationFn: ({ residentUuid, residentDetail }) =>
      patchResidentDetail(aptUuid, residentUuid, residentDetail),
    onSuccess: (_, { residentUuid }) => {
      queryClient.invalidateQueries(['residentDetail', aptUuid, residentUuid]);
      queryClient.invalidateQueries(['residentList', aptUuid]);
      swalSuccessModal({ text: '회원 정보가 수정되었습니다.' });
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message || '회원 정보 수정에 실패했습니다.',
      });
    },
  });

  return {
    patchResidentDetailMutation,
    isPatchResidentDetailPending,
    isPatchResidentDetailSuccess,
    resetPatchResidentDetail,
  };
};

export default usePatchResidentDetail;
