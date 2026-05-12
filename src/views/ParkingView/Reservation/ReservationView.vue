<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import ReservationCreateModal from '@views/ParkingView/Reservation/ReservationCreateModal.vue';
  import ReservationDeleteModal from '@views/ParkingView/Reservation/ReservationDeleteModal.vue';
  import { ref } from 'vue';

  import {
    ADMIN_PARKING_RESERVATION_SEARCH_INPUT_LIST,
    ADMIN_PARKING_RESERVATION_TABLE_COLUMNS_LIST,
    FILTER_INPARKING_FLAG,
  } from '@/constants/parking.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useQueryString from '@/lib/composables/common/useQueryString.js';
  import useGetReservationList from '@/lib/queries/parkingReservation/useGetReservationList.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const { updateParam, removeParam } = useQueryString();
  const { dateRange, resetDateRange } = useDateRangeRouteSync('thisMonth');

  const modalType = ref('');
  const selectedTableRowRef = ref([]);

  const {
    reservationList,
    isReservationListLoading,
    isReservationListError,
    reservationListError,
  } = useGetReservationList();

  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'inParkingScheduledDate' || key === 'outParkingScheduledDate') {
      return formatDate(value).date();
    }

    if (key === 'createdDate') {
      return formatDate(value).full();
    }

    return value || '-';
  };

  const closeModal = () => {
    modalType.value = null;
  };

  // 방문예약 예약모달 열기
  const openReservationCreateModal = () => {
    modalType.value = 'creation';
  };

  // 방문예약 삭제버튼 클릭
  const handleDeletionButton = (selectedItems) => {
    selectedTableRowRef.value = selectedItems;
    modalType.value = 'deletion';
  };

  const selectFilter = (value) => {
    // 첫 번째 옵션인 경우 URL에서 제거 (기본값이므로)
    const isDefaultValue = value === 'ALL';

    if (isDefaultValue) {
      removeParam([FILTER_INPARKING_FLAG.filterKey]);
    } else {
      updateParam({ [FILTER_INPARKING_FLAG.filterKey]: value });
    }
  };
</script>

<template>
  <div class="flex items-center justify-between">
    <PageTitleBase
      title="방문 예약"
      paragraph="세대별 방문 예약 차량을 관리합니다."
    />
    <ButtonBase
      type="button"
      color="primary"
      size="md"
      @click="openReservationCreateModal"
    >
      세대 방문 차량 예약
    </ButtonBase>
  </div>
  <SearchBar
    :search-input="ADMIN_PARKING_RESERVATION_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isReservationListLoading"
    class="mb-7"
  >
    <DateRangePicker
      v-model="dateRange"
      :max-date="null"
      @reset="resetDateRange"
    />
    <FilterRadioGroup :filter="FILTER_INPARKING_FLAG" @select="selectFilter" />
  </SearchBar>
  <TableView
    :column-data="ADMIN_PARKING_RESERVATION_TABLE_COLUMNS_LIST"
    :page-data="reservationList"
    selectable
    :bulk-action-flag="true"
    :bulk-action-buttons="[
      {
        text: '선택 삭제',
        color: 'red',
        disabled: false,
        action: 'delete',
      },
    ]"
    :is-loading="isReservationListLoading"
    :is-error="isReservationListError"
    :error="reservationListError"
    @bulk-action="handleDeletionButton"
  >
    <template #default="{ row, column }">
      <template v-if="column?.key === 'inParkingFlag'">
        <ChipBase
          v-if="row?.[column?.key]"
          color="blue-100"
          variant="outline"
          class="w-12"
          >입차</ChipBase
        >
        <ChipBase
          v-if="!row?.[column?.key]"
          color="gray-20"
          variant="outline"
          class="w-12"
          >미입차</ChipBase
        >
      </template>
      <template v-else>
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </template>
  </TableView>
  <!-- 방문예약 예약 모달 -->
  <ReservationCreateModal v-if="modalType === 'creation'" @close="closeModal" />
  <!-- 방문예약 삭제 모달 -->
  <ReservationDeleteModal
    v-if="modalType === 'deletion'"
    :data="selectedTableRowRef"
    @close="closeModal"
  />
</template>
