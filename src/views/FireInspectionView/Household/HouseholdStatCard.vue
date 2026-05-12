<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    variant: {
      type: String,
      required: false,
      default: 'default',
      validator: (value) =>
        ['default', 'success', 'error', 'disabled'].includes(value),
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: Object,
      required: false,
      default: null,
    },
    value: {
      type: [Number, String],
      required: true,
    },
  });

  const cardBgClass = computed(() => {
    const variants = {
      default:
        'bg-defaults-primary-background-primary border border-defaults-secondary-border-secondary',
      success: 'bg-alerts-success-background-success-primary',
      error: 'bg-alerts-error-background-error-primary',
      disabled: 'bg-defaults-secondary-background-secondary',
    };
    return variants[props.variant] || variants.default;
  });
</script>

<template>
  <div :class="`flex h-fit flex-col gap-2.5 rounded p-3 ${cardBgClass}`">
    <div class="flex items-center gap-1">
      <component :is="icon" class="h-4 w-4" />
      <span class="text-defaults-secondary-text-secondary pretendard-14Regular">
        {{ label }}
      </span>
    </div>

    <div class="flex items-end justify-end text-right pretendard-24Bold">
      {{ value }}
    </div>
  </div>
</template>
