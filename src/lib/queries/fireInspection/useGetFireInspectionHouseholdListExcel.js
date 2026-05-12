import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getFireInspectionHouseholdListExcel } from '@/apis/fireInspection.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 세대별 현황 목록 조회 엑셀 다운로드
export const useGetFireInspectionHouseholdListExcel = ({
  fireInspectionUuid,
}) => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const {
    data: fireInspectionHouseholdListExcel,
    isLoading: isFireInspectionHouseholdListExcelLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'fireInspectionHouseholdListExcel',
      userInfo.aptUuid,
      fireInspectionUuid,
      queryString,
    ],
    queryFn: () => {
      return getFireInspectionHouseholdListExcel({
        aptUuid: userInfo.aptUuid,
        fireInspectionUuid: fireInspectionUuid.value,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        submissionStatus: queryString.value.submissionStatus,
      });
    },
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchFireInspectionHouseholdListExcel = async () => {
    await refetch();

    if (!fireInspectionHouseholdListExcel.value) {
      swalErrorModal({ text: '엑셀 다운로드에 실패했습니다.' });

      return;
    }

    return downloadFile({
      data: fireInspectionHouseholdListExcel.value,
      type: 'xlsx',
      fileName: '소방자가점검_세대별현황',
    });
  };

  return {
    isFireInspectionHouseholdListExcelLoading,
    refetchFireInspectionHouseholdListExcel,
  };
};

export default useGetFireInspectionHouseholdListExcel;
