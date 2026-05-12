<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import { RouterView } from 'vue-router';

  import { ADMIN_APT_INFO_TAB_LIST } from '@/constants/apt.js';
</script>

<template>
  <PageTitleBase
    title="우리 아파트 정보"
    paragraph="우리 아파트 정보를 설정해주세요."
  />
  <TabBarBase :tab-list="ADMIN_APT_INFO_TAB_LIST" class="mb-8" />
  <RouterView />
</template>
