<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import { ref } from 'vue';

  import {
    ADMIN_PARKING_RESTRICTIONS_BLACKLIST_SEARCH_INPUT_LIST,
    ADMIN_PARKING_RESTRICTIONS_BLACKLIST_TABLE_COLUMNS_LIST,
  } from '@/constants/parking.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useDeleteBlackList from '@/lib/queries/parkingBlacklistReject/useDeleteBlackList.js';
  import useGetBlackListList from '@/lib/queries/parkingBlacklistReject/useGetBlackListList.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const {
    blacklistCarList,
    isBlacklistCarListLoading,
    isBlacklistCarListError,
    blacklistCarListError,
  } = useGetBlackListList();

  const {
    deleteBlackListMutationAsync,
    isDeleteBlackListPending,
    isDeleteBlackListError,
    deleteBlackListError,
  } = useDeleteBlackList();

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

  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'createdDate') {
      return formatDate(value).full();
    }

    return value || '-';
  };

  const handleBulkAction = (selectedItems) => {
    selectedItemsRef.value = selectedItems;

    modalParagraphRef.value.handleOpenModal();
  };

  const deleteBlackList = async () => {
    if (selectedItemsRef.value.selectedRows.length <= 0) {
      return;
    }

    const blacklistUuidList = selectedItemsRef.value.selectedRows.map(
      (item) => item.uuid,
    );

    await deleteBlackListMutationAsync({ blacklistUuidList });
  };
</script>

<template>
  <SearchBar
    :search-input="ADMIN_PARKING_RESTRICTIONS_BLACKLIST_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isBlacklistCarListLoading"
    class="mb-7"
  >
    <DateRangePicker v-model="dateRange" @reset="resetDateRange" />
  </SearchBar>
  <TableView
    :column-data="ADMIN_PARKING_RESTRICTIONS_BLACKLIST_TABLE_COLUMNS_LIST"
    :page-data="blacklistCarList"
    :show-count="true"
    selectable
    :bulk-action-flag="true"
    :bulk-action-buttons="bulkActionButtonRef"
    :is-loading="isBlacklistCarListLoading"
    :is-error="isBlacklistCarListError"
    :error="blacklistCarListError"
    @bulk-action="handleBulkAction"
  >
    <template #default="{ row, column }">
      {{ renderFieldValue(column.key, row[column.key]) }}
    </template>
  </TableView>
  <ModalParagraph
    ref="modalParagraphRef"
    trigger-button-name="블랙리스트 삭제"
    title="블랙리스트를 삭제하시겠습니까?"
    paragraph="삭제 후 복구되지 않습니다."
    color="lightGray"
    close-button-name="블랙리스트 삭제"
    hide-button
    :is-loading="isDeleteBlackListPending"
    :is-error="isDeleteBlackListError"
    :error="deleteBlackListError"
    @confirm="deleteBlackList"
  />
</template>
