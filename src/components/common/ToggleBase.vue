<script setup>
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    toggleTitle: { type: String, required: true },
    toggleState: { type: Boolean, required: true },
    isError: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    labelClass: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  });

  const emit = defineEmits(['toggleState']);

  const checked = ref(props.toggleState);

  const changeToggle = () => {
    emit('toggleState');
  };

  watch(
    [() => props.isError, () => props.toggleState],
    ([newError, newToggleState]) => {
      if (newError) {
        checked.value = props.toggleState;
      }

      checked.value = newToggleState;
    },
  );
</script>

<template>
  <label
    :class="`${labelClass} ${disabled || isLoading ? 'cursor-not-allowed !border-gray-300' : 'cursor-pointer'}`"
  >
    <span
      :class="['text-nowrap', disabled || isLoading ? 'text-gray-400' : '']"
      >{{ toggleTitle }}</span
    >
    <SpinnerCircle v-if="isLoading" color="blue" />
    <input
      v-model="checked"
      type="checkbox"
      class="peer sr-only"
      :disabled="isLoading || disabled"
      @change="changeToggle"
    />
    <div
      :class="`peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-default-background-brand peer-checked:after:translate-x-full peer-focus:outline-none peer-disabled:cursor-not-allowed rtl:peer-checked:after:-translate-x-full`"
    ></div>
  </label>
</template>
