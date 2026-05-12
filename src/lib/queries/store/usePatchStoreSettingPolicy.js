import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { patchStoreSettingPolicy } from '@/apis/store.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

const usePatchStoreSettingPolicy = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();

  const {
    mutateAsync: patchStoreSettingPolicyMutationAsync,
    isPending: isPatchStoreSettingPolicyPending,
  } = useMutation({
    mutationFn: ({
      account,
      accountHolder,
      bank,
      billingType,
      parkingDiscountType,
      parkingPrice,
      turningCarPolicy,
      turningMinute,
    }) => {
      const accountNumber = `${bank?.trim()}_${accountHolder?.trim()}_${account?.trim()}`;

      if (billingType === 'PREPAID') {
        return patchStoreSettingPolicy({
          aptUuid: userInfo.aptUuid,
          billingType,
          parkingDiscountType,
          parkingPrice,
          turningCarPolicy,
          turningMinute: turningMinute || 0,
          accountNumber,
        });
      }

      return patchStoreSettingPolicy({
        aptUuid: userInfo.aptUuid,
        billingType,
        parkingDiscountType,
        parkingPrice,
        turningCarPolicy,
        turningMinute: turningMinute || 0,
      });
    },
    onSuccess: () => {
      swalSuccessModal({ text: '설정이 적용되었습니다.' });
      queryClient.invalidateQueries({
        queryKey: ['storeSettingPolicy', userInfo.aptUuid],
      });

      if (token.userRole === 'store_admin') {
        queryClient.invalidateQueries({
          queryKey: ['storeAdminAptDetail'],
        });
      } else if (token.userRole === 'master') {
        queryClient.invalidateQueries({
          queryKey: ['aptDetail'],
        });
      }
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return {
    patchStoreSettingPolicyMutationAsync,
    isPatchStoreSettingPolicyPending,
  };
};

export default usePatchStoreSettingPolicy;
