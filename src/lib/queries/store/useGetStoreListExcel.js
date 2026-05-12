import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getStoreListExcel } from '@/apis/store.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useGetStoreListExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: storeListExcel,
    isLoading: isStoreListExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['storeListExcel'],
    queryFn: () => {
      return getStoreListExcel({
        aptUuid: userInfo.aptUuid,
        page: queryString.value.page || 0,
        size: queryString.value.size || 10,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
      });
    },
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchStoreListExcel = async () => {
    await refetch();

    if (!storeListExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: storeListExcel.value,
      type: 'xlsx',
      fileName: '상가내역',
    });
  };

  return {
    isStoreListExcelLoading,
    refetchStoreListExcel,
  };
};

export default useGetStoreListExcel;
