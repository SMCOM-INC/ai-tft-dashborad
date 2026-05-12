import { useMutation } from '@tanstack/vue-query';

import { patchStore } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상가 수정
const usePatchStore = () => {
  const { userInfo } = useUserInfoStore();
  const { navigateTo, getParams } = useNavigate();

  const convertToMinutes = (hours, minutes) => {
    const parsedHours = parseInt(hours, 10) || 0;
    const parsedMinutes = parseInt(minutes, 10) || 0;

    return parsedHours * 60 + parsedMinutes;
  };

  const { mutate: patchStoreMutation, isPending: isPatchStorePending } =
    useMutation({
      mutationFn: ({
        storeName,
        representativePhone,
        representativeName,
        freeParkingDiscountHours,
        freeParkingDiscountMinutes,
      }) => {
        return patchStore({
          aptUuid: userInfo.aptUuid,
          storeUuid: getParams().uuid,
          storeName: storeName.trim(),
          representativePhone: representativePhone.trim(),
          representativeName: representativeName.trim(),
          freeParkingDiscountMinute: convertToMinutes(
            freeParkingDiscountHours,
            freeParkingDiscountMinutes,
          ),
        });
      },
      onSuccess: () => {
        swalSuccessModal({ text: '상가가 수정되었습니다.' });
        navigateTo('/store/management');
      },
      onError: (error) => {
        const { errorCode, message } = error.data.error;
        switch (errorCode) {
          default:
            swalErrorModal({ text: message });
        }
      },
    });

  return { patchStoreMutation, isPatchStorePending };
};

export default usePatchStore;
