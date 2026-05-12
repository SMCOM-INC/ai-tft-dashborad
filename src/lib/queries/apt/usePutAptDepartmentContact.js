import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { putAptDepartmentContact } from '@/apis/apt.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const usePutAptDepartmentContact = () => {
  const { userInfo } = useUserInfoStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: putAptDepartmentContactMutationAsync,
    isPending: isPutAptDepartmentContactPending,
    isError: isPutAptDepartmentContactError,
    error: putAptDepartmentContactError,
  } = useMutation({
    mutationFn: ({ departmentContact }) => {
      return putAptDepartmentContact({
        aptUuid: userInfo.aptUuid,
        departmentContact,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['aptDepartmentContact', userInfo.aptUuid],
      });
      swalSuccessModal({ text: '부서별 연락처가 수정되었습니다.' });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message || '부서별 연락처 수정에 실패했습니다.' });
      }
    },
  });

  return {
    putAptDepartmentContactMutationAsync,
    isPutAptDepartmentContactPending,
    isPutAptDepartmentContactError,
    putAptDepartmentContactError,
  };
};

export default usePutAptDepartmentContact;
