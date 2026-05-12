import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchRepairState } from '@/apis/repair.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { repairStateSelectorSchema } from '@/schemas/repair.js';

const usePatchRepairState = (aptUuid) => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending: isPatchRepairStatePending,
    isSuccess: isPatchRepairStateSuccess,
    reset: resetPatchRepairState,
  } = useMutation({
    mutationFn: ({ repairUuid, state, visitDateTime, adminComment }) => {
      return patchRepairState(aptUuid, repairUuid, {
        repairUuid,
        state,
        visitDateTime,
        adminComment,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['repairDetail', aptUuid, variables.repairUuid],
      });
      queryClient.invalidateQueries({
        queryKey: ['repairList', aptUuid],
      });
      swalSuccessModal({ text: '접수상태가 수정되었습니다.' });
    },
  });
  //  RepairDetailModalResult.vue는 useForm을 사용하지 않고 일반 ref로 폼을 관리하고 있기 때문에
  //  mutation에서 safeParse 방식으로 처리.
  //  너무 많은 코드 수정 useForm + vee-validate 적용은 추후 다시 고려예정.(설정이 복잡 + 실시간 필드별 에러 표시 가능)
  //  safeParse => 한곳에서 처리, 간단함 / 에러를 Modal로만 표시해도 충분하고, 필드별 표시할 이유가 없다고 판단.
  const patchRepairStateMutationAsync = (payload) => {
    const result = repairStateSelectorSchema.safeParse(payload);

    if (!result.success) {
      const firstError = result.error.errors[0];
      swalErrorModal({
        title: '입력한 정보가 올바르지 않습니다.',
        text: firstError.message,
      });
      return;
    }

    mutate(payload);
  };

  return {
    patchRepairStateMutationAsync,
    isPatchRepairStatePending,
    isPatchRepairStateSuccess,
    resetPatchRepairState,
  };
};

export default usePatchRepairState;
