import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getResidentListExcel } from '@/apis/member.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 등록회원 엑셀 다운로드
export const useGetResidentListExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: residentListExcel,
    isLoading: isResidentListExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['residentListExcel'],
    queryFn: () =>
      getResidentListExcel({
        aptUuid: userInfo.aptUuid,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchResidentListExcel = async () => {
    await refetch();

    if (!residentListExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: residentListExcel.value,
      type: 'xlsx',
      fileName: '등록회원 내역',
    });
  };

  return {
    residentListExcel,
    isResidentListExcelLoading,
    refetchResidentListExcel,
  };
};

export default useGetResidentListExcel;
