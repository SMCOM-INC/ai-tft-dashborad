<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import { RouterView } from 'vue-router';

  import { FIRE_INSPECTION_TAB_LIST } from '@/constants/fireInspection.js';
</script>

<template>
  <div class="flex flex-col">
    <PageTitleBase title="소방 자가 점검 관리" />
    <div class="flex items-center justify-between">
      <TabBarBase :tab-list="FIRE_INSPECTION_TAB_LIST" class="mb-8" />
    </div>
    <RouterView></RouterView>
  </div>
</template>
