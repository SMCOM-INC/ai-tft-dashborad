import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteFireInspectionHousehold } from '@/apis/fireInspection.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 세대 점검 삭제
export const useDeleteFireInspectionHousehold = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: deleteFireInspectionHouseholdMutationAsync,
    isPending: isDeleteFireInspectionHouseholdPending,
  } = useMutation({
    mutationFn: ({ fireInspectionUuid, householdFireInspectionUuid }) => {
      if (!fireInspectionUuid) {
        throw new Error('올바른 점검 UUID가 아닙니다.');
      }

      if (!householdFireInspectionUuid) {
        throw new Error('올바른 세대 점검 UUID가 아닙니다.');
      }

      return deleteFireInspectionHousehold({
        aptUuid: userInfo.aptUuid,
        fireInspectionUuid,
        householdFireInspectionUuid,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fireInspectionHouseholdList'],
      });

      swalSuccessModal({ text: '세대 점검이 초기화되었습니다.' });
    },

    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'HOUSEHOLD_FIRE_INSPECTION_NOT_FOUND':
          swalErrorModal({ text: '세대 점검 항목을 찾을 수 없습니다.' });
          break;
        default:
          swalErrorModal({
            text: message || '세대 점검 초기화에 실패했습니다.',
          });
      }
    },
  });

  return {
    deleteFireInspectionHouseholdMutationAsync,
    isDeleteFireInspectionHouseholdPending,
  };
};

export default useDeleteFireInspectionHousehold;
