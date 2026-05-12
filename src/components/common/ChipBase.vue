<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    color: {
      type: String,
      validator(value) {
        const predefinedColors = [
          'blue-10',
          'blue-100',
          'gray-10',
          'gray-40',
          'gray-100',
          'red-100',
        ];
        return predefinedColors.includes(value) || value;
      },
      default: 'gray',
    },
    variant: {
      type: String,
      validator(value) {
        return ['fill', 'outline'].includes(value) || value;
      },
      default: 'fill',
    },
    class: {
      type: String,
      required: false,
      default: 'w-fit',
    },
  });

  const convertChipColors = computed(() => {
    if (props.variant === 'fill') {
      switch (props.color) {
        case 'green-10':
          return 'text-[#00BB40] bg-[#E6F8EC]';
        case 'blue-10':
          return 'bg-primary-10 text-primary-100';
        case 'blue-100':
          return 'bg-primary-100 text-primary-foreground-100';
        case 'gray-10':
          return 'bg-[#646E84]/10 text-[#646E84]';
        case 'gray-20':
          return 'bg-secondary-100 text-foreground-100';
        case 'gray-40':
          return 'bg-[#646E84]/40 text-background-100';
        case 'gray-100':
          return 'bg-[#646E84] text-background-100';
        case 'gray-200':
          return 'bg-[#646E84] text-white';
        case 'red-10':
          return 'bg-destructive-10 text-destructive-100';
        case 'red-100':
          return 'bg-destructive-100 text-destructive-foreground-100';
        case 'orange-10':
          return 'bg-deep-orange-10 text-deep-orange-100';
        default:
          return props.color;
      }
    } else if (props.variant === 'outline') {
      switch (props.color) {
        case 'gray-20':
          return 'text-foreground-100 border-dark-100 border';
        case 'blue-100':
          return 'bg-primary-foreground-100 border border-primary-50 text-primary-100';
        case 'red-100':
          return 'bg-destructive-foreground-100 border border-destructive-50 text-destructive-100 ';

        default:
          return props.color;
      }
    }
    return '';
  });
</script>

<template>
  <span
    :class="`flex select-none items-center justify-center whitespace-nowrap rounded-full px-[10px] py-[2px] text-xs font-semibold ${convertChipColors} ${props.class}`"
  >
    <slot></slot>
  </span>
</template>
