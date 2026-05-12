import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';

import { getStoreDetail } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreDetail = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, navigateBack } = useNavigate();

  const {
    data: storeDetail,
    isLoading: isStoreDetailLoading,
    error: storeDetailError,
  } = useQuery({
    queryKey: ['storeDetail', userInfo.aptUuid],
    queryFn: () => {
      return getStoreDetail({
        aptUuid: userInfo.aptUuid,
        storeUuid: getParams().uuid,
      });
    },
    select: (data) => {
      return data.data.success;
    },
    enabled: !!userInfo.aptUuid,
  });

  watch(storeDetailError, (newValue) => {
    if (newValue) {
      const { errorCode, message } = storeDetailError.value.data.error;

      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
          navigateBack();
      }
    }
  });

  return {
    storeDetail,
    isStoreDetailLoading,
  };
};

export default useGetStoreDetail;
