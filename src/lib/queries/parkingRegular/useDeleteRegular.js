import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { deleteRegular } from '@/apis/parkingRegular.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 정기차량 삭제
const useDeleteRegular = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { getCurrentRoutePath, navigateTo } = useNavigate();

  const {
    mutateAsync: deleteRegularCarMutationAsync,
    isPending: isDeleteRegularCarPending,
    isError: isDeleteRegularCarError,
    error: deleteRegularCarError,
  } = useMutation({
    mutationFn: (regularUuidList) =>
      deleteRegular({
        aptUuid: userInfo.aptUuid,
        regularUuidList: regularUuidList.join(','),
      }),
    onSuccess: () => {
      swalSuccessModal({
        text: '정기차량이 삭제되었습니다.',
      });

      // 세대 조회 무효화
      if (getCurrentRoutePath().includes('house')) {
        queryClient.invalidateQueries([
          'householdRegularCarList',
          userInfo.aptUuid,
        ]);
        navigateTo('/parking/regular/house');
      }

      // 업무 조회 무효화
      if (getCurrentRoutePath().includes('business')) {
        queryClient.invalidateQueries([
          'businessRegularCarList',
          userInfo.aptUuid,
        ]);
        navigateTo('/parking/regular/business');
      }
    },
    onError: (error) => {
      const { message } = error.data.error;

      swalErrorModal({
        text: message,
      });
    },
  });

  return {
    deleteRegularCarMutationAsync,
    isDeleteRegularCarPending,
    isDeleteRegularCarError,
    deleteRegularCarError,
  };
};

export default useDeleteRegular;
