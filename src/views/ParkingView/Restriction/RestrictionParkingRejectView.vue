<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import { ref } from 'vue';

  import {
    ADMIN_PARKING_RESTRICTIONS_REJECT_SEARCH_INPUT_LIST,
    ADMIN_PARKING_RESTRICTIONS_REJECT_TABLE_COLUMNS_LIST,
  } from '@/constants/parking.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteReject from '@/lib/queries/parkingBlacklistReject/useDeleteReject.js';
  import useGetRejectList from '@/lib/queries/parkingBlacklistReject/useGetRejectList.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const { navigateTo } = useNavigate();
  const { dateRange, resetDateRange } = useDateRangeRouteSync();

  const modalParagraphRef = ref(null);
  const selectedItemsRef = ref([]);
  const bulkActionButtonRef = ref([
    {
      text: '선택 삭제',
      color: 'red',
      disabled: false,
      action: 'delete',
    },
  ]);

  const {
    rejectCarList,
    isRejectCarListLoading,
    isRejectCarListError,
    rejectCarListError,
  } = useGetRejectList();

  const { deleteRejectMutationAsync, isDeleteRejectPending } =
    useDeleteReject();

  const renderFieldValue = (key, value, row) => {
    if (value === undefined || value === null) return '-';

    if (key === 'createdDate') {
      return formatDate(value).full();
    }

    if (key === 'releaseRequest' && value) {
      if (row?.state === 'REJECT') {
        return '요청반려';
      }

      if (!row?.state) {
        return '해제요청';
      }
    }

    return value || '-';
  };

  const clickRow = (row) => {
    navigateTo(`/parking/restriction/parking-reject/detail/${row.rejectUuid}`);
  };

  const handleBulkAction = (selectedItems) => {
    selectedItemsRef.value = selectedItems;

    modalParagraphRef.value.handleOpenModal();
  };

  const deleteReject = async () => {
    if (selectedItemsRef.value.selectedRows.length <= 0) {
      return;
    }

    const rejectUuidList = selectedItemsRef.value.selectedRows.map(
      (item) => item.rejectUuid,
    );

    await deleteRejectMutationAsync({ rejectUuidList });

    modalParagraphRef.value.closeModal();
  };
</script>

<template>
  <SearchBar
    :search-input="ADMIN_PARKING_RESTRICTIONS_REJECT_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isRejectCarListLoading"
    class="mb-7"
  >
    <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  </SearchBar>
  <TableView
    :column-data="ADMIN_PARKING_RESTRICTIONS_REJECT_TABLE_COLUMNS_LIST"
    :page-data="rejectCarList"
    :show-count="true"
    selectable
    :bulk-action-flag="true"
    :bulk-action-buttons="bulkActionButtonRef"
    :row-function="clickRow"
    :is-loading="isRejectCarListLoading"
    :is-error="isRejectCarListError"
    :error="rejectCarListError"
    @bulk-action="handleBulkAction"
  >
    <template #default="{ row, column }">
      {{ renderFieldValue(column.key, row[column.key], row) }}
    </template>
  </TableView>
  <ModalParagraph
    ref="modalParagraphRef"
    trigger-button-name="거부 차량 삭제"
    title="선택한 거부차량을 삭제 하시겠습니까?"
    paragraph="삭제 이후에는 복구할 수 없습니다."
    color="red"
    close-button-name="삭제 처리"
    hide-button
    :is-loading="isDeleteRejectPending"
    @confirm="deleteReject"
  />
</template>
