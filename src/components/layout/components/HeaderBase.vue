<script setup>
  defineProps({
    blurred: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <div class="fixed left-0 top-0 z-50 w-full">
    <header
      :class="`mx-auto flex h-[60px] min-w-[1280px] max-w-[1920px] items-center justify-between gap-2 border-b border-linear-border pl-3 pr-8 transition-all duration-transition ease-std ${blurred ? 'bg-white/80 backdrop-blur-md' : 'bg-linear-bg'}`"
    >
      <slot></slot>
    </header>
  </div>
</template>
