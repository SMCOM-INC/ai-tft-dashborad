<script setup>
  import AnimatedNumber from '@components/common/AnimatedNumber.vue';
  import TossCard from '@views/AiDashboardView/components/TossCard.vue';

  const props = defineProps({
    emoji: { type: String, default: '' },
    label: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, default: '' },
    decimals: { type: Number, default: 0 },
    accent: { type: Boolean, default: false },
    hint: { type: String, default: '' },
  });
</script>

<template>
  <TossCard>
    <div class="flex flex-col gap-3.5">
      <span
        v-if="props.emoji"
        :class="`flex h-10 w-10 items-center justify-center rounded-[14px] ${props.accent ? 'bg-toss-blue-50' : 'bg-toss-grey-100'}`"
      >
        <span class="font-tossface text-[22px] leading-none">
          {{ props.emoji }}
        </span>
      </span>

      <div class="flex flex-col gap-2">
        <p class="text-[14px] font-medium text-toss-grey-600">
          {{ props.label }}
        </p>
        <div class="flex items-baseline gap-1">
          <p
            :class="`text-[28px] font-bold leading-none tracking-tight tabular-nums ${props.accent ? 'text-toss-blue-500' : 'text-toss-grey-900'}`"
          >
            <AnimatedNumber :value="props.value" :decimals="props.decimals" />
          </p>
          <span
            v-if="props.unit"
            class="text-[15px] font-medium text-toss-grey-500"
          >
            {{ props.unit }}
          </span>
        </div>
        <p v-if="props.hint" class="text-[13px] text-toss-grey-500">
          {{ props.hint }}
        </p>
      </div>
    </div>
  </TossCard>
</template>
