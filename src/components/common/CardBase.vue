<script setup>
  const props = defineProps({
    padding: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'compact', 'flush'].includes(v),
    },
    interactive: {
      type: Boolean,
      default: false,
    },
    spotlight: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <div
    :class="`relative rounded-linear-md border border-linear-border bg-linear-bg shadow-linear-card transition-all duration-micro ease-std ${props.padding === 'default' ? 'p-5' : props.padding === 'compact' ? 'p-4' : 'p-0'} ${props.interactive ? 'cursor-pointer hover:border-linear-border-strong hover:shadow-linear-card-hover' : ''} ${props.spotlight ? 'spotlight' : ''}`"
  >
    <slot />
  </div>
</template>
