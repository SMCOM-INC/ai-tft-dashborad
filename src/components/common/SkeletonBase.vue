<script setup>
  defineProps({
    color: {
      type: String,
      required: false,
      default: 'bg-[#CDCBCBFF]',
    },
  });
</script>

<template>
  <div :class="`animate-pulse ${color}`"></div>
</template>
