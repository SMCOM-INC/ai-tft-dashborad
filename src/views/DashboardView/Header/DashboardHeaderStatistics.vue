<script setup>
  import IconRefreshBlack from '@assets/icons/icon-refresh-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import OverlayBlur from '@components/common/OverlayBlur.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import DashboardHeaderStatisticsCard from '@views/DashboardView/Header/DashboardHeaderStatisticsCard.vue';
  import { computed } from 'vue';

  import {
    DASHBOARD_ERROR_MESSAGES,
    DASHBOARD_HEADER_STATS,
  } from '@/constants/dashboard.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';
  import useGetDashboardAptInfo from '@/lib/queries/dashboard/useGetDashboardAptInfo.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';
  import { mockDashboardAptInfo } from '@/mock/dashboard.js';

  const { navigateTo } = useNavigate();
  const { hasParkingService } = useCheckParkingService();

  const {
    dashboardAptInfo,
    isDashboardAptInfoLoading,
    isDashboardAptInfoError,
    refetchDashboardAptInfo,
  } = useGetDashboardAptInfo();

  const chartData = computed(() => {
    const noData = !dashboardAptInfo.value || isDashboardAptInfoError.value;

    return noData ? mockDashboardAptInfo : dashboardAptInfo.value;
  });

  // 통계 카드 목록 (방문예약 입차율 경로를 오늘 날짜로 동적 생성)
  const dashboardHeaderStats = computed(() => {
    const today = formatDateObject(new Date(), 'hyphen');

    return DASHBOARD_HEADER_STATS.map((stat) => {
      if (stat.key === 'reservationCount') {
        return {
          ...stat,
          pagePath: `/parking/reservation?page=0&startDate=${today}&endDate=${today}`,
        };
      }
      return stat;
    });
  });

  // 오버레이 표시 여부
  const showOverlay = computed(() => {
    return !hasParkingService.value || isDashboardAptInfoError.value;
  });

  // 오버레이 메시지
  const overlayMessage = computed(() => {
    if (!hasParkingService.value) {
      return '';
    }
    if (isDashboardAptInfoError.value) {
      return DASHBOARD_ERROR_MESSAGES.API_ERROR;
    }
    return '';
  });

  // 통계 카드 클릭 핸들러
  const handleStatsCardClick = (path) => {
    navigateTo(path);
  };
</script>

<template>
  <!-- 스켈레톤 로딩 -->
  <div v-if="isDashboardAptInfoLoading" class="flex items-center gap-3">
    <div
      v-for="i in 4"
      :key="i"
      class="flex flex-col gap-2.5 rounded-lg border border-defaults-hover-border-hover bg-defaults-secondary-background-mono px-[14px] py-3"
    >
      <SkeletonBase class="h-5 w-28 rounded" />
      <SkeletonBase class="h-7 w-20 rounded" />
    </div>
  </div>

  <!-- 통계 카드 -->
  <div v-else class="relative flex items-center gap-3">
    <DashboardHeaderStatisticsCard
      v-for="stats in dashboardHeaderStats"
      :key="stats.key"
      :label="stats.label"
      :unit="stats.unit"
      :count="chartData?.[stats.key]?.count"
      :sub-info="chartData?.[stats.key]?.subInfo"
      @click="handleStatsCardClick(stats.pagePath)"
    />

    <!-- 에러 오버레이 -->
    <OverlayBlur v-if="showOverlay" blur="backdrop-blur-sm" class="-inset-6">
      <div class="flex items-center gap-4">
        <p
          v-dompurify-html="overlayMessage"
          class="whitespace-nowrap text-center text-gray-700 pretendard-16SemiBold"
        ></p>
        <ButtonBase
          v-if="isDashboardAptInfoError"
          type="button"
          color="secondary"
          size="sm"
          @click="refetchDashboardAptInfo"
        >
          <IconRefreshBlack class="h-4 w-4" />
        </ButtonBase>
      </div>
    </OverlayBlur>
  </div>
</template>
