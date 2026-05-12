import { useMutation } from '@tanstack/vue-query';
import { computed } from 'vue';

import { deleteHousehold } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteHousehold = () => {
  const { userInfo } = useUserInfoStore();
  const { navigateTo, getParams } = useNavigate();
  const householdUuid = computed(() => {
    return getParams().uuid;
  });

  const {
    mutateAsync: deleteHouseholdMutation,
    isPending: isDeleteHouseholdPending,
    isError: isDeleteHouseholdError,
    error: deleteHouseholdError,
  } = useMutation({
    mutationFn: () => {
      return deleteHousehold({
        aptUuid: userInfo.aptUuid,
        householdUuid: householdUuid.value,
      });
    },
    onSuccess: () => {
      swalSuccessModal({
        title: '전출 완료',
        text: '세대가 전출 처리되었습니다.',
        callback: () => navigateTo('/member/household-info'),
      });
    },
  });

  return {
    deleteHouseholdMutation,
    isDeleteHouseholdPending,
    isDeleteHouseholdError,
    deleteHouseholdError,
  };
};

export default useDeleteHousehold;
