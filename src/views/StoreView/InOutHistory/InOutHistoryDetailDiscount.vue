<script setup>
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';
  import InOutHistoryDetailDiscountStatistics from '@views/StoreView/InOutHistory/InOutHistoryDetailDiscountStatistics.vue';

  import { IN_OUT_HISTORY_DETAIL_DISCOUNT_TABLE_HEADERS } from '@/constants/store.js';
  import useGetStoreInOutHistoryDetail from '@/lib/queries/store/useGetStoreInOutHistoryDetail.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';

  const { storeInOutHistoryDetail, isStoreInOutHistoryDetailLoading } =
    useGetStoreInOutHistoryDetail();

  // 필드 값 렌더링
  const renderFieldValue = ({ key, discountInfo }) => {
    if (!key) return '-';

    if (
      key === 'parkingDiscountMinute' ||
      key === 'freeParkingDiscountMinute' ||
      key === 'paidParkingDiscountMinute'
    ) {
      return formatMinutes(discountInfo[key]);
    }

    return discountInfo[key] || '-';
  };
</script>

<template>
  <section
    v-if="storeInOutHistoryDetail?.storeParkingDiscountList?.length > 0"
    class="space-y-4"
  >
    <h3 class="pretendard-20SemiBold">할인 내역</h3>
    <template v-if="isStoreInOutHistoryDetailLoading">
      <SkeletonBase v-for="item in 5" :key="item" class="m-4 h-5 rounded-md" />
    </template>
    <template v-else>
      <InOutHistoryDetailDiscountStatistics />
      <div
        v-for="(
          discountInfo, discountInfoIndex
        ) in storeInOutHistoryDetail?.storeParkingDiscountList"
        :key="discountInfoIndex"
        class="space-y-4"
      >
        <div class="relative mt-14">
          <div
            class="absolute -top-9 flex w-full items-center gap-1.5 rounded-tl-lg rounded-tr-lg bg-defaults-tertiary-background-mono-inverse px-3 py-2 text-defaults-primary-text-primary-inverse"
          >
            {{ discountInfoIndex + 1 }}
            <span>{{ discountInfo?.storeName }}</span>
          </div>
          <div class="w-full">
            <TableInfoBaseNew
              :table-headers="IN_OUT_HISTORY_DETAIL_DISCOUNT_TABLE_HEADERS"
              table-padding="px-4 py-2"
              table-head-class="w-40"
            >
              <template #cell="{ cell }">
                {{ renderFieldValue({ key: cell.key, discountInfo }) }}
              </template>
            </TableInfoBaseNew>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
