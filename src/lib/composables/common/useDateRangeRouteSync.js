import { computed, ref, watch } from 'vue';

import useNavigate from '@/lib/composables/common/useNavigate.js';
import useQueryString from '@/lib/composables/common/useQueryString.js';
import { getDateRange } from '@/lib/utils/formatDate.js';

const useDateRangeRouteSync = (defaultRange) => {
  const { getQueryString } = useNavigate();
  const { updateParam, removeParam } = useQueryString();

  const queryString = computed(() => getQueryString());

  // 초기 로딩 플래그
  const isInitialLoad = ref(true);

  // defaultRange가 없으면 빈 배열로 초기화
  const dateRange = ref(
    defaultRange
      ? [
          getDateRange(defaultRange)?.startDate,
          getDateRange(defaultRange)?.endDate,
        ]
      : [],
  );

  // 날짜 범위 리셋 함수
  const resetDateRange = () => {
    if (!defaultRange) {
      removeParam(['startDate', 'endDate']);

      return;
    }

    dateRange.value = [
      getDateRange(defaultRange)?.startDate,
      getDateRange(defaultRange)?.endDate,
    ];
  };

  // dateRange가 변경될 때 URL 업데이트
  watch(
    dateRange,
    (newValue, oldValue) => {
      if (!newValue || newValue.length === 0 || !newValue[0] || !newValue[1]) {
        return;
      }

      // 초기 로딩 시 URL 업데이트 건너뛰기 (defaultRange가 있을 때만)
      if (isInitialLoad.value) {
        isInitialLoad.value = false;

        // defaultRange가 있을 때만 초기 렌더링 시 URL 업데이트 건너뛰기
        if (defaultRange) {
          return;
        }
      }

      // 날짜가 실제로 변경되었는지 확인
      // oldValue가 없거나 빈 배열이면 첫 입력으로 간주하여 업데이트
      const isDateChanged =
        !oldValue ||
        oldValue.length === 0 ||
        oldValue[0] !== newValue[0] ||
        oldValue[1] !== newValue[1];

      // 날짜가 변경된 경우에만 route 업데이트
      if (isDateChanged) {
        const params = {
          startDate: newValue[0],
          endDate: newValue[1],
        };

        updateParam(params);
      }
    },
    { deep: true },
  );

  // route가 변경될 때 dateRange 업데이트
  watch(
    queryString,
    (newValue) => {
      // 빈 객체면 resetDateRange 실행
      if (Object.keys(newValue).length === 0) {
        resetDateRange();
        return;
      }

      if (newValue.startDate || newValue.endDate) {
        const cleanStart = newValue.startDate?.slice(0, 10);
        const cleanEnd = newValue.endDate?.slice(0, 10);

        dateRange.value = [cleanStart, cleanEnd];

        // URL에 시간이 포함된 경우 날짜만 남기도록 URL 정리
        if (
          newValue.startDate !== cleanStart ||
          newValue.endDate !== cleanEnd
        ) {
          updateParam({ startDate: cleanStart, endDate: cleanEnd });
        }
      }
    },
    { immediate: true },
  );

  return {
    dateRange,
    resetDateRange,
    queryString,
  };
};

export default useDateRangeRouteSync;
