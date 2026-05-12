<script setup>
  import SkeletonBase from '@components/common/SkeletonBase.vue';

  import { CHARGE_HISTORY_STATISTICS } from '@/constants/store.js';
  import useGetStoreChargeHistory from '@/lib/queries/store/useGetStoreChargeHistory.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';

  const { storeChargeHistory, isStoreChargeHistoryLoading } =
    useGetStoreChargeHistory();
</script>

<template>
  <ul class="flex gap-3">
    <li
      v-for="statistic in CHARGE_HISTORY_STATISTICS"
      :key="statistic.key"
      class="flex items-center gap-2"
    >
      <span
        class="whitespace-nowrap rounded border border-defaults-primary-border-primary bg-defaults-tertiary-background-mono px-1 py-0.5 text-defaults-secondary-text-secondary"
      >
        {{ statistic.label }}
      </span>
      <div v-if="isStoreChargeHistoryLoading" class="w-full">
        <SkeletonBase class="h-5 w-14 rounded-md" />
      </div>
      <span
        v-else-if="statistic.type === 'usageTime'"
        class="text-defaults-primary-border-primary-inverse"
      >
        {{ formatMinutes(storeChargeHistory[statistic.key]) }}
      </span>
      <span
        v-else-if="statistic.type === 'currency'"
        class="text-defaults-primary-border-primary-inverse"
      >
        {{ storeChargeHistory[statistic.key].toLocaleString() }}원
      </span>
    </li>
  </ul>
</template>
