<script setup>
  import CloseIcon from '@assets/icons/icon-close-circle-black.svg';
  import MovingHouseCalendarDayListItem from '@views/MovingHouseView/MovingHouseCalendarDayListItem.vue';
  import { computed } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { useFetchMoveHouseReservationDay } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const emits = defineEmits(['close', 'clickItem']);

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  // moveDate를 computed로 관리
  const moveDate = computed(() => queryParams.value.date || '');

  // 이사 예약 일별 조회
  const { moveHouseReservationDay, isMoveHouseReservationDayLoading } =
    useFetchMoveHouseReservationDay(aptUuid, moveDate);

  // 날짜를 한글 형식으로 포맷
  const formattedDate = computed(() => {
    if (!moveDate.value) return '';
    // "2025-11-17" -> Date 객체로 변환 -> "2025년 11월 17일"
    const [year, month, day] = moveDate.value.split('-');
    const dateObj = new Date(year, month - 1, day);
    return formatDateObject(dateObj, 'korean');
  });

  const closeModal = () => {
    emits('close');
  };

  const handleItemClick = (item) => {
    emits('clickItem', item);
  };
</script>

<template>
  <div
    :class="`fixed top-[0px] z-[1000] flex h-screen w-screen items-start justify-end p-5 ${!!queryParams.detailUuid ? 'right-[400px]' : ' right-[0px] bg-black/50'}`"
  >
    <div
      :class="`absolute flex h-[calc(100%-40px)] min-w-[400px] flex-col border bg-secondary-100 ${!!queryParams.detailUuid ? 'rounded-bl-md rounded-tl-md' : 'rounded-md'}`"
      @click.stop
    >
      <!-- 제목 및 버튼 -->
      <div
        class="flex items-center justify-between rounded-tl-md rounded-tr-md border-b border-b-dark-100 bg-background-100 p-5"
      >
        <h1 class="text-xl font-semibold leading-6">예약현황</h1>
        <button type="button" @click="closeModal"><CloseIcon /></button>
      </div>
      <div class="mx-5 mt-[30px] flex h-[calc(100%-100px)] flex-col gap-5">
        <!-- 날짜 -->
        <div class="flex items-center justify-center">
          <!-- 이전 날짜 -->
          <!-- <button
            type="button"
            class="rounded-md border border-dark-100 bg-background-100 p-2.5"
          >
            <ChevronLeftIcon class="h-3 w-3" />
          </button> -->
          <span class="text-base font-medium">
            {{ formattedDate }}
          </span>
          <!-- 다음 날짜 -->
          <!-- <button
            type="button"
            class="rounded-md border border-dark-100 bg-background-100 p-2.5"
          >
            <ChevronRightIcon class="h-3 w-3" />
          </button> -->
        </div>
        <!-- 예약현황 리스트 -->
        <div
          v-if="isMoveHouseReservationDayLoading"
          class="flex h-full items-center justify-center"
        >
          <p class="text-sm text-gray-500">로딩 중...</p>
        </div>
        <ul
          v-else-if="
            moveHouseReservationDay && moveHouseReservationDay.length > 0
          "
          class="mb-5 flex h-full flex-col gap-4 overflow-auto pr-3"
        >
          <MovingHouseCalendarDayListItem
            v-for="item in moveHouseReservationDay"
            :key="item.uuid"
            :info="item"
            @click="handleItemClick(item)"
          />
        </ul>
        <div v-else class="flex h-full items-center justify-center">
          <p class="text-sm text-gray-500">예약 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>
