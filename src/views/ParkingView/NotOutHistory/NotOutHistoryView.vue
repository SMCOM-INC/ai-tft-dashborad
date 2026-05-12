<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import NotOutHistoryDeletionManager from '@views/ParkingView/NotOutHistory/NotOutHistoryDeletionManager.vue';
  import NotOutHistoryFilters from '@views/ParkingView/NotOutHistory/NotOutHistoryFilters.vue';
  import NotOutHistoryOutGateModal from '@views/ParkingView/NotOutHistory/NotOutHistoryOutGateModal.vue';
  import { ref } from 'vue';

  import {
    ADMIN_PARKING_OUT_HISTORY_SEARCH_INPUT_LIST,
    ADMIN_PARKING_OUT_HISTORY_TABLE_COLUMNS_LIST,
  } from '@/constants/parking.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetNotOutHistoryList from '@/lib/queries/parkingNotoutHistory/useGetNotOutHistoryList.js';
  import useGetNotOutHistoryListExcel from '@/lib/queries/parkingNotoutHistory/useGetNotOutHistoryListExcel.js';
  import findCarType from '@/lib/utils/findCarType.js';
  import findRegistType from '@/lib/utils/findRegistType.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const { navigateTo } = useNavigate();

  const selectedRows = ref([]);
  const selectedRow = ref([]);
  const deletionManagerRef = ref(null);
  const modalType = ref(null);

  const {
    notOutHistoryList,
    isNotOutHistoryListLoading,
    isNotOutHistoryListFetching,
    isNotOutHistoryListError,
    notOutHistoryListError,
  } = useGetNotOutHistoryList();

  const { isNotOutHistoryListExcelLoading, refetchNotOutHistoryListExcel } =
    useGetNotOutHistoryListExcel();

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'inParkingTime') {
      return formatDate(value).full();
    }

    if (key === 'registType') {
      return findRegistType(value);
    }

    if (key === 'carType') {
      return findCarType(value);
    }

    return value || '-';
  };

  // 행 클릭 처리
  const handleRowClick = (row) => {
    navigateTo(`/parking/notout-history/detail/${row.uuid}`);
  };

  // 출차생성 모달 열기
  const openOutGateModal = (row) => {
    selectedRow.value = row;
    modalType.value = 'createOut';
  };

  // 모달 닫기
  const closeModal = () => {
    modalType.value = null;
  };

  // 삭제 버튼 클릭 처리
  const handleDeletionButton = (selectedItems) => {
    selectedRows.value = selectedItems.selectedRows;

    // 삭제 관리자에게 삭제 시작 요청
    deletionManagerRef.value?.startDeletion();
  };
</script>

<template>
  <div class="flex justify-between">
    <PageTitleBase
      title="미출차 내역"
      paragraph="단지의 미출차 내역을 관리합니다. 최대 3개월까지 조회 가능합니다."
    />
  </div>

  <SearchBar
    :search-input="ADMIN_PARKING_OUT_HISTORY_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isNotOutHistoryListLoading"
    class="mb-7"
  >
    <NotOutHistoryFilters />
  </SearchBar>
  <div class="mb-5 flex w-full justify-end">
    <ButtonExcelDown
      :download-fn="refetchNotOutHistoryListExcel"
      :is-loading="isNotOutHistoryListExcelLoading"
      :disabled="notOutHistoryList?.totalElements <= 0"
    />
  </div>
  <TableView
    :column-data="ADMIN_PARKING_OUT_HISTORY_TABLE_COLUMNS_LIST"
    :page-data="notOutHistoryList"
    selectable
    bulk-action-flag
    :bulk-action-buttons="[
      {
        text: '선택 삭제',
        color: 'red',
        disabled: false,
        action: 'delete',
      },
    ]"
    show-count
    :row-function="handleRowClick"
    :is-loading="isNotOutHistoryListLoading || isNotOutHistoryListFetching"
    :is-error="isNotOutHistoryListError"
    :error="notOutHistoryListError"
    @bulk-action="handleDeletionButton"
  >
    <template #default="{ row, column }">
      <template v-if="column.key === 'edit'">
        <button
          type="button"
          class="rounded-[4px] border border-defaults-primary-border-primary px-2.5 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
          @click.stop="openOutGateModal(row)"
        >
          출차 생성
        </button>
      </template>
      <template v-else>{{
        renderFieldValue(column.key, row[column.key])
      }}</template>
    </template>
  </TableView>

  <!-- 삭제 관리 -->
  <NotOutHistoryDeletionManager
    ref="deletionManagerRef"
    :selected-rows="selectedRows"
  />

  <!-- 출차 생성 모달 -->
  <NotOutHistoryOutGateModal
    v-if="modalType === 'createOut'"
    :detail="selectedRow"
    @close="closeModal"
  />
</template>
