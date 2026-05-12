import { useMutation } from '@tanstack/vue-query';
import { computed } from 'vue';

import { deleteResident } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useDeleteResident = () => {
  const { userInfo } = useUserInfoStore();
  const { navigateBack, getParams, getCurrentRoutePath } = useNavigate();
  const isMemberDetailPage = computed(() => {
    return getCurrentRoutePath().includes('/member/member-info/detail');
  });

  const {
    mutateAsync: deleteResidentMutationAsync,
    isPending: isDeleteResidentPending,
    isError: isDeleteResidentError,
    error: deleteResidentError,
  } = useMutation({
    mutationFn: (params = {}) => {
      const { residentUuid } = params;

      return deleteResident({
        aptUuid: userInfo.aptUuid,
        residentUuid: isMemberDetailPage.value
          ? getParams().uuid
          : residentUuid,
      });
    },
    onSuccess: () => {
      swalSuccessModal({
        text: '세대원 전출 처리되었습니다.',
        callback: () => navigateBack(),
      });
    },
  });

  return {
    deleteResidentMutationAsync,
    isDeleteResidentPending,
    isDeleteResidentError,
    deleteResidentError,
  };
};

export default useDeleteResident;
