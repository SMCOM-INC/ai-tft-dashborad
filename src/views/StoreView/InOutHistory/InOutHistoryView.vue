<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import { computed } from 'vue';

  import {
    IN_OUT_HISTORY_FILTER,
    IN_OUT_HISTORY_SEARCH_INPUT_LIST,
    IN_OUT_HISTORY_TABLE_COLUMNS_LIST,
  } from '@/constants/store.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetStoreInOutHistory from '@/lib/queries/store/useGetStoreInOutHistory.js';
  import useGetStoreInOutHistoryExcel from '@/lib/queries/store/useGetStoreInOutHistoryExcel.js';

  const { navigateTo } = useNavigate();
  const { updateParam, removeParam } = useQueryString();
  const { dateRange, resetDateRange } = useDateRangeRouteSync('thisMonth');

  const {
    storeInOutHistory,
    isStoreInOutHistoryLoading,
    isStoreInOutHistoryError,
    storeInOutHistoryError,
  } = useGetStoreInOutHistory();

  const { isStoreInOutHistoryExcelLoading, refetchStoreInOutHistoryExcel } =
    useGetStoreInOutHistoryExcel();

  const minDate = computed(() => {
    const date = new Date();
    date.setDate(1); // 해당 월의 1일로 설정
    date.setMonth(date.getMonth() - 2); // 2개월 전

    return date;
  });

  const handleRowClick = (row) => {
    navigateTo(`/store/inout-history/detail/${row.uuid}`);
  };

  const selectFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([IN_OUT_HISTORY_FILTER.filterKey]);
    } else {
      updateParam({ [IN_OUT_HISTORY_FILTER.filterKey]: value });
    }
  };
</script>

<template>
  <div class="flex justify-between">
    <PageTitleBase
      title="입출차 내역"
      paragraph="상가의 입출차 내역을 관리합니다. 최대 3개월까지 조회 가능합니다."
    />
  </div>
  <SearchBar
    :search-input="IN_OUT_HISTORY_SEARCH_INPUT_LIST"
    :is-search-loading="isStoreInOutHistoryLoading"
    has-reset
  >
    <DateRangePicker
      v-model="dateRange"
      :min-date="minDate"
      @reset="resetDateRange"
    />
    <FilterRadioGroup :filter="IN_OUT_HISTORY_FILTER" @select="selectFilter" />
  </SearchBar>
  <div class="mb-5 flex w-full justify-end">
    <ButtonExcelDown
      :download-fn="refetchStoreInOutHistoryExcel"
      :is-loading="isStoreInOutHistoryExcelLoading"
      :disabled="storeInOutHistory?.totalElements <= 0"
    />
  </div>
  <TableView
    :column-data="IN_OUT_HISTORY_TABLE_COLUMNS_LIST"
    :page-data="storeInOutHistory"
    :show-count="true"
    :row-function="handleRowClick"
    :is-loading="isStoreInOutHistoryLoading"
    :is-error="isStoreInOutHistoryError"
    :error="storeInOutHistoryError"
  >
    <template #default="{ row, column }">
      <div v-if="column.key === 'settlementFlag'">
        <div v-if="row[column.key]" class="flex items-center gap-2">
          <span
            class="h-3 w-3 rounded-full bg-alerts-success-background-success"
          />
          <span>정상</span>
        </div>
        <div v-else class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-alerts-error-text-error" />
          <span class="text-alerts-error-text-error">초과 주차</span>
        </div>
      </div>
    </template>
  </TableView>
</template>
