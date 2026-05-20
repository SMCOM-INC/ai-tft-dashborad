<script setup>
  import HeaderAi from '@components/layout/components/HeaderAi.vue';
  import LNBAi from '@components/layout/components/LNBAi.vue';
  import { ref } from 'vue';
  import { RouterView } from 'vue-router';

  import useStickyHeader from '@/lib/composables/common/useStickyHeader.js';
  import { useLnbStore } from '@/stores/lnb.js';

  const lnbStore = useLnbStore();
  const scrollContainer = ref(null);
  const { isScrolled } = useStickyHeader(scrollContainer, 8);
</script>

<template>
  <HeaderAi :is-scrolled="isScrolled" />
  <div class="mt-[60px] flex h-[calc(100%-60px)] w-full overflow-hidden">
    <div
      :class="`flex-shrink-0 overflow-hidden transition-all duration-transition ease-std ${lnbStore.isLNBVisible ? 'w-[240px]' : 'w-0'}`"
    >
      <LNBAi />
    </div>
    <main
      ref="scrollContainer"
      class="h-[calc(100vh-60px)] flex-1 overflow-y-auto bg-linear-bg px-8 py-8"
    >
      <RouterView v-slot="{ Component }">
        <Transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
  .route-fade-enter-active {
    transition:
      opacity 350ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .route-fade-leave-active {
    transition:
      opacity 150ms cubic-bezier(0.7, 0, 0.84, 0),
      transform 150ms cubic-bezier(0.7, 0, 0.84, 0);
  }

  .route-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }

  .route-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
