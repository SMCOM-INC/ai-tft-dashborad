<script setup>
  import InputDatePicker from '@components/common/InputDatePicker.vue';
  import { useField } from 'vee-validate';

  import createTimeSlots from '@/lib/utils/createTimeSlots.js';

  defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  // 1시간 이후 시간 구하기
  const getOneHourLaterTime = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1시간 후

    const hours = oneHourLater.getHours();
    const minutes = oneHourLater.getMinutes();

    return { hours, minutes };
  };

  // 현재 시간 기준으로 1시간 후의 초기값 계산
  const getCurrentTimeInitialValue = () => {
    const { hours, minutes } = getOneHourLaterTime();

    // 30분 단위로 올림
    const roundedHours = minutes > 30 ? hours + 1 : hours;
    const roundedMinutes = minutes > 30 ? '00' : '30';

    return {
      hours: String(roundedHours).padStart(2, '0'),
      minutes: roundedMinutes,
    };
  };

  const initialTime = getCurrentTimeInitialValue();

  const { value: openSurveyDate } = useField('openSurveyDate');
  const { value: openSurveyHours } = useField('openSurveyHours', undefined, {
    initialValue: initialTime.hours,
  });
  const { value: openSurveyMinutes } = useField(
    'openSurveyMinutes',
    undefined,
    {
      initialValue: initialTime.minutes,
    },
  );

  const { value: closeSurveyDate } = useField('closeSurveyDate');
  const { value: closeSurveyHours } = useField('closeSurveyHours', undefined, {
    initialValue: '00',
  });
  const { value: closeSurveyMinutes } = useField(
    'closeSurveyMinutes',
    undefined,
    {
      initialValue: '00',
    },
  );
</script>

<template>
  <div class="flex gap-4">
    <!-- 시작 일시 -->
    <div class="flex w-[364px] gap-1">
      <InputDatePicker
        id="openSurveyDate"
        v-model="openSurveyDate"
        local="ko"
        format="yyyy-MM-dd"
        label="시작일시"
        :min-date="new Date()"
        hint="시작일시를 선택해주세요."
        :error="errors.openSurveyDate"
        class="w-[274px]"
      />
      <select
        v-model="openSurveyHours"
        class="mt-8 h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
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
        v-model="openSurveyMinutes"
        class="mt-8 h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
        required
      >
        <option v-for="number in ['00', '30']" :key="number" :value="number">
          {{ number }}분
        </option>
      </select>
    </div>

    <!-- 종료 일시 -->
    <div class="flex w-[364px] gap-1">
      <InputDatePicker
        id="closeSurveyDate"
        v-model="closeSurveyDate"
        local="ko"
        format="yyyy-MM-dd"
        label="종료일시"
        :min-date="new Date()"
        hint="종료일시를 선택해주세요."
        :error="errors.closeSurveyDate"
      />
      <select
        v-model="closeSurveyHours"
        class="mt-8 h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
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
        v-model="closeSurveyMinutes"
        class="mt-8 h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
        required
      >
        <option v-for="number in ['00', '30']" :key="number" :value="number">
          {{ number }}분
        </option>
      </select>
    </div>
  </div>
</template>
