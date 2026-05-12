import { useMutation, useQueryClient } from '@tanstack/vue-query';

// import { postStoreForExcel } from '@/apis/store.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상가 엑셀 업로드
const usePostStoreForExcel = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfoStore();

  const {
    mutateAsync: postStoreForExcelMutationAsync,
    isPending: isPostStoreForExcelPending,
  } = useMutation({
    mutationFn: ({ excelFile }) => {
      const formData = new FormData();

      formData.append('excelFile', excelFile);

      return console.log({
        aptUuid: userInfo.aptUuid,
        formData,
      });

      // return postStoreForExcel({
      //   aptUuid: userInfo.aptUuid,
      //   formData,
      // });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['storeList']);
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        default:
          swalErrorModal({ text: message });
      }
    },
  });

  return { postStoreForExcelMutationAsync, isPostStoreForExcelPending };
};

export default usePostStoreForExcel;
