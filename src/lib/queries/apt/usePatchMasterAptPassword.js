import { useMutation } from '@tanstack/vue-query';

import { patchMasterAptPassword } from '@/apis/apt.js';

const usePatchMasterAptPassword = () => {
  const {
    mutateAsync: patchAdminPasswordInit,
    isLoading: isPasswordInitLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (data) => patchMasterAptPassword(data.aptUuid, data.password),
  });

  return { patchAdminPasswordInit, isPasswordInitLoading, isError, error };
};

export default usePatchMasterAptPassword;
