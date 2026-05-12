import { useQuery } from '@tanstack/vue-query';

import { getVoteDetailPdf } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 투표 PDF
export const useGetVoteDetailPdf = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams } = useNavigate();

  const {
    data: voteDetailVotersPdf,
    isLoading: isVoteDetailVotersPdfLoading,
    refetch,
  } = useQuery({
    queryKey: ['voteDetailPdf', getParams().voteUuid],
    queryFn: () =>
      getVoteDetailPdf({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const refetchVoteDetailVotersPdf = async () => {
    if (
      !validateQueryEnabledParams(userInfo.aptUuid) ||
      !validateQueryEnabledParams(getParams().voteUuid)
    ) {
      swalErrorModal({ text: '잘못된 요청입니다.' });
      return;
    }

    await refetch();

    if (!voteDetailVotersPdf.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: voteDetailVotersPdf.value,
      type: 'pdf',
      fileName: '투표결과',
    });
  };

  return {
    voteDetailVotersPdf,
    isVoteDetailVotersPdfLoading,
    refetchVoteDetailVotersPdf,
  };
};

export default useGetVoteDetailPdf;
