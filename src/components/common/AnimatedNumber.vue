<script setup>
  import { computed, toRef } from 'vue';

  import useCountUp from '@/lib/composables/common/useCountUp.js';

  const props = defineProps({
    value: {
      type: Number,
      required: true,
    },
    decimals: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 800,
    },
  });

  const targetRef = toRef(props, 'value');
  const display = useCountUp(targetRef, {
    duration: props.duration,
    decimals: props.decimals,
  });

  const formatted = computed(() => {
    return display.value.toLocaleString('ko-KR', {
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals,
    });
  });
</script>

<template>
  <span class="tabular-nums">{{ formatted }}</span>
</template>
