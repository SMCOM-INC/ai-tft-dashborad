import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

import { postFireInspectionHousehold } from '@/apis/fireInspection.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { formatDateTimeObject } from '@/lib/utils/formatDate.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 세대 점검 수기등록
export const usePostFireInspectionHousehold = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();
  const params = computed(() => getParams());

  const {
    mutateAsync: createFireInspectionHouseholdMutationAsync,
    isPending: isCreateFireInspectionHouseholdPending,
  } = useMutation({
    mutationFn: ({
      fireInspectionUuid,
      householdUuid,
      submissionType,
      inspector,
      inspectorPhone,
      submissionDateTime,
      questionAnswerList,
    }) => {
      const fireInspectionUuidValue =
        params.value.fireInspectionUuid || fireInspectionUuid;

      if (!fireInspectionUuidValue) {
        throw new Error('올바른 점검 UUID가 아닙니다.');
      }

      if (!householdUuid) {
        throw new Error('올바른 세대 점검 UUID가 아닙니다.');
      }

      return postFireInspectionHousehold({
        aptUuid: userInfo.aptUuid,
        fireInspectionUuid: fireInspectionUuidValue,
        householdUuid,
        submissionType,
        inspector,
        inspectorPhone: inspectorPhone?.replace(/-/g, ''),
        submissionDateTime: formatDateTimeObject(submissionDateTime, 'start'),
        questionAnswerList,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fireInspectionHouseholdList'],
      });

      swalSuccessModal({ text: '세대 점검이 등록되었습니다.' });
    },
    onError: (error) => {
      if (!error.data) {
        swalErrorModal({
          text: error.message || '세대 점검 등록에 실패했습니다.',
        });
        return;
      }

      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'ALREADY_SUBMITTED':
          swalErrorModal({ text: '이미 제출된 점검입니다.' });
          break;
        default:
          swalErrorModal({ text: message || '세대 점검 등록에 실패했습니다.' });
      }
    },
  });

  return {
    createFireInspectionHouseholdMutationAsync,
    isCreateFireInspectionHouseholdPending,
  };
};

export default usePostFireInspectionHousehold;
