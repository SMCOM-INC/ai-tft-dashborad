<script setup>
  import IconChevronRightGray from '@assets/icons/icon-chevron-right-grey.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import OverlayBlur from '@components/common/OverlayBlur.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import DashboardChartsParkingCountBar from '@views/DashboardView/Charts/DashboardChartsParkingCountBar.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { ref } from 'vue';

  import {
    DASHBOARD_PARKING_TYPE_IN,
    DASHBOARD_PARKING_TYPE_OPTIONS,
  } from '@/constants/dashboard.js';
  import useDashboardChartData from '@/lib/composables/dashboard/useDashboardChartData.js';
  import useDashboardChartError from '@/lib/composables/dashboard/useDashboardChartError.js';
  import useDashboardDate from '@/lib/composables/dashboard/useDashboardDate.js';
  import useGetDashboardParkingCount from '@/lib/queries/dashboard/useGetDashboardParkingCount.js';
  import { mockDashboardOccupancy } from '@/mock/dashboard.js';

  import '@vuepic/vue-datepicker/dist/main.css';

  const parkingType = ref(DASHBOARD_PARKING_TYPE_IN);

  const { selectedDate, formattedDate, changeDate, minDate, maxDate } =
    useDashboardDate();

  const {
    dashboardParkingCount,
    isDashboardParkingCountLoading,
    isDashboardParkingCountError,
    refetchDashboardParkingCount,
  } = useGetDashboardParkingCount({ date: formattedDate, parkingType });

  const { showOverlay, overlayMessage, showDatePicker, showRetryButton } =
    useDashboardChartError(isDashboardParkingCountError);

  // 스켈레톤 막대 높이 생성 (랜덤)
  const skeletonHeights = Array.from({ length: 24 }, () => {
    return Math.floor(Math.random() * (80 - 10 + 1) + 10);
  });

  const { chartData } = useDashboardChartData({
    isError: isDashboardParkingCountError,
    data: dashboardParkingCount,
    mockData: mockDashboardOccupancy,
  });

  const changeInOutType = (type) => {
    parkingType.value = type;
  };
</script>

<template>
  <div>
    <!-- 시간대별 점유율 차트 -->
    <div
      class="rounded-[6px] border border-defaults-hover-border-hover bg-defaults-primary-background-primary"
    >
      <div class="flex w-full items-center justify-between p-4">
        <h2 class="pretendard-18SemiBold">일일 시간대별 입출차 수</h2>

        <div v-if="showDatePicker" class="flex items-center gap-2">
          <!-- 입차/출차 토글 -->
          <div
            class="flex rounded-lg bg-defaults-tertiary-background-tertiary p-1"
          >
            <button
              v-for="option in DASHBOARD_PARKING_TYPE_OPTIONS"
              :key="option.value"
              type="button"
              :class="`rounded-md px-2.5 py-1.5 transition-colors pretendard-14Medium ${parkingType === option.value ? 'bg-defaults-primary-background-primary' : 'text-defaults-tertiary-text-tertiary'}`"
              @click="changeInOutType(option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <div class="relative">
            <VueDatePicker
              v-model="selectedDate"
              :format="'yyyy년 MM월 dd일'"
              locale="ko"
              auto-apply
              :clearable="false"
              :enable-time-picker="false"
              :disabled="isDashboardParkingCountLoading"
              :min-date="minDate"
              :max-date="maxDate"
              class="w-[186px]"
              @update:model-value="changeDate"
            />
            <IconChevronRightGray
              class="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 rotate-90"
            />
          </div>
        </div>
      </div>

      <!-- 로딩: 스켈레톤 -->
      <div
        v-if="isDashboardParkingCountLoading"
        class="flex h-[340px] items-end justify-center gap-8 px-4 pb-8"
      >
        <SkeletonBase
          v-for="(height, index) in skeletonHeights"
          :key="index"
          :style="{ height: `${height}%` }"
          class="w-full max-w-[22px] rounded-t"
        />
      </div>

      <!-- 에러 또는 데이터: 차트 표시 -->
      <div v-else class="relative">
        <DashboardChartsParkingCountBar
          :data="chartData"
          :parking-type="parkingType"
        />

        <!-- 오버레이 -->
        <OverlayBlur v-if="showOverlay">
          <div class="flex flex-col items-center gap-4">
            <p
              v-dompurify-html="overlayMessage"
              class="whitespace-nowrap text-center text-gray-700 pretendard-18SemiBold"
            />
            <ButtonBase
              v-if="showRetryButton"
              type="button"
              color="secondary"
              size="md"
              @click="refetchDashboardParkingCount"
            >
              다시 시도
            </ButtonBase>
          </div>
        </OverlayBlur>
      </div>
    </div>
  </div>
</template>
