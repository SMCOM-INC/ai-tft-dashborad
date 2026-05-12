<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import RestrictionBlackListCreationModal from '@views/ParkingView/Restriction/RestrictionBlackListCreationModal.vue';
  import { computed, ref } from 'vue';
  import { RouterView } from 'vue-router';

  import { ADMIN_PARKING_RESTRICTIONS_TAB_LIST } from '@/constants/parking.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const isBlackListCreationModalOpen = ref(false);
  const { getCurrentRoutePath, hasDetailPage } = useNavigate();

  const showBlackListRegisterButton = computed(() => {
    return getCurrentRoutePath() === '/parking/restriction/blacklist';
  });

  const openBlackListCreationModal = () => {
    isBlackListCreationModalOpen.value = true;
  };

  const closeBlackListCreationModal = () => {
    isBlackListCreationModalOpen.value = false;
  };
</script>

<template>
  <div class="flex flex-col">
    <div v-if="!hasDetailPage">
      <PageTitleBase
        title="주차 거부 · 블랙리스트"
        paragraph="단지의 주차 거부와 블랙리스트를 관리합니다."
      />
      <div class="flex items-center justify-between">
        <TabBarBase :tab-list="ADMIN_PARKING_RESTRICTIONS_TAB_LIST" class="mb-8" />
        <ButtonBase
          v-if="showBlackListRegisterButton"
          type="button"
          color="primary"
          size="md"
          custom-class="inline"
          @click="openBlackListCreationModal"
        >
          블랙리스트 등록
        </ButtonBase>
      </div>
    </div>
    <RouterView></RouterView>
    <RestrictionBlackListCreationModal
      v-if="isBlackListCreationModalOpen"
      @close="closeBlackListCreationModal"
    />
  </div>
</template>
