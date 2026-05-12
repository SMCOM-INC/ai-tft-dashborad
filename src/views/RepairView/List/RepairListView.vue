<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import FilterDateMonth from '@components/common/FilterDateMonth.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import RepairDetailModal from '@views/RepairView/Detail/RepairDetailModal.vue';
  import RepairCreateModal from '@views/RepairView/RepairCreateModal.vue';
  import RepairStatusChip from '@views/RepairView/RepairStatusChip.vue';
  import { ref } from 'vue';

  import {
    REPAIR_FILTER_RECEIPT_STATE,
    REPAIR_SEARCH_INPUT_LIST,
    REPAIR_TABLE_COLUMNS_LIST,
  } from '@/constants/repair.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetRepairList from '@/lib/queries/repair/useGetRepairList.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const modalType = ref(null);
  const selectedRowUuid = ref(null);

  const { updateParam, removeParam } = useQueryString();

  const {
    repairList,
    isRepairListLoading,
    isRepairListError,
    repairListError,
  } = useGetRepairList();

  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'createdDate' || key === 'visitDateTime') {
      return formatDate(value).full();
    }

    return value || '-';
  };

  const createRepair = () => {
    modalType.value = 'create';
  };

  const openRepairDetailModal = (row) => {
    selectedRowUuid.value = row.uuid;
    modalType.value = 'detail';
  };

  const closeModal = () => {
    modalType.value = null;
    selectedRowUuid.value = null;
  };

  const selectFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([REPAIR_FILTER_RECEIPT_STATE.filterKey]);
    } else {
      updateParam({ [REPAIR_FILTER_RECEIPT_STATE.filterKey]: value });
    }
  };
</script>

<template>
  <div class="flex items-start justify-between">
    <PageTitleBase
      title="하자보수 관리"
      paragraph="세대의 하자보수 접수 건을 관리합니다."
    />
    <ButtonBase type="button" color="primary" size="md" @click="createRepair">
      하자보수 접수
    </ButtonBase>
  </div>
  <SearchBar
    :search-input="REPAIR_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isRepairListLoading"
    class="mb-4"
  >
    <FilterDateMonth filter-name="접수일시" has-all has-year />
    <FilterDateMonth
      filter-name="방문예정일시"
      has-all
      has-year
      start-key="visitStartDate"
      end-key="visitEndDate"
    />
    <FilterRadioGroup
      :filter="REPAIR_FILTER_RECEIPT_STATE"
      @select="selectFilter"
    />
  </SearchBar>
  <TableView
    show-count
    :column-data="REPAIR_TABLE_COLUMNS_LIST"
    :page-data="repairList"
    :row-function="openRepairDetailModal"
    :is-loading="isRepairListLoading"
    :is-error="isRepairListError"
    :error="repairListError"
  >
    <template #default="{ row, column }">
      <template v-if="column?.type === 'repairStatus'">
        <RepairStatusChip :state="row?.state" />
      </template>
      <template v-else>
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </template>
  </TableView>
  <RepairDetailModal
    v-if="modalType === 'detail'"
    :detail-uuid="selectedRowUuid"
    @close-modal="closeModal"
  />
  <RepairCreateModal v-if="modalType === 'create'" @close="closeModal" />
</template>
