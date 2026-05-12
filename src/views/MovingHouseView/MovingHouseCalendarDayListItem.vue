<script setup>
  import ChipBase from '@components/common/ChipBase.vue';
  import { computed } from 'vue';

  import { formatDate } from '@/lib/utils/formatDate.js';

  const props = defineProps({
    info: { type: Object, required: true, default: () => {} },
  });

  const emits = defineEmits(['click']);

  const handleClick = () => {
    emits('click', props.info);
  };

  // 시간 포맷 함수 (HH:mm 형식)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    // "08:00:00" -> "08:00"
    return timeString.substring(0, 5);
  };

  // 시간 범위 표시
  const timeRange = computed(() => {
    const start = formatTime(props.info?.moveStartTime);
    const end = formatTime(props.info?.moveEndTime);
    return `${start}~${end}`;
  });

  // 예약상태 칩 색상
  const getStatusChipColor = (status) => {
    const colorMap = {
      WAITING: 'orange-10', // 대기: 주황색
      CONFIRMED: 'blue-10', // 확정: 파란색
      CANCELED: 'gray-10', // 취소: 회색
    };
    return colorMap[status] || 'gray-10';
  };

  // 예약상태 한글 텍스트
  const getStatusText = (status) => {
    const statusMap = {
      WAITING: '대기',
      CONFIRMED: '확정',
      CANCELED: '취소',
    };
    return statusMap[status] || status;
  };

  // 이사 유형 칩 색상
  const getMoveTypeChipColor = (type) => {
    return type === 'MOVE_IN' ? 'blue-10' : 'red-10';
  };

  // 이사 유형 한글 텍스트
  const getMoveTypeText = (type) => {
    return type === 'MOVE_IN' ? '전입' : '전출';
  };

  const CALENDAR_MOCK_DATE_FIELD_LIST = [
    { key: 'createdDate', label: '신청일' },
    { key: 'residentName', label: '신청자' },
    { key: 'moveReservationStatus', label: '예약상태' },
  ];
</script>

<template>
  <!-- 이미 지난 시간 -->
  <li
    :key="info?.uuid"
    class="flex cursor-pointer flex-col gap-2 rounded-md bg-background-100 p-4"
    @click="handleClick"
  >
    <div
      class="flex justify-between rounded-sm border-l-2 border-l-[#02081744] bg-secondary-80 px-2 py-1.5"
    >
      <span class="bg-dark-30 font-medium text-[#02081780]">
        {{ timeRange }}
      </span>
      <div class="flex items-center gap-2">
        <span class="text-muted-foreground-100">
          {{ `${info?.dong}동 ${info?.ho}호` }}
        </span>
        <ChipBase :color="getMoveTypeChipColor(info?.moveType)">
          {{ getMoveTypeText(info?.moveType) }}
        </ChipBase>
      </div>
    </div>
    <ul>
      <li
        v-for="field in CALENDAR_MOCK_DATE_FIELD_LIST"
        :key="field.key"
        class="flex items-center gap-2"
      >
        <span class="w-14 font-semibold">{{ field.label }}</span>
        <span v-if="field.key === 'moveReservationStatus'">
          <ChipBase :color="getStatusChipColor(info[field.key])">
            {{ getStatusText(info[field.key]) }}
          </ChipBase>
        </span>
        <span v-else-if="field.key === 'createdDate'">
          {{ formatDate(info[field.key]).full() }}
        </span>
        <span v-else>{{ info[field.key] || '-' }}</span>
      </li>
    </ul>
  </li>
</template>
