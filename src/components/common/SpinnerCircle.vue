<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    color: {
      type: String,
      required: false,
      default: 'white',
    },
  });

  const borderTopColor = computed(() => {
    const colorMap = {
      white: 'border-t-white',
      black: 'border-t-black',
      blue: 'border-t-blue-500',
    };
    return colorMap[props.color];
  });
</script>

<template>
  <span
    :class="`h-5 w-5 animate-spin rounded-full border-4 border-gray-100/50 ${borderTopColor}`"
  />
</template>
