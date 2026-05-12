<script setup>
  import ButtonExcelDown from '@components/common/ButtonExcelDown.vue';
  import FilterDateMonth from '@components/common/FilterDateMonth.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';

  import {
    ADMIN_PARKING_MILEAGE_HOUSE_TABLE_COLUMNS_LIST,
    ADMIN_PARKING_MILEAGE_SEARCH_INPUT_LIST,
    PARKING_MILEAGE_FILTER_HOURS,
  } from '@/constants/parking.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetMileageExcel from '@/lib/queries/parkingMileage/useGetMileageExcel.js';
  import useGetMileageList from '@/lib/queries/parkingMileage/useGetMileageList.js';

  const { navigateTo } = useNavigate();
  const { updateParam, removeParam } = useQueryString();

  const {
    householdMileageList,
    isHouseholdMileageListLoading,
    isHouseholdMileageListError,
    householdMileageListError,
  } = useGetMileageList();

  const { refetchMileageExcel, isMileageExcelLoading } = useGetMileageExcel();

  const renderFieldValue = (key, value) => {
    if (value === undefined || value === null) return '-';

    if (key === 'useMileageHourText') {
      return value === '0시간 0분' ? '0분' : value;
    }

    if (key === 'billingAmount') {
      return `${value.toLocaleString() || 0}원`;
    }

    return value || '-';
  };

  const moveMileageDetail = (row) => {
    navigateTo({
      path: `/parking/mileage/detail/${row.uuid}`,
      state: { dong: row.dong, ho: row.ho },
    });
  };

  const selectFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([PARKING_MILEAGE_FILTER_HOURS.filterKey]);
    } else {
      updateParam({ [PARKING_MILEAGE_FILTER_HOURS.filterKey]: value });
    }
  };
</script>

<template>
  <div class="flex flex-col">
    <PageTitleBase
      title="마일리지 사용내역"
      paragraph="세대별 마일리지 사용내역을 관리합니다."
    />
    <SearchBar
      :search-input="ADMIN_PARKING_MILEAGE_SEARCH_INPUT_LIST"
      has-reset
      :is-search-loading="isHouseholdMileageListLoading"
    >
      <FilterDateMonth :month-count="2" />
      <FilterRadioGroup
        :filter="PARKING_MILEAGE_FILTER_HOURS"
        @select="selectFilter"
      />
    </SearchBar>
    <div class="mb-5 flex w-full justify-end">
      <ButtonExcelDown
        :download-fn="refetchMileageExcel"
        :is-loading="isMileageExcelLoading"
        :disabled="householdMileageList?.totalElements <= 0"
      />
    </div>
    <TableView
      :column-data="ADMIN_PARKING_MILEAGE_HOUSE_TABLE_COLUMNS_LIST"
      :page-data="householdMileageList"
      :selectable="false"
      :row-function="moveMileageDetail"
      :show-count="true"
      :is-loading="isHouseholdMileageListLoading"
      :is-error="isHouseholdMileageListError"
      :error="householdMileageListError"
    >
      <template #default="{ row, column }">
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </TableView>
  </div>
</template>
