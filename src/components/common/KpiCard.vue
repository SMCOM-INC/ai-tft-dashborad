<script setup>
  import AnimatedNumber from '@components/common/AnimatedNumber.vue';
  import CardBase from '@components/common/CardBase.vue';
  import { ref } from 'vue';

  import useCursorSpotlight from '@/lib/composables/common/useCursorSpotlight.js';

  const props = defineProps({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, default: '' },
    decimals: { type: Number, default: 0 },
    pulse: { type: Boolean, default: false },
    interactive: { type: Boolean, default: false },
  });

  const cardRef = ref(null);
  useCursorSpotlight(cardRef);
</script>

<template>
  <div ref="cardRef" :class="props.pulse ? 'rounded-linear-md animate-accent-pulse' : ''">
    <CardBase :interactive="props.interactive" spotlight>
      <div class="flex flex-col gap-2">
        <p class="text-[13px] font-medium text-linear-text-secondary">
          {{ props.label }}
        </p>
        <div class="flex items-baseline gap-1.5">
          <p
            class="font-inter text-[28px] font-semibold leading-9 tracking-tight text-linear-text"
          >
            <AnimatedNumber :value="props.value" :decimals="props.decimals" />
          </p>
          <span
            v-if="props.unit"
            class="text-[14px] font-medium text-linear-text-secondary"
          >
            {{ props.unit }}
          </span>
        </div>
      </div>
    </CardBase>
  </div>
</template>
