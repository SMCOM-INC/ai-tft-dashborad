<script setup>
  import { computed } from 'vue';

  import {
    FIRE_INSPECTION_STATE_BADGE_KEY,
    FIRE_INSPECTION_STATE_BADGE_LABEL,
  } from '@/constants/fireInspection.js';

  const props = defineProps({
    state: {
      type: String,
      required: true,
      validator: (value) =>
        [
          FIRE_INSPECTION_STATE_BADGE_KEY.SUBMITTED,
          FIRE_INSPECTION_STATE_BADGE_KEY.NOT_SUBMITTED,
          FIRE_INSPECTION_STATE_BADGE_KEY.BEFORE_START,
          FIRE_INSPECTION_STATE_BADGE_KEY.IN_PROGRESS,
          FIRE_INSPECTION_STATE_BADGE_KEY.COMPLETED,
        ].includes(value),
    },
    showDot: {
      type: Boolean,
      required: false,
      default: true,
    },
  });

  const dotBgClass = computed(() => {
    const variants = {
      [FIRE_INSPECTION_STATE_BADGE_KEY.SUBMITTED]:
        'bg-alerts-success-background-success',
      [FIRE_INSPECTION_STATE_BADGE_KEY.NOT_SUBMITTED]:
        'bg-alerts-error-background-error',
      [FIRE_INSPECTION_STATE_BADGE_KEY.BEFORE_START]:
        'bg-defaults-tertiary-background-tertiary',
      [FIRE_INSPECTION_STATE_BADGE_KEY.IN_PROGRESS]:
        'bg-brand-default-background-brand',
      [FIRE_INSPECTION_STATE_BADGE_KEY.COMPLETED]:
        'bg-alerts-success-background-success',
    };
    return (
      variants[props.state] ||
      variants[FIRE_INSPECTION_STATE_BADGE_KEY.SUBMITTED]
    );
  });
</script>

<template>
  <div class="flex items-center gap-2">
    <div v-if="showDot" :class="`h-3 w-3 rounded-full ${dotBgClass}`"></div>
    <span class="text-defaults-primary-text-primary pretendard-14Regular">
      {{ FIRE_INSPECTION_STATE_BADGE_LABEL[state] }}
    </span>
  </div>
</template>
