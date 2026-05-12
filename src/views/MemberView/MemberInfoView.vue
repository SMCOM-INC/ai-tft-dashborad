<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import ChipApprovalState from '@components/common/ChipApprovalState.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';

  import {
    ADMIN_MEMBER_MEMBERINFO_HOUSE_TABLE_COLUMNS_LIST,
    ADMIN_MEMBER_MEMBERINFO_SEARCH_HOUSE_INPUT_LIST,
    FILTER_APPROVAL_STATE,
  } from '@/constants/member.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetResidentList from '@/lib/queries/member/useGetResidentList.js';
  import useGetResidentListExcel from '@/lib/queries/member/useGetResidentListExcel.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const { hasDetailPage, navigateTo } = useNavigate();
  const { updateParam, removeParam } = useQueryString();

  const { residentList, isResidentListLoading, isError, error } =
    useGetResidentList();

  const { isResidentListExcelLoading, refetchResidentListExcel } =
    useGetResidentListExcel();

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'createdDate') {
      return formatDate(value).date();
    }

    if (key === 'loginCount') {
      return `${value || 0}개`;
    }

    if (key === 'type') {
      return value === 'HEAD' ? '세대주' : '세대원';
    }

    return value || '-';
  };

  const handleRowClick = (row) => {
    navigateTo(`/member/member-info/detail/${row.uuid}`);
  };

  const selectFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([FILTER_APPROVAL_STATE.filterKey]);
    } else {
      updateParam({ [FILTER_APPROVAL_STATE.filterKey]: value });
    }
  };
</script>

<template>
  <div class="flex flex-col">
    <div v-if="!hasDetailPage">
      <PageTitleBase
        title="등록 회원 정보"
        paragraph="세대별 등록된 회원 정보를 관리합니다."
      />
    </div>
    <SearchBar
      :search-input="ADMIN_MEMBER_MEMBERINFO_SEARCH_HOUSE_INPUT_LIST"
      has-reset
      :is-search-loading="isResidentListLoading"
    >
      <FilterRadioGroup
        :filter="FILTER_APPROVAL_STATE"
        @select="selectFilter"
      />
    </SearchBar>
    <div class="mb-5 flex w-full justify-end">
      <ButtonExcelDown
        :download-fn="refetchResidentListExcel"
        :is-loading="isResidentListExcelLoading"
        :disabled="residentList?.totalElements <= 0"
      />
    </div>
    <TableView
      :column-data="ADMIN_MEMBER_MEMBERINFO_HOUSE_TABLE_COLUMNS_LIST"
      :page-data="residentList"
      show-count
      :row-function="handleRowClick"
      :is-loading="isResidentListLoading"
      :is-error="isError"
      :error="error"
    >
      <template #default="{ row, column }">
        <ChipApprovalState
          v-if="column?.key === 'state'"
          :state="row?.state"
          class="border-green-"
        />
        <template v-else>
          {{ renderFieldValue(column.key, row[column.key]) }}
        </template>
      </template>
    </TableView>
  </div>
</template>
