import { useMutation } from '@tanstack/vue-query';

import { postStore } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상가 등록
const usePostStore = () => {
  const { userInfo } = useUserInfoStore();
  const { navigateTo } = useNavigate();

  const convertToMinutes = (hours, minutes) => {
    const parsedHours = parseInt(hours, 10) || 0;
    const parsedMinutes = parseInt(minutes, 10) || 0;

    return parsedHours * 60 + parsedMinutes;
  };

  const { mutate: postStoreMutation, isPending: isPostStorePending } =
    useMutation({
      mutationFn: ({
        storeDong,
        storeHo,
        storeName,
        representativePhone,
        representativeName,
        storeId,
        password,
        freeParkingDiscountHours,
        freeParkingDiscountMinutes,
      }) => {
        return postStore({
          aptUuid: userInfo.aptUuid,
          storeDong: storeDong.trim(),
          storeHo: storeHo.trim(),
          storeName: storeName.trim(),
          representativePhone: representativePhone.trim(),
          representativeName: representativeName.trim(),
          storeId: storeId.trim(),
          password: password.trim(),
          freeParkingDiscountMinute: convertToMinutes(
            freeParkingDiscountHours,
            freeParkingDiscountMinutes,
          ),
        });
      },
      onSuccess: () => {
        swalSuccessModal({ text: '상가가 등록되었습니다.' });
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

  return { postStoreMutation, isPostStorePending };
};

export default usePostStore;
