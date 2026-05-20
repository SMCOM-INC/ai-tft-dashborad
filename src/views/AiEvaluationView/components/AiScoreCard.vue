<script setup>
  import AnimatedNumber from '@components/common/AnimatedNumber.vue';
  import CardBase from '@components/common/CardBase.vue';
  import { computed } from 'vue';

  const props = defineProps({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    max: { type: Number, required: true },
  });

  const percent = computed(() =>
    Math.min(100, Math.max(0, (props.value / props.max) * 100)),
  );
</script>

<template>
  <CardBase>
    <div class="flex flex-col gap-4">
      <p class="text-[13px] font-medium text-linear-text-secondary">
        {{ props.label }}
      </p>
      <div class="flex items-baseline gap-1.5">
        <p
          class="font-inter text-[26px] font-semibold tracking-tight text-linear-text"
        >
          <AnimatedNumber :value="props.value" :decimals="2" />
        </p>
        <span class="text-[13px] font-medium text-linear-text-secondary">
          / {{ props.max }}
        </span>
      </div>
      <div class="h-1 w-full overflow-hidden rounded-full bg-linear-muted">
        <div
          class="h-full rounded-full bg-linear-accent transition-all duration-data ease-out-quint"
          :style="`width: ${percent}%`"
        ></div>
      </div>
    </div>
  </CardBase>
</template>
