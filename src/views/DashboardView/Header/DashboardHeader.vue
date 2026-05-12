<script setup>
  import DashboardHeaderAptInfo from '@views/DashboardView/Header/DashboardHeaderAptInfo.vue';
  import DashboardHeaderStatistics from '@views/DashboardView/Header/DashboardHeaderStatistics.vue';
</script>

<template>
  <div
    class="flex w-full justify-between gap-[15px] border-b border-defaults-primary-border-primary px-10 py-6"
  >
    <!-- 아파트 정보 -->
    <DashboardHeaderAptInfo />

    <!-- 통계 카드-->
    <DashboardHeaderStatistics />
  </div>
</template>
