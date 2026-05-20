<script setup>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: { type: Array, required: false, default: () => [] },
    placeholder: { type: String, required: false, default: '기간 선택' },
    className: { type: String, required: false, default: 'w-[260px]' },
    maxDate: { type: Date, required: false, default: () => new Date() },
    minDate: { type: Date, required: false, default: null },
    disabled: { type: Boolean, required: false, default: false },
  });

  const emit = defineEmits(['update:modelValue', 'reset']);

  const localDateRange = ref(props.modelValue || []);

  const updateDate = (value) => {
    emit('update:modelValue', value);
  };

  const resetDate = () => {
    emit('reset');
  };

  watch(
    () => props.modelValue,
    (newValue) => {
      localDateRange.value = newValue || [];
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <VueDatePicker
    v-model="localDateRange"
    range
    locale="ko"
    :enable-time-picker="false"
    auto-apply
    :placeholder="placeholder"
    format="yyyy.MM.dd"
    model-type="yyyy-MM-dd"
    :class="`linear-dp ${className}`"
    :max-date="maxDate"
    :min-date="minDate"
    :disabled="disabled"
    @update:model-value="updateDate"
    @cleared="resetDate"
  />
</template>

<style scoped>
  .linear-dp :deep(.dp__input) {
    height: 36px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #ffffff;
    font-family: 'Inter', 'Pretendard', sans-serif;
    font-size: 13px;
    color: #08090a;
    transition:
      border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .linear-dp :deep(.dp__input:hover) {
    border-color: #d4d8dd;
  }

  .linear-dp :deep(.dp__input:focus) {
    border-color: #5e6ad2;
    box-shadow: 0 0 0 4px rgba(94, 106, 210, 0.12);
    outline: none;
  }

  .linear-dp :deep(.dp__menu) {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow:
      0 4px 12px rgba(8, 9, 10, 0.08),
      0 0 0 1px #e5e7eb;
    animation: fade-slide 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .linear-dp :deep(.dp__active_date),
  .linear-dp :deep(.dp__range_end),
  .linear-dp :deep(.dp__range_start) {
    background: #5e6ad2;
    color: #ffffff;
  }

  .linear-dp :deep(.dp__range_between) {
    background: #eef0fb;
    color: #08090a;
  }

  @keyframes fade-slide {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
