import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getRegularListExcel } from '@/apis/parkingRegular.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 정기차량 엑셀 다운로드
export const useGetRegularListExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getCurrentRoutePath, getQueryString } = useNavigate();

  const queryString = computed(() => getQueryString());
  const isHouseholdType = computed(() => {
    return getCurrentRoutePath().includes('house');
  });

  const {
    data: regularListExcel,
    isLoading: isRegularListExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['regularListExcel'],
    queryFn: () =>
      getRegularListExcel({
        aptUuid: userInfo.aptUuid,
        type: isHouseholdType.value ? 'household' : 'business',
        page: queryString.value.page,
        size: queryString.value.size,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        businessTypeUuidList: queryString.value.businessTypeUuidList,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchRegularListExcel = async () => {
    await refetch();

    if (!regularListExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: regularListExcel.value,
      type: 'xlsx',
      fileName: '정기차량 내역',
    });
  };

  return {
    regularListExcel,
    isRegularListExcelLoading,
    refetchRegularListExcel,
  };
};

export default useGetRegularListExcel;
