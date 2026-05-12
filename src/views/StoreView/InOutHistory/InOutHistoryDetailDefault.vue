<script setup>
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';

  import { IN_OUT_HISTORY_DETAIL_DEFAULTS_TABLE_HEADERS } from '@/constants/store.js';
  import useGetStoreInOutHistoryDetail from '@/lib/queries/store/useGetStoreInOutHistoryDetail.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';

  const { storeInOutHistoryDetail, isStoreInOutHistoryDetailLoading } =
    useGetStoreInOutHistoryDetail();

  // 필드 값 렌더링
  const renderFieldValue = (key) => {
    if (!key) return '-';

    if (key === 'parkingMinute' || key === 'storeDiscountMinute') {
      return formatMinutes(storeInOutHistoryDetail.value[key]);
    }

    return storeInOutHistoryDetail.value[key] || '-';
  };
</script>

<template>
  <section>
    <div>
      <h3 class="pb-3 pretendard-20SemiBold">기본 정보</h3>
      <template v-if="isStoreInOutHistoryDetailLoading">
        <SkeletonBase
          v-for="item in 4"
          :key="item"
          class="m-4 h-5 rounded-md"
        />
      </template>
      <TableInfoBaseNew
        v-else
        :table-headers="IN_OUT_HISTORY_DETAIL_DEFAULTS_TABLE_HEADERS"
        table-padding="px-4 py-2"
        table-head-class="w-40"
      >
        <template #cell="{ cell }">
          <div v-if="cell.key === 'settlementFlag'">
            <div
              v-if="storeInOutHistoryDetail[cell.key]"
              class="flex items-center gap-2"
            >
              <span
                class="h-3 w-3 rounded-full bg-alerts-success-background-success"
              />
              <span>정상</span>
            </div>
            <div v-else class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-alerts-error-text-error" />
              <span class="text-alerts-error-text-error">초과 주차</span>
            </div>
          </div>
          <template v-else>{{ renderFieldValue(cell.key) }}</template>
        </template>
      </TableInfoBaseNew>
    </div>
  </section>
</template>
