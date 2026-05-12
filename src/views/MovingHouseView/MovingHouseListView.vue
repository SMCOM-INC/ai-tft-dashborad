<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TableView from '@components/common/TableView.vue';
  // TODO : 서버 값에 따라 chip 컴포넌트 네이밍 변경 필요
  import MovingHouseCreateModal from '@views/MovingHouseView/MovingHouseCreateModal.vue';
  import MovingHouseDetailModal from '@views/MovingHouseView/MovingHouseDetailModal.vue';
  import RepairStatusChip from '@views/RepairView/RepairStatusChip.vue';
  import { ref } from 'vue';

  import { MOVING_HOUSE_TABLE_COLUMNS_LIST } from '@/constants/movingHouse.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import { ADMIN_MOVING_HOUSE_TABLE_LIST } from '@/mocks/data/movingHouse.js';

  const detailUuid = ref({});
  const houseMovingDetailModalRef = ref(false);

  const handleRowClick = (row) => {
    // row.uuid 로 상세정보 불러오기 요청 예정
    // 임시로 row data 할당
    detailUuid.value = row;
    houseMovingDetailModalRef.value = true;
  };

  const handleModalClose = () => {
    houseMovingDetailModalRef.value = false;
  };
</script>

<template>
  <div class="flex justify-between">
    <PageTitleBase
      title="이사예약 접수내역"
      paragraph="세대의 이사 예약 접수 내역을 관리합니다."
    />
    <MovingHouseCreateModal />
  </div>

  <TableView
    :column-data="MOVING_HOUSE_TABLE_COLUMNS_LIST"
    :page-data="ADMIN_MOVING_HOUSE_TABLE_LIST"
    :row-function="handleRowClick"
    :is-loading="false"
    :is-error="false"
    :error="undefined"
  >
    <template #default="{ row, column }">
      <template v-if="column?.key === 'createdDate'">
        {{ formatDate(row?.createdDate).full() }}
      </template>
      <template v-if="column?.key === 'movingDate'">
        {{ formatDate(row?.movingDate).date() }}
      </template>
      <template v-if="column?.key === 'status'">
        <RepairStatusChip :status="row?.status" />
      </template>
    </template>
  </TableView>
  <MovingHouseDetailModal
    v-if="houseMovingDetailModalRef"
    :detail-uuid="detailUuid"
    @close="handleModalClose"
  />
</template>
