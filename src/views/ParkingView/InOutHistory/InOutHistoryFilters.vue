<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { computed, ref, watch } from 'vue';

  import { ADMIN_PARKING_IN_OUT_HISTORY_FILTERS } from '@/constants/parking.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import {
    useFetchAptBusinessTypeList,
    useFetchAptVisitPurposeList,
  } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';

  const { dateRange, resetDateRange } = useDateRangeRouteSync('thisMonth');

  const { aptVisitPurposeList, isAptVisitPurposeListLoading } =
    useFetchAptVisitPurposeList();
  const { aptBusinessTypeList, isAptBusinessTypeListLoading } =
    useFetchAptBusinessTypeList();

  const filterVisitPurpose = ref({});
  const filterBusinessType = ref({});

  // 3개월 전 1일까지만 선택 가능
  const minDate = computed(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 2);
    return date;
  });

  watch(
    aptVisitPurposeList,
    (newValue) => {
      if (!newValue) {
        return;
      }

      filterVisitPurpose.value = {
        filterName: '방문 목적',
        filterKey: 'visitPurposeUuidList',
        list: newValue?.map((item) => ({
          key: item?.uuid,
          label: item?.name,
        })),
      };
    },
    { immediate: true },
  );

  watch(
    aptBusinessTypeList,
    (newValue) => {
      if (!newValue) {
        return;
      }

      filterBusinessType.value = {
        filterName: '업무 목적',
        filterKey: 'businessTypeUuidList',
        list: newValue?.map((item) => ({
          key: item?.uuid,
          label: item?.name,
        })),
      };
    },
    { immediate: true },
  );
</script>

<template>
  <DateRangePicker
    v-model="dateRange"
    :min-date="minDate"
    @reset="resetDateRange"
  />
  <FilterCheckboxGroup
    v-for="filter in ADMIN_PARKING_IN_OUT_HISTORY_FILTERS"
    :key="filter.filterKey"
    :filter="filter"
  />
  <div v-if="isAptVisitPurposeListLoading" class="flex h-full items-center">
    <SpinnerCircle color="blue" />
  </div>
  <FilterCheckboxGroup v-else :filter="filterVisitPurpose" />
  <div v-if="isAptBusinessTypeListLoading" class="flex h-full items-center">
    <SpinnerCircle color="blue" />
  </div>
  <div v-else class="flex gap-2">
    <FilterCheckboxGroup :filter="filterBusinessType" />
  </div>
</template>
