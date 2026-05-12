<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import OverlayBlur from '@components/common/OverlayBlur.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import DashboardChartsHouseCountBar from '@views/DashboardView/Charts/DashboardChartsHouseCountBar.vue';

  import useDashboardChartData from '@/lib/composables/dashboard/useDashboardChartData.js';
  import useDashboardChartError from '@/lib/composables/dashboard/useDashboardChartError.js';
  import useDashboardMonth from '@/lib/composables/dashboard/useDashboardMonth.js';
  import useGetDashboardMileageHouseCount from '@/lib/queries/dashboard/useGetDashboardMileageHouseCount.js';
  import { mockDashboardMileageHouseCount } from '@/mock/dashboard.js';

  const { selectedDate, changeDate, monthFilter } = useDashboardMonth();

  const {
    dashboardMileageHouseCount,
    isDashboardMileageHouseCountLoading,
    isDashboardMileageHouseCountError,
    refetchDashboardMileageHouseCount,
  } = useGetDashboardMileageHouseCount({ date: selectedDate });

  const { showOverlay, overlayMessage, showDatePicker, showRetryButton } =
    useDashboardChartError(isDashboardMileageHouseCountError);

  // 스켈레톤 막대 높이 생성 (랜덤)
  const skeletonHeights = Array.from({ length: 11 }, () => {
    return Math.floor(Math.random() * (80 - 10 + 1) + 10);
  });

  const { chartData } = useDashboardChartData({
    isError: isDashboardMileageHouseCountError,
    data: dashboardMileageHouseCount,
    mockData: mockDashboardMileageHouseCount,
  });
</script>

<template>
  <div
    class="rounded-[6px] border border-defaults-hover-border-hover bg-defaults-primary-background-primary"
  >
    <div class="flex w-full items-center justify-between p-4">
      <h2 class="pretendard-18SemiBold">
        주차 마일리지 사용량별 세대 수 비율(%)
      </h2>
      <FilterRadioGroup
        v-if="showDatePicker"
        :filter="monthFilter"
        :model-value="selectedDate"
        @select="changeDate"
      />
    </div>

    <!-- 로딩: 스켈레톤 -->
    <div
      v-if="isDashboardMileageHouseCountLoading"
      class="flex h-[280px] items-end justify-center gap-12 px-4 pb-8"
    >
      <SkeletonBase
        v-for="(height, index) in skeletonHeights"
        :key="index"
        :style="{ height: `${height}%` }"
        class="w-full max-w-[26px] rounded-t"
      />
    </div>

    <!-- 에러 또는 데이터: 차트 표시 -->
    <div v-else class="relative">
      <DashboardChartsHouseCountBar :data="chartData" />

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
            @click="refetchDashboardMileageHouseCount"
          >
            다시 시도
          </ButtonBase>
        </div>
      </OverlayBlur>
    </div>
  </div>
</template>
