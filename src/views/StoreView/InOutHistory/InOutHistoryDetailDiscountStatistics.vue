<script setup>
  import { IN_OUT_HISTORY_DETAIL_DISCOUNT_STATISTICS } from '@/constants/store.js';
  import useGetStoreInOutHistoryDetail from '@/lib/queries/store/useGetStoreInOutHistoryDetail.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';

  const { storeInOutHistoryDetail } = useGetStoreInOutHistoryDetail();
</script>

<template>
  <ul class="flex gap-3">
    <li
      v-for="statistic in IN_OUT_HISTORY_DETAIL_DISCOUNT_STATISTICS"
      :key="statistic.key"
      class="space-x-1"
    >
      <span
        class="rounded border border-defaults-primary-border-primary bg-defaults-tertiary-background-mono px-1 py-0.5 text-defaults-secondary-text-secondary"
        >{{ statistic.label }}</span
      >
      <template v-if="statistic.key === 'storeParkingDiscountCount'">
        <span class="text-[#697586]"
          >{{ storeInOutHistoryDetail[statistic.key] || 0 }}건</span
        >
      </template>
      <template v-else>
        <span class="text-[#697586]">{{
          formatMinutes(storeInOutHistoryDetail[statistic.key])
        }}</span>
      </template>
    </li>
  </ul>
</template>
