<script setup>
  import LNBBase from '@components/layout/components/LNBBase.vue';

  import { LNB_MASTER_ADMIN_LIST } from '@/constants/layout.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const handleListButton = (path) => {
    navigateTo(path);
  };
</script>
<template>
  <LNBBase>
    <ul class="flex flex-col gap-1 px-3 py-2">
      <li v-for="list in LNB_MASTER_ADMIN_LIST" :key="list.path">
        <a
          :class="`block w-full cursor-pointer px-4 py-2 text-left pretendard-16Regular hover:bg-primary-20 ${getCurrentRoutePath().includes(list.path) ? 'bg-accent-100' : ''}`"
          href="#"
          @click.prevent="handleListButton(list.path)"
        >
          {{ list.label }}
        </a>
      </li>
    </ul>
  </LNBBase>
</template>
