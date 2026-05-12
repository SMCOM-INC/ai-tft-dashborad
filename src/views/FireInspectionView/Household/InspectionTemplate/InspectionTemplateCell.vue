<script setup>
  import { computed } from 'vue';

  defineProps({
    content: {
      type: String,
      required: true,
    },

    rowSpan: {
      type: Number,
      default: 1,
    },
  });

  const cellClass = computed(() => {
    const baseClass =
      'border-r px-3 py-2.5 pretendard-14Regular text-defaults-primary-text-primary bg-defaults-primary-background-primary border-b border-defaults-primary-border-primary';

    return `${baseClass} }`;
  });
</script>

<template>
  <td :class="cellClass" :rowspan="rowSpan">
    {{ content }}
  </td>
</template>
