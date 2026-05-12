<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TableView from '@components/common/TableView.vue';
  import RegularEditModal from '@views/ParkingView/Regular/RegularEditModal.vue';
  import { ref, watch } from 'vue';

  import {
    REGULAR_CAR_BUSINESS_SEARCH_INPUT_LIST,
    REGULAR_CAR_BUSINESS_TABLE_COLUMNS_LIST,
  } from '@/constants/parking.js';
  import { useFetchAptBusinessTypeList } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';
  import useDeleteRegular from '@/lib/queries/parkingRegular/useDeleteRegular.js';
  import useGetRegularList from '@/lib/queries/parkingRegular/useGetRegularList.js';
  import useGetRegularListExcel from '@/lib/queries/parkingRegular/useGetRegularListExcel.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const { aptBusinessTypeList, isAptBusinessTypeListLoading } =
    useFetchAptBusinessTypeList();

  const {
    regularList,
    isRegularListLoading,
    isRegularListError,
    regularListError,
  } = useGetRegularList();

  const {
    deleteRegularCarMutationAsync,
    isDeleteRegularCarPending,
    isDeleteRegularCarError,
    deleteRegularCarError,
  } = useDeleteRegular();

  const { isRegularListExcelLoading, refetchRegularListExcel } =
    useGetRegularListExcel();

  const selectedRow = ref(null);
  const isRegularEditModalOpenRef = ref(false);
  const modalParagraphRef = ref(null);
  const selectedItemsRef = ref([]);
  const filterBusinessType = ref({});
  const bulkActionButtonRef = ref([
    {
      text: '선택 삭제',
      color: 'red',
      disabled: false,
      action: 'delete',
    },
  ]);

  const handleBulkAction = (selectedItems) => {
    selectedItemsRef.value = selectedItems;
    modalParagraphRef.value.handleOpenModal();
  };

  const deleteRegular = async () => {
    if (selectedItemsRef.value.selectedRows.length <= 0) {
      return;
    }

    const regularUuidList = selectedItemsRef.value.selectedRows.map(
      (item) => item.uuid,
    );
    await deleteRegularCarMutationAsync(regularUuidList);
  };

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'startDate' || key === 'endDate') {
      return formatDate(value).date();
    }

    if (key === 'createdDate') {
      return formatDate(value).full();
    }

    return value || '-';
  };

  // 수정 모달 열기
  const openEditModal = (row) => {
    selectedRow.value = row;

    isRegularEditModalOpenRef.value = true;
  };

  // 수정 모달 닫기
  const closeEditModal = () => {
    selectedRow.value = null;

    isRegularEditModalOpenRef.value = false;
  };

  watch(
    aptBusinessTypeList,
    (newValue) => {
      if (!newValue) {
        return;
      }

      filterBusinessType.value = {
        filterName: '업무목적',
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
  <SearchBar
    :search-input="REGULAR_CAR_BUSINESS_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isRegularListLoading"
  >
    <div v-if="isAptBusinessTypeListLoading" class="flex items-center">
      <SpinnerCircle color="blue" />
    </div>
    <FilterCheckboxGroup v-else :filter="filterBusinessType" />
  </SearchBar>
  <div class="mb-5 flex w-full justify-end">
    <ButtonExcelDown
      :download-fn="refetchRegularListExcel"
      :is-loading="isRegularListExcelLoading"
      :disabled="regularList?.totalElements <= 0"
    />
  </div>
  <TableView
    :column-data="REGULAR_CAR_BUSINESS_TABLE_COLUMNS_LIST"
    :page-data="regularList"
    selectable
    :bulk-action-flag="true"
    :bulk-action-buttons="bulkActionButtonRef"
    :is-loading="isRegularListLoading"
    :is-error="isRegularListError"
    :error="regularListError"
    @bulk-action="handleBulkAction"
  >
    <template #default="{ row, column }">
      <template v-if="column.key === 'edit'">
        <div>
          <button
            type="button"
            class="rounded-[4px] border border-defaults-primary-border-primary px-2.5 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
            @click.stop="openEditModal(row)"
          >
            수정
          </button>
        </div>
      </template>
      <template v-else>
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </template>
  </TableView>
  <ModalParagraph
    ref="modalParagraphRef"
    trigger-button-name="정기차량 삭제"
    title="선택한 정기차량을 삭제 하시겠습니까?"
    paragraph="삭제 이후에는 복구할 수 없습니다."
    color="red"
    close-button-name="삭제 처리"
    hide-button
    :is-loading="isDeleteRegularCarPending"
    :is-error="isDeleteRegularCarError"
    :error="deleteRegularCarError"
    @confirm="deleteRegular"
  />
  <RegularEditModal
    v-if="isRegularEditModalOpenRef"
    :initial-info="selectedRow"
    @close="closeEditModal"
  />
</template>
