<script setup>
  import GlobalNoticePopup from '@components/common/GlobalNoticePopup.vue';
  import ToastAlarm from '@components/common/ToastAlarm.vue';
  import HeaderAdmin from '@components/layout/components/HeaderAdmin.vue';
  import HeaderMaster from '@components/layout/components/HeaderMaster.vue';
  import LNBAdmin from '@components/layout/components/LNBAdmin.vue';
  import LNBMaster from '@components/layout/components/LNBMaster.vue';
  import { computed } from 'vue';
  import { RouterView } from 'vue-router';

  import useLnbHover from '@/lib/composables/common/useLnbHover.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';
  import { useLnbStore } from '@/stores/lnb.js';

  const { hasDetailPage } = useNavigate();

  const { token } = useTokenStore();
  const userInfoStore = useUserInfoStore();

  const lnbStore = useLnbStore();
  const { lnbLeft, lnbTop, showHoverLNB, startHideHoverLNB } = useLnbHover();

  const isMasterAdmin = computed(() => {
    return token.userRole === 'master';
  });
  const isStoreAdmin = computed(() => {
    return token.userRole === 'store_admin';
  });

  const showMasterLNB = computed(() => {
    return isMasterAdmin.value && !userInfoStore.userInfo.aptUuid;
  });
</script>

<template>
  <HeaderMaster v-if="isMasterAdmin" />
  <HeaderAdmin v-else />
  <div class="mt-[65px] flex h-[calc(100%-65px)] w-full overflow-hidden">
    <div
      :class="`flex-shrink-0 overflow-hidden transition-all duration-300 ${lnbStore.isLNBVisible ? 'w-[266px]' : 'w-0'}`"
    >
      <LNBMaster v-if="showMasterLNB" />
      <LNBAdmin v-else />
    </div>
    <main
      :class="`h-[calc(100vh-74px)] flex-1 overflow-y-auto ${hasDetailPage ? undefined : 'p-8'}`"
    >
      <RouterView />
    </main>
  </div>

  <!-- LNB 닫힌 상태에서 햄버거 버튼 hover 시 표시되는 fixed LNB -->
  <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
  <Transition name="lnb-hover-dropdown">
    <div
      v-if="!lnbStore.isLNBVisible && lnbStore.isHoverLNBVisible"
      class="fixed z-50 shadow-lg"
      :style="{ top: `${lnbTop}px`, left: `${lnbLeft}px`, height: `calc(100vh - ${lnbTop}px)` }"
      @mouseenter="showHoverLNB"
      @mouseleave="startHideHoverLNB"
    >
      <LNBMaster v-if="showMasterLNB" />
      <LNBAdmin v-else />
    </div>
  </Transition>

  <!-- 아파트 관리자에게만 전체 공지사항 팝업 표시 -->
  <GlobalNoticePopup v-if="!isMasterAdmin && !isStoreAdmin" />

  <!-- 토스트 -->
  <ToastAlarm />
</template>

<style scoped>
  .lnb-hover-dropdown-enter-active,
  .lnb-hover-dropdown-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .lnb-hover-dropdown-enter-from,
  .lnb-hover-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
