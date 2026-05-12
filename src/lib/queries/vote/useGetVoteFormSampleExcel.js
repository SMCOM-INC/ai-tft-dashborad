import { useQuery } from '@tanstack/vue-query';

import { getVoteFormSampleExcel } from '@/apis/vote.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 참여자리스트 엑셀 샘플 다운로드
export const useGetVoteFormSampleExcel = () => {
  const { userInfo } = useUserInfoStore();

  const {
    data: voteFormSampleExcel,
    isLoading: isVoteFormSampleExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['voteFormSampleExcel'],
    queryFn: () =>
      getVoteFormSampleExcel({
        aptUuid: userInfo.aptUuid,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchVoteFormSampleExcel = async () => {
    if (!validateQueryEnabledParams(userInfo.aptUuid)) {
      swalErrorModal({ text: '잘못된 요청입니다.' });
      return;
    }

    await refetch();

    if (!voteFormSampleExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: voteFormSampleExcel.value,
      type: 'xlsx',
      fileName: '투표 등록 샘플',
    });
  };

  return {
    voteFormSampleExcel,
    isVoteFormSampleExcelLoading,
    refetchVoteFormSampleExcel,
  };
};

export default useGetVoteFormSampleExcel;
