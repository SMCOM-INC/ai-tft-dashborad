<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';

  import { filterCarType } from '@/constants/common.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';

  const { dateRange, resetDateRange } = useDateRangeRouteSync();
</script>

<template>
  <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  <FilterCheckboxGroup :filter="filterCarType" />
</template>
