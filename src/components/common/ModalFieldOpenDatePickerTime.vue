<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useField } from 'vee-validate';
  import { computed, ref, watchEffect } from 'vue';

  import { useGetFirstMonth } from '@/lib/queries/aptAdmin/aptAdminParkingQueries.js';
  import createTimeSlots from '@/lib/utils/createTimeSlots.js';

  defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });
  // 시간, 분

  const { value: openDate } = useField('openDate', undefined, {
    initialValue: new Date(),
  });
  const { value: openHours } = useField('openHours', undefined, {
    initialValue: '00',
  });
  const { value: openMinutes } = useField('openMinutes', undefined, {
    initialValue: '00',
  });
  // 현재 날짜 정보
  const currentDate = new Date(); // 현재 날짜
  const currentYear = currentDate.getFullYear(); // 현재 년도
  const currentMonth = currentDate.getMonth(); // 현재 월 0부터 시작 (0 = 1월)

  // 기본 최소 날짜 (3개월 전)
  const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
  const minDate = ref(threeMonthsAgo);
  const maxDate = new Date(currentYear, currentMonth, currentDate.getDate());

  // API에서 '주차 운영 시작 달(월)' 데이터 가져오기
  const { parkStartDate } = useGetFirstMonth();

  const formattedParkStartDate = ref(
    parkStartDate.value || threeMonthsAgo.toISOString().slice(0, 7),
  ); // 기본값 설정

  // ✅ `watchEffect`로 API 응답 후 `minDate` 업데이트
  watchEffect(() => {
    if (parkStartDate.value) {
      formattedParkStartDate.value = parkStartDate.value;
      const [year, month] = formattedParkStartDate.value.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1); // 주차 운영 시작 달 기준
      minDate.value = startDate >= threeMonthsAgo ? startDate : threeMonthsAgo;
    }
  });

  // 🚫 `disabledDates` 설정 (minDate 이전 날짜 비활성화)
  const disabledDates = computed(() => {
    return (date) => date < minDate.value;
  });
</script>

<template>
  <LabelBase label-for="openDate" label-text="입차 일시" asterisk />
  <div class="-mt-2 flex gap-1">
    <VueDatePicker
      v-model="openDate"
      locale="ko"
      no-today
      :enable-time-picker="false"
      auto-apply
      format="yyyy.MM.dd"
      placeholder="YYYY.MM.DD"
      class="custom-date-picker w-[50%]"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
    />
    <select
      v-model="openHours"
      class="h-[38px] w-[25%] cursor-pointer rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
      required
    >
      <option
        v-for="number in createTimeSlots('hour')"
        :key="number"
        :value="number"
      >
        {{ number }}시
      </option>
    </select>
    <select
      v-model="openMinutes"
      class="h-[38px] w-[25%] cursor-pointer rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
      required
    >
      <option
        v-for="number in createTimeSlots('minute')"
        :key="number"
        :value="number"
      >
        {{ number }}분
      </option>
    </select>
  </div>
  <TextError v-if="errors.openDate" class="-mt-4">{{
    errors.openDate
  }}</TextError>
</template>
<style scoped>
  .custom-date-picker {
    --dp-border-color: #d2d6db;
    --dp-hover-color: #e5e7eb;
  }
</style>
