<script setup>
  defineProps({
    blur: {
      type: String,
      required: false,
      default: 'backdrop-blur-lg',
    },
  });
</script>

<template>
  <div
    :class="`absolute inset-0 flex items-center justify-center bg-white/60  ${blur}`"
  >
    <slot />
  </div>
</template>
