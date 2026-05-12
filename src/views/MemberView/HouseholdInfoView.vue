<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';

  import {
    ADMIN_MEMBER_HOUSEHOLD_INFO_HOUSE_TABLE_COLUMNS_LIST,
    ADMIN_MEMBER_HOUSEHOLD_INFO_SEARCH_HOUSE_INPUT_LIST,
  } from '@/constants/member.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetHouseholdList from '@/lib/queries/member/useGetHouseholdList.js';

  const { hasDetailPage, navigateTo } = useNavigate();

  const { householdList, isHouseholdListLoading, isError, error } =
    useGetHouseholdList();

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (key === 'householdResidentCount') {
      return `${value || 0}명`;
    }

    if (!value) return '-';

    return value || '-';
  };

  const handleRowClick = (row) => {
    navigateTo(`/member/household-info/detail/${row.uuid}`);
  };
</script>

<template>
  <div class="flex flex-col">
    <div v-if="!hasDetailPage">
      <PageTitleBase
        title="세대 정보"
        paragraph="각 세대별 정보를 관리합니다."
      />
    </div>
    <SearchBar
      :search-input="ADMIN_MEMBER_HOUSEHOLD_INFO_SEARCH_HOUSE_INPUT_LIST"
      has-reset
      :is-search-loading="isHouseholdListLoading"
      class="mb-7"
    />
    <TableView
      :column-data="ADMIN_MEMBER_HOUSEHOLD_INFO_HOUSE_TABLE_COLUMNS_LIST"
      :page-data="householdList"
      show-count
      :row-function="handleRowClick"
      :is-loading="isHouseholdListLoading"
      :is-error="isError"
      :error="error"
    >
      <template #default="{ row, column }">
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </TableView>
  </div>
</template>
