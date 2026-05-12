<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import InOutHistoryCreateModal from '@views/ParkingView/InOutHistory/InOutHistoryCreateModal.vue';
  import InOutHistoryDeletionManager from '@views/ParkingView/InOutHistory/InOutHistoryDeletionManager.vue';
  import InOutHistoryDongHoEditModal from '@views/ParkingView/InOutHistory/InOutHistoryDongHoEditModal.vue';
  import InOutHistoryFilters from '@views/ParkingView/InOutHistory/InOutHistoryFilters.vue';
  import { ref } from 'vue';

  import {
    ADMIN_PARKING_IN_OUT_HISTORY_SEARCH_INPUT_LIST,
    ADMIN_PARKING_IN_OUT_HISTORY_TABLE_COLUMNS_LIST,
  } from '@/constants/parking.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetInOutHistoryList from '@/lib/queries/parkingInoutHistory/useGetInOutHistoryList.js';
  import useGetInOutHistoryListExcel from '@/lib/queries/parkingInoutHistory/useGetInOutHistoryListExcel.js';
  import findCarType from '@/lib/utils/findCarType.js';
  import findRegistType from '@/lib/utils/findRegistType.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';

  const { navigateTo } = useNavigate();

  const {
    inOutHistoryList,
    isInOutHistoryListLoading,
    isInOutHistoryListFetching,
    isInOutHistoryListError,
    inOutHistoryListError,
  } = useGetInOutHistoryList();

  const { isInOutHistoryListExcelLoading, refetchInOutHistoryListExcel } =
    useGetInOutHistoryListExcel();

  const modalType = ref(null);
  const selectedRow = ref(null);
  const selectedRows = ref([]);
  const deletionManagerRef = ref(null);

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'inParkingTime' || key === 'outParkingTime') {
      return formatDate(value).full();
    }

    if (key === 'parkingMinutes') {
      return formatMinutes(value);
    }

    if (key === 'registType') {
      return findRegistType(value);
    }

    if (key === 'carType') {
      return findCarType(value);
    }

    return value || '-';
  };

  const clickRow = (row) => {
    navigateTo(`/parking/inout-history/detail/${row.uuid}`);
  };

  // 동호수 수정 모달 열기
  const openDongHoEditModal = (row) => {
    selectedRow.value = row;
    modalType.value = 'dongHo';
  };

  // 삭제 버튼 클릭 처리
  const handleDeletionButton = (selectedItems) => {
    selectedRows.value = selectedItems.selectedRows;

    // 삭제 관리자에게 삭제 시작 요청
    deletionManagerRef.value?.startDeletion();
  };

  // 모달 닫기
  const closeModal = () => {
    modalType.value = null;
    selectedRow.value = null;
  };
</script>

<template>
  <div class="flex justify-between">
    <PageTitleBase
      title="입출차 내역"
      paragraph="단지의 입출차 내역을 관리합니다. 최대 3개월까지 조회 가능합니다."
    />
    <InOutHistoryCreateModal />
  </div>
  <SearchBar
    :search-input="ADMIN_PARKING_IN_OUT_HISTORY_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isInOutHistoryListLoading"
  >
    <InOutHistoryFilters />
  </SearchBar>
  <div class="mb-5 flex w-full justify-end">
    <ButtonExcelDown
      :download-fn="refetchInOutHistoryListExcel"
      :is-loading="isInOutHistoryListExcelLoading"
      :disabled="inOutHistoryList?.totalElements <= 0"
    />
  </div>
  <TableView
    :column-data="ADMIN_PARKING_IN_OUT_HISTORY_TABLE_COLUMNS_LIST"
    :page-data="inOutHistoryList"
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
    :row-function="clickRow"
    :is-loading="isInOutHistoryListLoading || isInOutHistoryListFetching"
    :is-error="isInOutHistoryListError"
    :error="inOutHistoryListError"
    @bulk-action="handleDeletionButton"
  >
    <template #default="{ row, column }">
      <template v-if="column.key === 'edit'">
        <button
          v-if="row.editFlag"
          type="button"
          class="rounded-[4px] border border-defaults-primary-border-primary px-2.5 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
          @click.stop="openDongHoEditModal(row)"
        >
          동호수 수정
        </button>
        <span v-else></span>
      </template>
      <template v-else>
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </template>
  </TableView>

  <!-- 삭제 관리 -->
  <InOutHistoryDeletionManager
    ref="deletionManagerRef"
    :selected-rows="selectedRows"
  />

  <!-- 동호수 수정 모달 -->
  <InOutHistoryDongHoEditModal
    v-if="modalType === 'dongHo' && selectedRow"
    :detail="selectedRow"
    @close="closeModal"
  />
</template>
