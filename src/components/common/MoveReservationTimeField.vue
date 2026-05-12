<script setup>
  import { computed } from 'vue';

  import createTimeSlots from '@/lib/utils/createTimeSlots.js';

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const updateField = (fieldName, value) => {
    const updated = { ...props.modelValue, [fieldName]: value };

    // startTime, endTime 자동 계산
    if (fieldName === 'startHours' || fieldName === 'startMinutes') {
      updated.startTime = `${updated.startHours || '00'}:${updated.startMinutes || '00'}:00`;
    }
    if (fieldName === 'endHours' || fieldName === 'endMinutes') {
      updated.endTime = `${updated.endHours || '00'}:${updated.endMinutes || '00'}:00`;
    }

    emit('update:modelValue', updated);
  };

  // 시간 값들을 computed로 처리
  const startHours = computed({
    get: () => props.modelValue.startHours || '00',
    set: (val) => updateField('startHours', val),
  });

  const startMinutes = computed({
    get: () => props.modelValue.startMinutes || '00',
    set: (val) => updateField('startMinutes', val),
  });

  const endHours = computed({
    get: () => props.modelValue.endHours || '00',
    set: (val) => updateField('endHours', val),
  });

  const endMinutes = computed({
    get: () => props.modelValue.endMinutes || '00',
    set: (val) => updateField('endMinutes', val),
  });
</script>

<template>
  <div class="flex items-center gap-1">
    <select
      v-model="startHours"
      class="h-[38px] w-[70px] cursor-pointer rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_8px_center] bg-no-repeat px-3 py-2 text-sm focus:border-primary-100 focus:outline-none disabled:bg-foreground-10 disabled:text-foreground-50"
      :disabled="disabled"
    >
      <option
        v-for="number in createTimeSlots('hour')"
        :key="number"
        :value="number"
      >
        {{ number }}
      </option>
    </select>
    <select
      v-model="startMinutes"
      class="h-[38px] w-[70px] cursor-pointer rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_8px_center] bg-no-repeat px-3 py-2 text-sm focus:border-primary-100 focus:outline-none disabled:bg-foreground-10 disabled:text-foreground-50"
      :disabled="disabled"
    >
      <option
        v-for="number in createTimeSlots('minute')"
        :key="number"
        :value="number"
      >
        {{ number }}
      </option>
    </select>
    <span class="mx-2">~</span>
    <select
      v-model="endHours"
      class="h-[38px] w-[70px] cursor-pointer rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_8px_center] bg-no-repeat px-3 py-2 text-sm focus:border-primary-100 focus:outline-none disabled:bg-foreground-10 disabled:text-foreground-50"
      :disabled="disabled"
    >
      <option
        v-for="number in createTimeSlots('hour')"
        :key="number"
        :value="number"
      >
        {{ number }}
      </option>
    </select>
    <select
      v-model="endMinutes"
      class="h-[38px] w-[70px] cursor-pointer rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_8px_center] bg-no-repeat px-3 py-2 text-sm focus:border-primary-100 focus:outline-none disabled:bg-foreground-10 disabled:text-foreground-50"
      :disabled="disabled"
    >
      <option
        v-for="number in createTimeSlots('minute')"
        :key="number"
        :value="number"
      >
        {{ number }}
      </option>
    </select>
  </div>
</template>
