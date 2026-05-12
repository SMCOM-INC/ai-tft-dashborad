<script setup>
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import { computed } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import { getDateRange } from '@/lib/utils/formatDate.js';

  const props = defineProps({
    monthCount: {
      type: Number,
      default: 3,
    },
    filterName: {
      type: String,
      default: '기간',
    },
    hasAll: {
      type: Boolean,
      default: false,
    },
    hasYear: {
      type: Boolean,
      default: false,
    },
    startKey: {
      type: String,
      default: 'startDate',
    },
    endKey: {
      type: String,
      default: 'endDate',
    },
  });

  const { getQueryString } = useNavigate();
  const { updateParam, removeParam } = useQueryString();

  const getMonthKey = (index) => {
    const keyNames = [
      'thisMonth',
      'lastMonth',
      'lastLastMonth',
      'month3Ago',
      'month4Ago',
      'month5Ago',
    ];

    return keyNames[index] || `month${index}Ago`;
  };

  // route에서 현재 선택된 period 찾기
  const selectedPeriodKey = computed(() => {
    const queryParams = getQueryString();

    const startDate = queryParams[props.startKey];
    const endDate = queryParams[props.endKey];

    if (!startDate || !endDate) {
      // route에 날짜가 없으면 첫 번째 옵션 반환
      return props.hasAll ? 'ALL' : 'thisMonth';
    }

    // Year 옵션 체크
    if (props.hasYear) {
      const yearKeys = ['thisYear', 'lastYear'];
      const matchedYearKey = yearKeys.find((key) => {
        const range = getDateRange(key);
        return (
          range && range.startDate === startDate && range.endDate === endDate
        );
      });
      if (matchedYearKey) {
        return matchedYearKey;
      }
    }

    // startDate와 endDate가 일치하는 period 찾기
    const matchedKey = Array.from(
      { length: props.monthCount },
      (_, index) => index,
    )
      .map((index) => getMonthKey(index))
      .find((monthKey) => {
        const range = getDateRange(monthKey);

        return (
          range && range.startDate === startDate && range.endDate === endDate
        );
      });

    if (matchedKey) {
      return matchedKey;
    }

    // 일치하는 period가 없으면 첫 번째 옵션 반환
    return props.hasAll ? 'ALL' : 'thisMonth';
  });

  const createMonthLabels = (monthsBack) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const month = new Date(currentYear, currentMonth - monthsBack);
    return `${month.getFullYear()}년 ${month.getMonth() + 1}월`;
  };

  const FILTER_PERIOD = computed(() => {
    const list = [];

    if (props.hasAll) {
      list.push({
        key: 'ALL',
        label: '전체',
        period: null,
      });
    }

    for (let i = 0; i < props.monthCount; i++) {
      const mothsKey = getMonthKey(i);

      list.push({
        key: mothsKey,
        label: createMonthLabels(i),
        period: getDateRange(mothsKey),
      });
    }

    if (props.hasYear) {
      const currentYear = new Date().getFullYear();
      list.push({
        key: 'thisYear',
        label: `${currentYear}년`,
        period: getDateRange('thisYear'),
      });
      list.push({
        key: 'lastYear',
        label: `${currentYear - 1}년`,
        period: getDateRange('lastYear'),
      });
    }

    return {
      filterName: props.filterName,
      filterKey: 'period',
      list,
    };
  });

  const selectFilter = (value) => {
    const selectedItem = FILTER_PERIOD.value.list.find(
      (item) => item.key === value,
    );

    const isDefaultValue =
      value === 'ALL' || value === FILTER_PERIOD.value.list[0]?.key;

    if (isDefaultValue) {
      removeParam([props.startKey, props.endKey]);
    } else {
      const { startDate, endDate } = selectedItem.period;
      updateParam({
        [props.startKey]: startDate,
        [props.endKey]: endDate,
        page: 0,
      });
    }
  };
</script>

<template>
  <FilterRadioGroup
    :filter="FILTER_PERIOD"
    :model-value="selectedPeriodKey"
    @select="selectFilter"
  />
</template>
