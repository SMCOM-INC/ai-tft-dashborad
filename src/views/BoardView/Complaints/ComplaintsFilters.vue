<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { ref, watch } from 'vue';

  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetComplaintCategoryList from '@/lib/queries/boardComplaints/useGetComplaintCategoryList.js';

  const { dateRange, resetDateRange } = useDateRangeRouteSync();
  const { updateParam, removeParam } = useQueryString();

  const { complaintCategoryList, isComplaintCategoryListLoading } =
    useGetComplaintCategoryList();

  const filterCategoryList = ref({});

  const COMPLAINT_STATUS_FILTER = {
    filterName: '처리 상태',
    filterKey: 'status',
    list: [
      { key: 'ALL', label: '전체' },
      { key: 'RECEIVED', label: '접수' },
      { key: 'IN_PROGRESS', label: '처리중' },
      { key: 'COMPLETED', label: '처리완료' },
    ],
  };

  const selectFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([COMPLAINT_STATUS_FILTER.filterKey]);
    } else {
      updateParam({ [COMPLAINT_STATUS_FILTER.filterKey]: value });
    }
  };

  watch(
    complaintCategoryList,
    (newValue) => {
      if (!newValue) {
        return;
      }

      filterCategoryList.value = {
        filterName: '주제',
        filterKey: 'categoryUuidList',
        list: newValue?.map((item) => ({
          key: item?.categoryUuid,
          label: item?.categoryName,
        })),
      };
    },
    { immediate: true },
  );
</script>

<template>
  <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  <div v-if="isComplaintCategoryListLoading" class="flex h-full items-center">
    <SpinnerCircle color="blue" />
  </div>
  <FilterCheckboxGroup v-else :filter="filterCategoryList" />
  <FilterRadioGroup :filter="COMPLAINT_STATUS_FILTER" @select="selectFilter" />
</template>
