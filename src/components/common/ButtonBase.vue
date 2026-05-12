<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['button', 'submit', 'reset'].includes(value);
      },
      default: 'button',
    },
    form: {
      type: String,
      required: false,
      default: '',
    },
    color: {
      type: String,
      required: false,
      validator(value) {
        return [
          'primary',
          'primary-disabled',
          'secondary',
          'secondary-fill',
          'outlined',
          'destructive',
          'destructive-disabled',
          'destructive-100',
          'destructive-outlined',
        ].includes(value);
      },
      default: '',
    },
    isLink: {
      type: Boolean,
      required: false,
      default: false,
    },
    size: {
      type: String,
      required: false,
      validator(value) {
        return ['sm', 'md', 'lg', 'xl'].includes(value);
      },
      default: 'md',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    customClass: {
      type: String,
      required: false,
      default: '',
    },
  });

  const convertColors = computed(() => {
    if (props.isLink) {
      switch (props.color) {
        case 'primary':
          return 'text-brand-default-text-brand hover:text-brand-hover-text-brand-hover active:text-brand-focus-text-brand-focus disabled:text-brand-disabled-text-brand-disabled';
        case 'secondary':
          return 'text-defaults-secondary-text-secondary hover:text-defaults-hover-text-hover active:text-defaults-focus-text-focus disabled:text-defaults-disabled-text-disabled';
        case 'destructive':
          return 'text-alerts-error-text-error hover:text-alerts-error-text-error-hover active:text-alerts-error-text-error-focus disabled:text-alerts-error-text-error-disabled';
        default:
          return props.color;
      }
    } else {
      switch (props.color) {
        case 'primary':
          return 'bg-brand-default-background-brand text-defaults-primary-text-primary-inverse hover:bg-brand-hover-background-brand-hover active:bg-brand-focus-background-brand-focus active:shadow-[0px_0px_0px_3px_rgba(155,183,246,1.00)]  disabled:bg-brand-disabled-background-brand-disabled';
        case 'primary-disabled':
          return 'bg-brand-disabled-background-brand-disabled text-defaults-primary-text-primary-inverse';
        case 'secondary':
          return 'bg-defaults-primary-background-mono text-defaults-secondary-text-secondary border border-defaults-primary-border-primary hover:bg-defaults-hover-background-hover hover:text-defaults-hover-text-hover hover:border-defaults-hover-border-hover  active:bg-defaults-focus-background-focus active:text-defaults-focus-text-focus active:border-defaults-focus-border-focus active:shadow-[0px_0px_0px_3px_rgba(243,244,246,1.00)] disabled:bg-defaults-disabled-background-disabled disabled:text-defaults-disabled-text-disabled disabled:border-defaults-disabled-border-disabled';
        case 'secondary-fill':
          return 'bg-defaults-secondary-background-secondary text-defaults-secondary-text-secondary hover:bg-defaults-hover-background-hover hover:text-defaults-hover-text-hover active:bg-defaults-focus-background-focus active:text-defaults-focus-text-focus active:shadow-[0px_0px_0px_3px_rgba(243,244,246,1.00)] disabled:bg-defaults-disabled-background-disabled disabled:text-defaults-disabled-text-disabled';
        case 'outlined':
          return 'bg-defaults-primary-background-mono text-brand-default-text-brand border border-brand-default-border-brand hover:text-brand-hover-text-brand-hover hover:border-brand-hover-border-brand-hover active:text-brand-focus-text-brand-focus active:border-brand-focus-border-brand-focus active:shadow-[0px_0px_0px_3px_rgba(155,183,246,1.00)] disabled:bg-defaults-disabled-background-disabled disabled:border-brand-disabled-border-brand-disabled disabled:text-brand-disabled-text-brand-disabled';
        case 'destructive':
          return 'bg-alerts-error-background-error text-defaults-primary-text-primary-inverse hover:bg-alerts-error-background-error-hover active:bg-alerts-error-background-error-focus active:shadow-[0px_0px_0px_3px_rgba(254,228,226,1.00)] disabled:bg-alerts-error-background-error-disabled';
        case 'destructive-disabled':
          return 'bg-alerts-error-background-error-disabled text-defaults-primary-text-primary-inverse';
        case 'destructive-100':
          return 'bg-red-s-error-100 text-red-s-error-500 hover:text-red-s-error-400 active:bg-red-s-error-300 active:text-red-s-error-500 active:shadow-[0px_0px_0px_3px_rgba(254,228,226,1.00)] disabled:bg-red-s-error-50 disabled:text-red-s-error-300';
        case 'destructive-outlined':
          return 'bg-defaults-primary-background-mono text-alerts-error-text-error border border-alerts-error-border-error hover:text-alerts-error-text-error-hover hover:border-alerts-error-text-error-hover active:text-alerts-error-text-error-focus active:border-alerts-error-text-error-focus active:shadow-[0px_0px_0px_3px_rgba(254,228,226,1.00)] disabled:bg-defaults-disabled-background-disabled disabled:border-alerts-error-text-error-disabled disabled:text-alerts-error-text-error-disabled';
        default:
          return props.color;
      }
    }
  });

  const convertSize = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'pretendard-14Medium py-2 px-3';
      case 'md':
        return 'pretendard-14Medium py-2.5 px-4';
      case 'lg':
        return 'pretendard-16Medium py-2.5 px-5';
      case 'xl':
        return 'pretendard-16Medium py-3 px-6';
      default:
        return props.size;
    }
  });
</script>

<template>
  <button
    :type="type"
    :form="form"
    :disabled="disabled"
    :class="`select-none whitespace-nowrap rounded-md text-center ${convertColors} ${convertSize} ${customClass}`"
  >
    <slot />
  </button>
</template>
