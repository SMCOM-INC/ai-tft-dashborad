<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { ref, watch } from 'vue';

  import { BOARD_NOTICE_FILTER } from '@/constants/board.js';
  import { FILTER_ALL } from '@/constants/common.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetNoticeCategoryList from '@/lib/queries/boardNotice/useGetNoticeCategoryList.js';

  const { dateRange, resetDateRange } = useDateRangeRouteSync();

  const { updateParam, removeParam } = useQueryString();

  const { aptNoticeCategoryList, isAptNoticeCategoryListLoading } =
    useGetNoticeCategoryList();

  const filterCategoryList = ref({});

  const selectNoticeTypeFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([BOARD_NOTICE_FILTER.filterKey]);
    } else {
      updateParam({ [BOARD_NOTICE_FILTER.filterKey]: value });
    }
  };

  const selectCategoryFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([filterCategoryList.value.filterKey]);
    } else {
      updateParam({ [filterCategoryList.value.filterKey]: value });
    }
  };

  watch(
    aptNoticeCategoryList,
    (newValue) => {
      if (!newValue) {
        return;
      }

      const convertList = newValue?.map((item) => ({
        key: item?.uuid,
        label: item?.category,
      }));

      filterCategoryList.value = {
        filterName: '주제',
        filterKey: 'categoryUuid',
        list: [FILTER_ALL, ...convertList],
      };
    },
    { immediate: true },
  );
</script>

<template>
  <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  <div v-if="isAptNoticeCategoryListLoading" class="flex h-full items-center">
    <SpinnerCircle color="blue" />
  </div>
  <FilterRadioGroup
    v-else
    :filter="filterCategoryList"
    @select="selectCategoryFilter"
  />
  <FilterRadioGroup
    :filter="BOARD_NOTICE_FILTER"
    @select="selectNoticeTypeFilter"
  />
</template>
