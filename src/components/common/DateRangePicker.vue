<script setup>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Array,
      required: false,
      default: () => [],
    },
    placeholder: {
      type: String,
      required: false,
      default: '날짜 선택',
    },
    className: {
      type: String,
      required: false,
      default: 'w-64',
    },
    maxDate: {
      type: Date,
      required: false,
      default: () => new Date(),
    },
    minDate: {
      type: Date,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
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
      // null이나 undefined인 경우 빈 배열로 처리
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
    :class="className"
    :max-date="maxDate"
    :min-date="minDate"
    :disabled="disabled"
    @update:model-value="updateDate"
    @cleared="resetDate"
  />
</template>
