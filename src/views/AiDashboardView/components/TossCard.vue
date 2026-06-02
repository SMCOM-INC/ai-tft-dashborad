<script setup>
  const props = defineProps({
    padding: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'compact', 'flush'].includes(v),
    },
  });
</script>

<template>
  <div
    :class="`rounded-[20px] border border-toss-grey-200 bg-white ${props.padding === 'compact' ? 'p-4' : props.padding === 'flush' ? 'p-0' : 'p-6'}`"
  >
    <slot />
  </div>
</template>
