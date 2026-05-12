<script setup>
  import { computed, ref } from 'vue';
  import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';

  import { useFetchMoveHouseReservationMonth } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const props = defineProps({
    // 날짜 클릭 시 콜백 함수
    onDateClick: {
      type: Function,
      required: false,
      default: () => {},
    },
  });

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  // 현재 표시 중인 날짜 (반응형 상태)
  const showDate = ref(new Date());

  // yearMonth 형식: "2025-01"
  const yearMonth = computed(() => {
    const year = showDate.value.getFullYear();
    const month = String(showDate.value.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  // 이사 예약 월별 조회
  const { moveHouseReservationMonth } = useFetchMoveHouseReservationMonth(
    aptUuid,
    yearMonth,
  );

  // CalendarViewHeader의 이전/다음 버튼 클릭 시 호출
  const setShowDate = (date) => {
    showDate.value = date;
  };

  // status에 따른 CSS 클래스 반환
  const getStatusClass = (status) => {
    if (status === 'CANCELED') return 'cancelled'; // API는 CANCELED
    if (status === 'WAITING') return 'pending'; // API는 WAITING
    return 'confirmed'; // CONFIRMED 또는 기본값
  };

  // moveType 한글 변환
  const getMoveTypeLabel = (type) => {
    if (type === 'MOVE_IN') return '전입';
    if (type === 'MOVE_OUT') return '전출';
    return type;
  };

  // 자정(00:00:00) 보정 (라이브러리가 자정을 종일 이벤트로 인식하여 시간 숨김 방지)
  // startDate용: 00:00:01로 변경
  const adjustMidnightStart = (dateTimeStr) => {
    return dateTimeStr.replace('T00:00:00', 'T00:00:01');
  };
  // endDate용: 00:00:02로 변경 (startDate와 동일하면 라이브러리가 endTime 표시 안함)
  const adjustMidnightEnd = (dateTimeStr) => {
    return dateTimeStr.replace('T00:00:00', 'T00:00:02');
  };

  // 캘린더 아이템 변환
  const calendarItems = computed(() => {
    if (
      !moveHouseReservationMonth.value ||
      moveHouseReservationMonth.value.length === 0
    ) {
      return [];
    }

    // 오늘 날짜 (시간 제외)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const items = moveHouseReservationMonth.value.map((reservation) => {
      // API 응답: startTime="2025-11-17 08:00:00", endTime="2025-11-17 12:00:00"
      const startDateTime = reservation.startTime.replace(' ', 'T');
      const endDateTime = reservation.endTime.replace(' ', 'T');

      // 자정 시간 보정 후 Date 객체 생성
      const startDate = new Date(adjustMidnightStart(startDateTime));

      // 과거 날짜인지 확인
      const isPast = startDate < today;

      // 과거면 cancelled, 아니면 원래 상태
      const statusClass = isPast
        ? 'cancelled'
        : getStatusClass(reservation.status);

      const item = {
        id: reservation.uuid,
        title: `${reservation.dong}동 ${reservation.ho}호 ${getMoveTypeLabel(reservation.type)}`,
        startDate,
        endDate: new Date(adjustMidnightEnd(endDateTime)),
        classes: [statusClass], // 배열로 전달
      };

      return item;
    });

    return items;
  });

  const handleDateClick = (day) => {
    props.onDateClick({
      day,
    });
  };

  const handleItemClick = (calendarItem) => {
    // 아이템의 startDate를 day로 변환하여 동일한 동작 수행
    props.onDateClick({
      day: calendarItem.startDate,
    });
  };
</script>

<template>
  <div class="ml-auto mr-auto flex h-[840px] grow flex-col">
    <CalendarView
      :starting-day-of-week="1"
      :show-date="showDate"
      :items="calendarItems"
      item-top="3.4em"
      item-content-height="1.7em"
      current-period-label="오늘"
      :do-emit-item-mouse-events="true"
      :show-times="true"
      :time-format-options="{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }"
      class="custom-calendar"
      @click-date="handleDateClick"
      @click-item="handleItemClick"
    >
      <template #header="{ headerProps }">
        <div class="mb-5 flex w-[350px] items-center gap-2">
          <CalendarViewHeader
            :header-props="headerProps"
            @input="setShowDate"
          />
          <span
            class="currentPeriodLabel order-1 m-0 p-0 text-xl font-semibold leading-7 tracking-[-0.5px] text-black"
          >
            {{
              headerProps.periodLabel
                .split(' ')
                .map((item, index) => {
                  if (index === 1) {
                    return `${item}년 `;
                  }
                  return item;
                })
                .reverse()
                .join('')
            }}
          </span>
        </div>
      </template>
    </CalendarView>
  </div>
</template>

<style scoped>
  /* 네비게이터 영역 스타일링 */
  .custom-calendar :deep(.cv-header) {
    order: 2;
    border: none;
  }

  .custom-calendar :deep(.periodLabel) {
    display: none;
  }

  .custom-calendar :deep(.cv-header-nav) {
    display: flex;
    order: 2;
    gap: 6px;

    margin: 0;
  }

  .custom-calendar :deep(.cv-header-nav button) {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
  }

  /* 맨 앞/맨 뒤 이동 버튼 숨기기 (<<, >>) */
  .custom-calendar :deep(.cv-header-nav button:first-child),
  .custom-calendar :deep(.cv-header-nav button:last-child) {
    display: none;
  }

  /* 요일 영역 스타일링 */
  .custom-calendar :deep(.cv-header-days) {
    height: 44px;
    border-radius: 8px 8px 0 0;
    border-top: 1px solid #e2e8f0;
    border-left: 1px solid #e2e8f0;
    background: rgba(241, 245, 249, 0.8);

    color: #64748b;
    font-weight: 500;
    line-height: 20px;
  }

  .custom-calendar :deep(.cv-header-day) {
    border: none;
    border-right: 1px solid #e2e8f0;
  }

  .custom-calendar :deep(.cv-header-day:first-child) {
    border-top-left-radius: 8px;
    border-left: none;
  }

  .custom-calendar :deep(.cv-header-day:last-child) {
    border-top-right-radius: 8px;
  }

  /* 날짜 셀 스타일링 */
  .custom-calendar :deep(.cv-weeks) {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-left: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
  }

  .custom-calendar :deep(.cv-weekdays) {
    overflow-y: hidden;
  }

  .custom-calendar :deep(.cv-day) {
    padding: 6px;
    padding-bottom: 10px;
    border-top: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .custom-calendar :deep(.cv-day:hover) {
    background-color: #f8fafc;
  }

  .custom-calendar :deep(.outsideOfMonth .cv-day-number) {
    color: #9a9ca2;
  }

  .custom-calendar :deep(.cv-day-number) {
    padding: 2px;
    margin-bottom: 12px;

    color: #020817;
    font-weight: 400;
    line-height: 20px;
  }

  /* 일정 스타일링 - 다른 날짜 영역 침범 방지 */
  .custom-calendar :deep(.cv-item) {
    display: flex;
    align-items: center;
    gap: 0;

    /* 너비 제한 - 절대 부모 날짜 셀을 넘어가지 않도록 */
    max-width: calc((100% / 7) - 12px) !important;
    width: calc((100% / 7) - 12px) !important;
    height: 20px;
    margin-left: 6px;
    padding: 2px 4px 2px 6px;
    border-radius: 2px;

    font-size: 12px;
    line-height: 14px;

    /* 넘치는 내용 숨김 */
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;

    /* 다른 요소 위에 표시되지 않도록 */
    z-index: 1 !important;
  }

  .custom-calendar :deep(.cv-item .startTime) {
    flex-shrink: 0; /* 시간은 항상 완전히 표시 */
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
  }

  /* startTime 뒤에 ~ 붙이기 */
  .custom-calendar :deep(.cv-item .startTime::after) {
    content: '~';
    font-weight: 400;
  }

  .custom-calendar :deep(.cv-item .endTime) {
    flex-shrink: 0; /* 시간은 항상 완전히 표시 */
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
    margin-right: 4px;
  }

  /* endTime::before는 라이브러리 기본 하이픈 제거 */
  .custom-calendar :deep(.cv-item .endTime::before) {
    display: none;
  }

  /* 확정된 일정 스타일 (기본 - 파란색) */
  .custom-calendar :deep(.cv-item.confirmed) {
    border: none !important;
    border-left: 2px solid #2563eb !important;
    background: rgba(37, 99, 235, 0.1) !important;
    color: #64748b !important;
  }

  .custom-calendar :deep(.cv-item.confirmed .startTime),
  .custom-calendar :deep(.cv-item.confirmed .endTime) {
    color: #2563eb !important;
  }

  .custom-calendar :deep(.cv-item.confirmed .startTime::after) {
    color: #64748b !important;
  }

  /* 대기 중인 일정 스타일 (주황색) */
  .custom-calendar :deep(.cv-item.pending) {
    border: none !important;
    border-left: 2px solid #f97316 !important;
    background: rgba(249, 115, 22, 0.1) !important;
    color: #78716c !important;
  }

  .custom-calendar :deep(.cv-item.pending .startTime),
  .custom-calendar :deep(.cv-item.pending .endTime) {
    color: #f97316 !important;
  }

  .custom-calendar :deep(.cv-item.pending .startTime::after) {
    color: #78716c !important;
  }

  /* 취소된 일정 스타일 (회색) */
  .custom-calendar :deep(.cv-item.cancelled) {
    border: none !important;
    border-left: 2px solid rgba(2, 8, 23, 0.3) !important;
    background: rgba(241, 245, 249, 0.8) !important;
    color: rgba(2, 8, 23, 0.3) !important;
  }

  .custom-calendar :deep(.cv-item.cancelled .startTime),
  .custom-calendar :deep(.cv-item.cancelled .endTime) {
    color: rgba(2, 8, 23, 0.3) !important;
  }

  .custom-calendar :deep(.cv-item.cancelled .startTime::after) {
    color: rgba(2, 8, 23, 0.3) !important;
  }

  /* 제목 텍스트 오버플로우 처리 */
  .custom-calendar :deep(.cv-item .title) {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }

  /* 오늘 날짜 표시 */

  .custom-calendar :deep(.cv-day.today .cv-day-number) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #2563eb;
    color: white;
    font-weight: 600;
  }

  /* 오늘 날짜가 다른 달에 속할 때 */
  .custom-calendar :deep(.cv-day.today.outsideOfMonth .cv-day-number) {
    background-color: #94a3b8;
  }
</style>
