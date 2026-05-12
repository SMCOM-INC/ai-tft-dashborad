<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import ChargeHistoryChargeCancelModal from '@views/StoreView/ChargeHistory/ChargeHistoryChargeCancelModal.vue';
  import ChargeHistoryChargeRefundModal from '@views/StoreView/ChargeHistory/ChargeHistoryChargeRefundModal.vue';
  import ChargeHistoryDepositCompleteModal from '@views/StoreView/ChargeHistory/ChargeHistoryDepositCompleteModal.vue';
  import ChargeHistoryStatistics from '@views/StoreView/ChargeHistory/ChargeHistoryStatistics.vue';
  import { ref } from 'vue';

  import {
    CHARGE_HISTORY_SEARCH_INPUT_LIST,
    CHARGE_HISTORY_TABLE_COLUMNS_LIST,
  } from '@/constants/store.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetStoreChargeHistory from '@/lib/queries/store/useGetStoreChargeHistory.js';
  import useGetStoreChargeHistoryExcel from '@/lib/queries/store/useGetStoreChargeHistoryExcel.js';

  const {
    storeChargeHistory,
    isStoreChargeHistoryLoading,
    isStoreChargeHistoryError,
    storeChargeHistoryError,
  } = useGetStoreChargeHistory();

  const { isStoreChargeHistoryExcelLoading, refetchStoreChargeHistoryExcel } =
    useGetStoreChargeHistoryExcel();

  const { dateRange, resetDateRange } = useDateRangeRouteSync('thisMonth');

  const isDepositCompleteModalOpen = ref(false);
  const isChargeCancelModalOpen = ref(false);
  const isChargeRefundModalOpen = ref(false);
  const selectedRowUuid = ref('');

  // 입금 완료 처리 모달 열기
  const completeDeposit = (uuid) => {
    selectedRowUuid.value = uuid;
    isDepositCompleteModalOpen.value = true;
  };

  // 입금 완료 처리 모달 닫기
  const closeDepositCompleteModal = () => {
    isDepositCompleteModalOpen.value = false;
  };

  // 충전 취소 모달 열기
  const cancelCharge = (uuid) => {
    selectedRowUuid.value = uuid;
    isChargeCancelModalOpen.value = true;
  };

  // 충전 취소 모달 닫기
  const closeCancelChargeModal = () => {
    isChargeCancelModalOpen.value = false;
  };

  // 환불 모달 열기
  const refundCharge = (uuid) => {
    selectedRowUuid.value = uuid;
    isChargeRefundModalOpen.value = true;
  };

  // 환불 모달 닫기
  const closeRefundChargeModal = () => {
    isChargeRefundModalOpen.value = false;
  };
</script>

<template>
  <div class="flex justify-between">
    <PageTitleBase
      title="충전 내역"
      paragraph="상가의 충전 내역을 관리합니다."
    />
  </div>
  <SearchBar
    :search-input="CHARGE_HISTORY_SEARCH_INPUT_LIST"
    :is-search-loading="isStoreChargeHistoryLoading"
    has-reset
  >
    <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  </SearchBar>
  <div
    :class="`mb-5 flex w-full items-end  ${storeChargeHistory?.totalElements <= 0 ? 'justify-end' : 'justify-between'}`"
  >
    <ChargeHistoryStatistics v-if="storeChargeHistory?.totalElements > 0" />
    <ButtonExcelDown
      :download-fn="refetchStoreChargeHistoryExcel"
      :is-loading="isStoreChargeHistoryExcelLoading"
      :disabled="storeChargeHistory?.totalElements <= 0"
    />
  </div>
  <TableView
    :column-data="CHARGE_HISTORY_TABLE_COLUMNS_LIST"
    :page-data="storeChargeHistory"
    :show-count="true"
    :is-loading="isStoreChargeHistoryLoading"
    :is-error="isStoreChargeHistoryError"
    :error="storeChargeHistoryError"
  >
    <template #default="{ row, column }">
      <!-- 상태 -->
      <template v-if="column.key === 'chargeState'">
        <div
          v-if="row[column.key] === 'COMPLETED'"
          class="flex items-center gap-2"
        >
          <span
            class="h-3 w-3 rounded-full bg-alerts-success-background-success"
          />
          <span>충전 완료</span>
        </div>
        <div
          v-else-if="row[column.key] === 'REFUNDED'"
          class="flex items-center gap-2"
        >
          <span class="h-3 w-3 rounded-full bg-alerts-error-background-error" />
          <span>환불 완료</span>
        </div>
        <div v-else class="flex items-center gap-2">
          <span
            class="h-3 w-3 rounded-full bg-defaults-tertiary-background-tertiary"
          />
          <span>미입금</span>
        </div>
      </template>
      <!-- 관리 -->
      <template v-else-if="column.key === 'buttons'">
        <!-- 충전완료 상태 -->
        <button
          v-if="row.chargeState === 'COMPLETED'"
          type="button"
          class="rounded-[4px] border border-defaults-primary-border-primary px-2.5 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
          @click.stop="refundCharge(row.uuid)"
        >
          환불 처리
        </button>
        <div
          v-else-if="row.chargeState === 'REFUNDED'"
          class="text-defaults-tertiary-text-tertiary"
        >
          {{ row.refundDateTime.slice(0, -3) }} 환불처리
        </div>
        <!-- 미입금 상태 -->
        <div v-else class="space-x-1">
          <button
            type="button"
            class="rounded-[4px] bg-brand-default-background-brand px-2.5 py-1 text-defaults-primary-text-primary-inverse pretendard-14Medium"
            @click.stop="completeDeposit(row.uuid)"
          >
            입금 완료 처리
          </button>
          <button
            type="button"
            class="rounded-[4px] border border-defaults-primary-border-primary px-2.5 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
            @click.stop="cancelCharge(row.uuid)"
          >
            취소
          </button>
        </div>
      </template>
    </template>
  </TableView>
  <ChargeHistoryDepositCompleteModal
    v-if="isDepositCompleteModalOpen"
    :uuid="selectedRowUuid"
    @close="closeDepositCompleteModal"
  />
  <ChargeHistoryChargeCancelModal
    v-if="isChargeCancelModalOpen"
    :uuid="selectedRowUuid"
    @close="closeCancelChargeModal"
  />
  <ChargeHistoryChargeRefundModal
    v-if="isChargeRefundModalOpen"
    :uuid="selectedRowUuid"
    @close="closeRefundChargeModal"
  />
</template>
