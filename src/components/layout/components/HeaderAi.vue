<script setup>
  import HeaderBase from '@components/layout/components/HeaderBase.vue';
  import LNBHamburgerButton from '@components/layout/components/LNBHamburgerButton.vue';

  defineProps({
    isScrolled: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <HeaderBase :blurred="isScrolled">
    <div class="flex items-center gap-3">
      <LNBHamburgerButton />
      <h1
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        AI 콜센터 분석
      </h1>
    </div>
  </HeaderBase>
</template>
