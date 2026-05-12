<script setup>
  import IconCloseWhite from '@assets/icons/icon-close-white.svg';
  import IconMenuLineBlack from '@assets/icons/icon-menu-line-black.svg';

  import useLnbHover from '@/lib/composables/common/useLnbHover.js';
  import { useLnbStore } from '@/stores/lnb.js';

  const lnbStore = useLnbStore();

  const { buttonEl, setLNBVisible, showHoverLNB, startHideHoverLNB } =
    useLnbHover();
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
  <div class="relative">
    <button
      ref="buttonEl"
      type="button"
      :aria-label="lnbStore.isLNBVisible ? '메뉴 닫기' : '메뉴 열기'"
      class="rounded p-2 hover:bg-primary-10"
      @click="setLNBVisible"
      @mouseenter="!lnbStore.isLNBVisible && showHoverLNB()"
      @mouseleave="!lnbStore.isLNBVisible && startHideHoverLNB()"
    >
      <IconMenuLineBlack class="h-5 w-5" aria-hidden="true" />
    </button>
    <div
      v-if="lnbStore.isLNBVisible && !lnbStore.hasClosedLNBTooltip"
      class="absolute left-0 top-9 z-30"
    >
      <!-- 말풍선 꼭지 -->
      <div class="ml-3.5 h-2.5 w-2.5 rotate-45 bg-gray-700"></div>
      <!-- 말풍선 본문 -->
      <div
        class="-mt-1.5 flex items-center gap-3 rounded bg-gray-700 px-3 py-1.5 shadow-md"
      >
        <span class="whitespace-nowrap text-white pretendard-12Regular">
          메뉴를 접을 수 있어요
        </span>
        <button type="button" @click="lnbStore.setLNBTooltip">
          <IconCloseWhite class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>
