<script setup>
  import { useField } from 'vee-validate';
  import { computed } from 'vue';

  import { TYPES } from '@/constants/vote.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const { value: voteType } = useField('voteType');

  const { getCurrentRoutePath } = useNavigate();

  const isListPage = computed(() => {
    return getCurrentRoutePath().includes('vote/list');
  });
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-defaults-secondary-text-secondary pretendard-16Medium">
      투표 유형
    </h3>
    <div :class="`flex gap-2 ${isListPage ? 'flex-wrap ' : undefined}`">
      <label
        v-for="type in TYPES"
        :key="type.key"
        :class="`flex items-start gap-3 rounded-md border border-defaults-primary-border-primary p-4 ${type.key === voteType && !disabled ? 'border-primary2-pc-indigo-300' : undefined} ${type.key === voteType && disabled ? 'border-4' : undefined} ${isListPage ? 'w-fit' : 'w-1/3'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`"
      >
        <input
          v-model="voteType"
          type="radio"
          :value="type.key"
          class="mt-1"
          :disabled="disabled"
        />
        <div>
          <div class="pretendard-16Regular">{{ type.label }}</div>
          <div
            v-if="!isListPage"
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            {{ type.description }}
          </div>
        </div>
      </label>
    </div>
    <p class="h-5 text-alerts-error-text-error pretendard-14Regular">
      {{ errors.voteType }}
    </p>
  </div>
</template>
