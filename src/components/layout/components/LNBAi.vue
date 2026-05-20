<script setup>
  import LNBBase from '@components/layout/components/LNBBase.vue';

  import { AI_CALL_CENTER_LNB_MENU } from '@/constants/aiCallCenter.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const isActive = (path) => getCurrentRoutePath() === path;
</script>

<template>
  <LNBBase>
    <div class="px-3 py-4">
      <p
        class="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-linear-text-muted"
      >
        분석
      </p>
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in AI_CALL_CENTER_LNB_MENU" :key="item.path">
          <button
            type="button"
            :class="`relative flex w-full items-center px-4 py-2 text-left text-[14px] rounded-linear-sm transition-colors duration-micro ease-std ${isActive(item.path) ? 'bg-linear-surface text-linear-text font-semibold' : 'text-linear-text-secondary font-medium hover:bg-linear-surface hover:text-linear-text'}`"
            @click="navigateTo(item.path)"
          >
            <span
              v-if="isActive(item.path)"
              class="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-linear-accent"
              aria-hidden="true"
            ></span>
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </LNBBase>
</template>
