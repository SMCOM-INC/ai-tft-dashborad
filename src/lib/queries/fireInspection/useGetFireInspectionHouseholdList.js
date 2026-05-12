import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getFireInspectionHouseholdList } from '@/apis/fireInspection.js';
import useNavigate from '@/lib/composables/common/useNavigate.js';
import validateQueryEnabledParams from '@/lib/utils/validateQueryEnabledParams.js';
import { useUserInfoStore } from '@/stores/auth.js';

// 세대별 현황 목록 조회
const useGetFireInspectionHouseholdList = ({ fireInspectionUuid }) => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString, getParams } = useNavigate();
  const queryString = computed(() => getQueryString());
  const params = computed(() => getParams());

  const {
    data: fireInspectionHouseholdList,
    isLoading: isFireInspectionHouseholdListLoading,
    error: fireInspectionHouseholdListError,
    isError: isFireInspectionHouseholdListError,
    refetch: fireInspectionHouseholdListRefetch,
  } = useQuery({
    queryKey: [
      'fireInspectionHouseholdList',
      userInfo.aptUuid,
      fireInspectionUuid,
      queryString,
    ],
    queryFn: () => {
      return getFireInspectionHouseholdList({
        aptUuid: userInfo.aptUuid,
        fireInspectionUuid:
          params.value.fireInspectionUuid || fireInspectionUuid.value,
        searchType: queryString.value.searchType,
        keyword: queryString.value.keyword,
        submissionStatus: queryString.value.submissionStatus,
        page: queryString.value.page || 0,
        size: queryString.value.size || 10,
      });
    },
    enabled: () =>
      validateQueryEnabledParams(userInfo.aptUuid) &&
      validateQueryEnabledParams(fireInspectionUuid.value),
    placeholderData: keepPreviousData,
    select: (data) => {
      const response = data.data.success;
      const paginationInfo = response.householdFireInspectionList;
      return {
        // 통계 정보
        startDate: response.startDate,
        endDate: response.endDate,
        totalHouseholdCount: response.totalHouseholdCount,
        submittedCount: response.submittedCount,
        notSubmittedCount: response.notSubmittedCount,
        submittedRate: response.submittedRate,
        // pagination
        content: paginationInfo.content,
        totalPages: paginationInfo.totalPages,
        totalElements: paginationInfo.totalElements,
        numberOfElements: paginationInfo.numberOfElements,
        page: paginationInfo.number,
        size: paginationInfo.size,
        first: paginationInfo.first,
        last: paginationInfo.last,
        empty: paginationInfo.empty,
      };
    },
  });

  return {
    fireInspectionHouseholdList,
    isFireInspectionHouseholdListLoading,
    fireInspectionHouseholdListError,
    isFireInspectionHouseholdListError,
    fireInspectionHouseholdListRefetch,
  };
};

export default useGetFireInspectionHouseholdList;
