<script setup>
  import DashboardChartsCarType from '@views/DashboardView/Charts/DashboardChartsCarType.vue';
  import DashboardChartsHouseCount from '@views/DashboardView/Charts/DashboardChartsHouseCount.vue';
  import DashboardChartsParkingOccupancy from '@views/DashboardView/Charts/DashboardChartsParkingCount.vue';
</script>

<template>
  <div class="space-y-6 px-10 py-8">
    <!-- 단지 주차면수 대비 시간대별 점유율 -->
    <DashboardChartsParkingOccupancy />

    <div class="flex w-full gap-6">
      <!-- 차량 유형별 방문 차량 -->
      <DashboardChartsCarType class="w-1/3" />

      <!-- 주차 마일리지 사용별 세대 수-->
      <DashboardChartsHouseCount class="w-2/3" />
    </div>
  </div>
</template>
