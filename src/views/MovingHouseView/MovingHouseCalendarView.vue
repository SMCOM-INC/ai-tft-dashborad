<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import MovingHouseCalendar from '@views/MovingHouseView/MovingHouseCalendar.vue';
  import MovingHouseCalendarDayListModal from '@views/MovingHouseView/MovingHouseCalendarDayListModal.vue';
  import MovingHouseCreateModal from '@views/MovingHouseView/MovingHouseCreateModal.vue';
  import MovingHouseDetailModal from '@views/MovingHouseView/MovingHouseDetailModal.vue';
  import { computed } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';

  const { getQueryString, navigateTo, removeQueryParams } = useNavigate();
  const queryParams = computed(() => getQueryString());

  // 캘린더 날짜 클릭 - 예약현황 리스트 모달 열기
  const handleDayClick = ({ day }) => {
    navigateTo({
      path: '/movingHouse/calendar',
      query: {
        ...queryParams.value,
        date: formatDateObject(day, 'hyphen'),
      },
    });
  };

  // 예약 선택 - 접수내역 상세 모달 열기
  const handleReservationItemClick = (item) => {
    navigateTo({
      path: '/movingHouse/calendar',
      query: {
        ...queryParams.value,
        detailUuid: item.uuid,
      },
    });
  };

  // 예약현황 리스트 모달 닫기
  const handleDayListModalClose = () => {
    navigateTo({
      path: '/movingHouse/calendar',
    });
  };

  // 예약상세 모달 닫기

  const handleDetailModalClose = () => {
    navigateTo({
      path: '/movingHouse/calendar',
      query: removeQueryParams('detailUuid'),
    });
  };
</script>

<template>
  <div class="mb-8 flex items-end justify-between">
    <PageTitleBase
      title="이사 스케쥴"
      paragraph="확정된 이사 예약의 스케줄을 확인합니다."
      class="mb-0"
    />
    <MovingHouseCreateModal />
  </div>

  <MovingHouseCalendar :on-date-click="handleDayClick" />

  <MovingHouseCalendarDayListModal
    v-if="!!queryParams.date"
    @click-item="handleReservationItemClick"
    @close="handleDayListModalClose"
  />

  <MovingHouseDetailModal
    v-if="!!queryParams.date && !!queryParams.detailUuid"
    @close="handleDetailModalClose"
  />
</template>
