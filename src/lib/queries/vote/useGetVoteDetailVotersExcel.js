import { useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';

import { getVoteDetailVotersExcel } from '@/apis/vote.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import downloadFile from '@/lib/utils/downloadFile.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 상세조회 참여자 엑셀
export const useGetVoteDetailVotersExcel = () => {
  const { userInfo } = useUserInfoStore();
  const { getParams, getQueryString } = useNavigate();
  const queryString = computed(() => getQueryString());

  const keyword = ref(null);
  const searchType = ref(null);
  const statusSearchType = ref(null);

  const {
    data: voteDetailVotersExcel,
    isLoading: isVoteDetailVotersExcelLoading,
    refetch,
  } = useQuery({
    queryKey: ['voteDetailVotersExcel'],
    queryFn: () =>
      getVoteDetailVotersExcel({
        aptUuid: userInfo.aptUuid,
        voteUuid: getParams().voteUuid,
        keyword: keyword.value,
        searchType: searchType.value,
        statusSearchType: statusSearchType.value,
      }),
    enabled: false,
    select: (data) => {
      return data.data;
    },
  });

  const setParams = () => {
    const searchTypeMap = {
      NAME: 'NAME',
      PHONE: 'PHONE',
      DONG: 'DONG',
      HO: 'HO',
      DONG_HO: 'DONG_HO',
    };

    if (Object.keys(queryString.value).length === 0) {
      searchType.value = undefined;
      keyword.value = undefined;
      statusSearchType.value = undefined;
      return;
    }

    Object.entries(queryString.value).map(([key, value]) => {
      // 필터
      if (key === 'statusSearchType') {
        statusSearchType.value = value;
        return;
      }

      // 검색어
      if (value) {
        searchType.value = searchTypeMap[key] || null;
      } else {
        searchType.value = null;
      }

      keyword.value = value;

      return;
    });
  };

  const refetchVoteDetailVotersExcel = async () => {
    if (
      !validateQueryEnabledParams(userInfo.aptUuid) ||
      !validateQueryEnabledParams(getParams().voteUuid)
    ) {
      swalErrorModal({ text: '잘못된 요청입니다.' });
      return;
    }

    await refetch();

    if (!voteDetailVotersExcel.value) {
      swalErrorModal();

      return;
    }

    return downloadFile({
      data: voteDetailVotersExcel.value,
      type: 'xlsx',
      fileName: '투표 참여자 내역',
    });
  };

  watch(queryString, setParams, { immediate: true });

  return {
    voteDetailVotersExcel,
    isVoteDetailVotersExcelLoading,
    refetchVoteDetailVotersExcel,
    setParams,
  };
};

export default useGetVoteDetailVotersExcel;
