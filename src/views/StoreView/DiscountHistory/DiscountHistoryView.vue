<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';

  import {
    DISCOUNT_HISTORY_SEARCH_INPUT_LIST,
    DISCOUNT_HISTORY_TABLE_COLUMNS_LIST,
  } from '@/constants/store.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetStoreDiscountHistory from '@/lib/queries/store/useGetStoreDiscountHistory.js';
  import useGetStoreDiscountHistoryExcel from '@/lib/queries/store/useGetStoreDiscountHistoryExcel.js';

  const {
    storeDiscountHistory,
    isStoreDiscountHistoryLoading,
    isStoreDiscountHistoryError,
    storeDiscountHistoryError,
  } = useGetStoreDiscountHistory();

  const {
    isStoreDiscountHistoryExcelLoading,
    refetchStoreDiscountHistoryExcel,
  } = useGetStoreDiscountHistoryExcel();

  const { dateRange, resetDateRange } = useDateRangeRouteSync('thisMonth');
</script>

<template>
  <div class="flex justify-between">
    <PageTitleBase
      title="할인 내역"
      paragraph="상가의 할인 내역을 관리합니다."
    />
  </div>
  <SearchBar
    :search-input="DISCOUNT_HISTORY_SEARCH_INPUT_LIST"
    :is-search-loading="isStoreDiscountHistoryLoading"
    has-reset
  >
    <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  </SearchBar>
  <div class="mb-5 flex w-full justify-end">
    <ButtonExcelDown
      :download-fn="refetchStoreDiscountHistoryExcel"
      :is-loading="isStoreDiscountHistoryExcelLoading"
      :disabled="storeDiscountHistory?.totalElements <= 0"
    />
  </div>
  <TableView
    :column-data="DISCOUNT_HISTORY_TABLE_COLUMNS_LIST"
    :page-data="storeDiscountHistory"
    :show-count="true"
    :is-loading="isStoreDiscountHistoryLoading"
    :is-error="isStoreDiscountHistoryError"
    :error="storeDiscountHistoryError"
  />
</template>
