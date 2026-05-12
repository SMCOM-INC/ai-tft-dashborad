<script setup>
  import IconPlusLineWhite from '@assets/icons/icon-plus-line-white.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';

  import {
    MANAGEMENT_SEARCH_INPUT_LIST,
    MANAGEMENT_TABLE_COLUMNS_LIST_POSTPAID,
    MANAGEMENT_TABLE_COLUMNS_LIST_PREPAID,
    SETTING_CHARGE_TYPE,
  } from '@/constants/store.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetStoreList from '@/lib/queries/store/useGetStoreList.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { navigateTo } = useNavigate();
  const userInfoStore = useUserInfoStore();

  const { storeList, isStoreListLoading, isStoreListError, storeListError } =
    useGetStoreList();

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'storeName') {
      return decodeUrl(value);
    }

    if (key === 'representativePhone') {
      return formatContact(value);
    }

    if (key === 'chargedParkingDiscountMinute') {
      return formatMinutes(value);
    }

    return value || '-';
  };

  // 상가등록페이지로 이동
  const moveStoreAddPage = () => {
    navigateTo('/store/management/add');
  };

  const handleRowClick = (data) => {
    navigateTo(`/store/management/detail/${data.uuid}`);
  };
</script>

<template>
  <div class="flex items-start justify-between">
    <PageTitleBase title="상가 관리" paragraph="상가별 계정을 관리합니다." />
    <ButtonBase
      type="submit"
      color="primary"
      size="md"
      class="j flex items-center gap-2"
      @click="moveStoreAddPage"
    >
      <IconPlusLineWhite />
      상가 등록
    </ButtonBase>
  </div>
  <SearchBar
    :search-input="MANAGEMENT_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="false"
    class="mb-7"
  />
  <TableView
    :column-data="
      userInfoStore.userInfo.billingType === SETTING_CHARGE_TYPE.PREPAID
        ? MANAGEMENT_TABLE_COLUMNS_LIST_PREPAID
        : MANAGEMENT_TABLE_COLUMNS_LIST_POSTPAID
    "
    :page-data="storeList"
    :show-count="true"
    :row-function="handleRowClick"
    :is-loading="isStoreListLoading"
    :is-error="isStoreListError"
    :error="storeListError"
  >
    <template #default="{ row, column }">
      {{ renderFieldValue(column.key, row[column.key]) }}
    </template>
  </TableView>
</template>
