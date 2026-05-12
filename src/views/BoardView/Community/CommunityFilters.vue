<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { ref, watch } from 'vue';

  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetCommunityCategoryList from '@/lib/queries/boardCommunity/useGetCommunityCategoryList.js';

  const { dateRange, resetDateRange } = useDateRangeRouteSync();

  const { communityCategoryList, isCommunityCategoryListLoading } =
    useGetCommunityCategoryList();

  const filterCategoryList = ref({});

  watch(
    communityCategoryList,
    (newValue) => {
      if (!newValue) {
        return;
      }

      filterCategoryList.value = {
        filterName: '주제',
        filterKey: 'categoryUuidList',
        list: newValue?.map((item) => ({
          key: item?.uuid,
          label: item?.category,
        })),
      };
    },
    { immediate: true },
  );
</script>

<template>
  <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  <div v-if="isCommunityCategoryListLoading" class="flex h-full items-center">
    <SpinnerCircle color="blue" />
  </div>
  <FilterCheckboxGroup v-else :filter="filterCategoryList" />
</template>
