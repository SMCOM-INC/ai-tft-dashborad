<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    color: {
      type: String,
      validator(value) {
        const list = [
          'primary',
          'secondary',
          'informal',
          'success',
          'warning',
          'error',
          'disabled',
        ];
        return list.includes(value) || value;
      },
      default: 'primary',
    },
    variant: {
      type: String,
      validator(value) {
        return ['fill', 'outline'].includes(value) || value;
      },
      default: 'fill',
    },
    size: {
      type: String,
      validator(value) {
        return ['sm', 'md', 'lg'].includes(value) || value;
      },
      default: 'md',
    },
    customClass: {
      type: String,
      required: false,
      default: '',
    },
  });

  const convertColor = computed(() => {
    if (props.variant === 'fill') {
      switch (props.color) {
        case 'primary':
          return 'bg-brand-default-background-brand text-defaults-primary-text-primary-inverse';
        case 'secondary':
          return 'bg-defaults-primary-border-primary text-defaults-primary-text-primary-inverse';
        case 'informal':
          return 'bg-alerts-informal-background-informal text-defaults-primary-text-primary-inverse';
        case 'success':
          return 'bg-alerts-success-background-success text-defaults-primary-text-primary-inverse';
        case 'warning':
          return 'bg-alerts-warning-background-warning text-defaults-primary-text-primary-inverse';
        case 'error':
          return 'bg-alerts-error-background-error text-defaults-primary-text-primary-inverse';
        case 'disabled':
          return 'bg-defaults-disabled-border-disabled text-defaults-primary-text-primary-inverse';
        default:
          return props.color;
      }
    } else if (props.variant === 'outline') {
      switch (props.color) {
        case 'primary':
          return 'bg-defaults-primary-background-mono text-brand-default-text-brand border-brand-default-border-brand border';
        case 'secondary':
          return 'bg-defaults-primary-background-mono text-defaults-secondary-text-secondary border-defaults-primary-border-primary border';
        case 'informal':
          return 'bg-defaults-primary-background-mono text-alerts-informal-text-informal border-alerts-informal-border-informal border';
        case 'alert-success':
          return 'bg-defaults-primary-background-mono text-alerts-success-text-success border-alerts-success-border-success border';
        case 'warning':
          return 'bg-defaults-primary-background-mono text-alerts-warning-text-warning border-alerts-warning-border-warning border';
        case 'error':
          return 'bg-defaults-primary-background-mono text-alerts-error-text-error border-alerts-error-border-error border';
        case 'disabled':
          return 'bg-defaults-primary-background-mono text-defaults-disabled-text-disabled border-defaults-disabled-text-disabled border';
        default:
          return props.color;
      }
    }
    return '';
  });

  const convertSize = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'pretendard-12Medium';
      case 'md':
        return 'pretendard-14Medium';
      case 'lg':
        return 'pretendard-16Medium';
      default:
        return props.size;
    }
  });
</script>

<template>
  <span
    :class="`flex select-none items-center justify-center whitespace-nowrap rounded-full px-2 py-1 align-middle ${convertColor} ${convertSize} ${customClass}`"
  >
    <slot />
  </span>
</template>
