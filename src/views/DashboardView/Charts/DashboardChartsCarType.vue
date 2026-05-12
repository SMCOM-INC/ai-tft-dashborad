<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import FilterRadioGroup from '@components/common/FilterRadioGroup.vue';
  import OverlayBlur from '@components/common/OverlayBlur.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import DashboardChartsCarTypeDonut from '@views/DashboardView/Charts/DashboardChartsCarTypeDonut.vue';

  import useDashboardChartData from '@/lib/composables/dashboard/useDashboardChartData.js';
  import useDashboardChartError from '@/lib/composables/dashboard/useDashboardChartError.js';
  import useDashboardMonth from '@/lib/composables/dashboard/useDashboardMonth.js';
  import useGetDashboardCarType from '@/lib/queries/dashboard/useGetDashboardCarType.js';
  import { mockDashboardCarType } from '@/mock/dashboard.js';

  const { selectedDate, changeDate, monthFilter } = useDashboardMonth();

  const {
    dashboardCarType,
    isDashboardCarTypeLoading,
    isDashboardCarTypeError,
    refetchDashboardCarType,
  } = useGetDashboardCarType({ date: selectedDate });

  const { showOverlay, overlayMessage, showDatePicker, showRetryButton } =
    useDashboardChartError(isDashboardCarTypeError);

  const { chartData } = useDashboardChartData({
    isError: isDashboardCarTypeError,
    data: dashboardCarType,
    mockData: mockDashboardCarType,
  });
</script>

<template>
  <div
    class="space-y-8 rounded-md border border-defaults-hover-border-hover p-4"
  >
    <div class="flex w-full items-center justify-between gap-4">
      <h2 class="pretendard-18SemiBold">차량 유형 비율(%)</h2>
      <FilterRadioGroup
        v-if="showDatePicker"
        :filter="monthFilter"
        :model-value="selectedDate"
        @select="changeDate"
      />
    </div>

    <!-- 로딩: 스켈레톤 -->
    <div
      v-if="isDashboardCarTypeLoading"
      class="flex h-[250px] items-center justify-center gap-8 p-4"
    >
      <!-- 도넛 차트 스켈레톤 -->
      <SkeletonBase class="h-[180px] w-[180px] flex-shrink-0 rounded-full" />

      <!-- Legend 스켈레톤 -->
      <div class="flex flex-col gap-4">
        <SkeletonBase v-for="i in 6" :key="i" class="h-5 w-32 rounded" />
      </div>
    </div>

    <!-- 에러 또는 데이터: 차트 표시 -->
    <div v-else class="relative">
      <DashboardChartsCarTypeDonut :data="chartData" />

      <!-- 오버레이 -->
      <OverlayBlur v-if="showOverlay" class="-inset-4">
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
            @click="refetchDashboardCarType"
          >
            다시 시도
          </ButtonBase>
        </div>
      </OverlayBlur>
    </div>
  </div>
</template>
