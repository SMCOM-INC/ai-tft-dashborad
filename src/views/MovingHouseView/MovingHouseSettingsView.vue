<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import { RouterView } from 'vue-router';

  import { MOVING_HOUSE_SETTINGS_TAB_LIST } from '@/constants/movingHouse.js';
</script>

<template>
  <PageTitleBase
    title="이사 예약 설정"
    paragraph="이사 예약의 기본 정보를 입력해 주세요."
  />
  <div class="flex justify-between">
    <TabBarBase :tab-list="MOVING_HOUSE_SETTINGS_TAB_LIST" class="mb-8" />
  </div>
  <RouterView />
</template>
