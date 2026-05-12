<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import RegularCreateModal from '@views/ParkingView/Regular/RegularCreateModal.vue';
  import { computed, ref } from 'vue';
  import { RouterView } from 'vue-router';

  import {
    HOUSEHOLD_BUSINESS_TAB_LIST,
    REGIST_TYPE_MAP,
  } from '@/constants/common.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const { getCurrentRoutePath } = useNavigate();

  const registType = computed(() => {
    return getCurrentRoutePath().split('/')[3];
  });

  const isRegularCreateModalOpenRef = ref(false);

  const openCreateModal = () => {
    isRegularCreateModalOpenRef.value = true;
  };

  const closeCreateModal = () => {
    isRegularCreateModalOpenRef.value = false;
  };
</script>

<template>
  <div class="flex flex-col">
    <PageTitleBase title="정기 차량" paragraph="각 세대별 정보를 관리합니다." />
    <div class="flex items-start justify-between">
      <TabBarBase :tab-list="HOUSEHOLD_BUSINESS_TAB_LIST" class="mb-8" />
      <ButtonBase
        type="button"
        color="primary"
        size="md"
        @click="openCreateModal"
      >
        {{ REGIST_TYPE_MAP[registType] }} 정기차량 등록
      </ButtonBase>
    </div>
    <RouterView></RouterView>
  </div>
  <RegularCreateModal
    v-if="isRegularCreateModalOpenRef"
    @close="closeCreateModal"
  />
</template>
