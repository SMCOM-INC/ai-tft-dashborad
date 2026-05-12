<script setup>
  import IconAlertCircleGray from '@assets/icons/icon-alert-circle-gray.svg';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import { computed } from 'vue';
  import { RouterView } from 'vue-router';

  import { ADMIN_PARKING_SETTING_TAB_LIST } from '@/constants/parking.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const userInfoStore = useUserInfoStore();

  const hasMileageLimit = computed(() =>
    userInfoStore.userInfo?.contentList?.some(
      (item) => item.name.trim() === '마일리지 한도 제한',
    ),
  );
</script>
Asu
<template>
  <PageTitleBase
    title="주차 관리 설정"
    paragraph="주차 유형별 기본값을 설정해주세요"
  />
  <div v-if="hasMileageLimit" class="-mt-4 mb-2">
    <p class="flex items-center gap-1 text-sm text-primary-100">
      <IconAlertCircleGray class="h-3 w-3" /> 마일리지 한도 제한 기능을
      사용중입니다.
    </p>
  </div>
  <TabBarBase :tab-list="ADMIN_PARKING_SETTING_TAB_LIST" class="mb-8" />
  <RouterView />
</template>
