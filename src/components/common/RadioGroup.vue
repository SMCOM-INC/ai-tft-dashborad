<script setup>
  const props = defineProps({
    options: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every((option) => 'key' in option && 'label' in option);
      },
    },
    modelValue: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const handleChange = (optionKey) => {
    emit('update:modelValue', optionKey);
  };

  const isChecked = (optionKey) => {
    return props.modelValue === optionKey;
  };
</script>

<template>
  <div
    v-for="option in options"
    :key="option.key"
    class="px-3 py-2 hover:bg-gray-50"
  >
    <label class="flex cursor-pointer items-center gap-2">
      <input
        :id="`${name}-${option.key}`"
        type="radio"
        :name="name"
        :value="option.key"
        :checked="isChecked(option.key)"
        :disabled="disabled"
        class="h-4 w-4 text-primary-100"
        @change="handleChange(option.key)"
      />
      <span class="select-none text-sm">{{ option.label }}</span>
    </label>
  </div>
</template>
