<script setup>
  import { useField } from 'vee-validate';

  const props = defineProps({
    list: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    variants: {
      type: String,
      default: 'filled',
      validator: (value) => ['filled', 'outlined'].includes(value),
    },
    checkType: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'none', 'custom'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const { value: inputValue, handleChange } = useField(props.name, undefined, {
    initialValue: props.modelValue,
  });

  const getVariantsStyles = (isSelected) => {
    if (props.variants === 'filled') {
      return isSelected
        ? 'bg-blue-400 font-semibold text-white'
        : 'border-gray-300 bg-gray-100';
    }

    return `bg-white text-black ${isSelected ? 'border-black' : 'border-gray-300'}`;
  };

  const handleRadioChange = (key) => {
    if (!props.disabled) {
      handleChange(key);
    }
  };
</script>

<template>
  <label
    v-for="radio in list"
    :key="radio.key"
    :for="`${name}-${radio.key}`"
    :class="[
      `flex items-center gap-2 rounded-lg border px-4 py-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}  transition-colors`,
      getVariantsStyles(inputValue === radio.key),
    ]"
  >
    <input
      :id="`${name}-${radio.key}`"
      :name="name"
      :value="radio.key"
      :checked="inputValue === radio.key"
      :disabled="disabled"
      type="radio"
      :class="checkType === 'default' ? 'accent-black' : 'hidden'"
      @change="handleRadioChange(radio.key)"
    />
    {{ radio.label }}
  </label>
</template>
