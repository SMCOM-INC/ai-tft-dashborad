<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import InOutHistoryDetailDefault from '@views/StoreView/InOutHistory/InOutHistoryDetailDefault.vue';
  import InOutHistoryDetailDiscount from '@views/StoreView/InOutHistory/InOutHistoryDetailDiscount.vue';
</script>

<template>
  <div class="p-10">
    <div class="flex justify-between">
      <PageTitleBase
        title="입출차 상세"
        has-back-button
        back-url="/store/inout-history"
      />
    </div>
    <!-- 기본 정보 -->
    <InOutHistoryDetailDefault class="pb-10" />
    <!-- 할인 내역 -->
    <InOutHistoryDetailDiscount />
  </div>
</template>
