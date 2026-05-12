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
      type: Array,
      default: () => [],
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

  const handleChange = (optionKey, checked) => {
    let newValues;

    if (checked) {
      // 'ALL'을 선택했을 때, 다른 모든 선택 해제하고 'ALL'만 선택
      if (optionKey === 'ALL') {
        newValues = ['ALL'];
      }

      // 다른 옵션 선택시, 'ALL'이 선택되어 있으면 'ALL' 제거
      if (props.modelValue.includes('ALL')) {
        newValues = [optionKey];
      }

      // 일반적인 선택 추가
      if (!props.modelValue.includes('ALL')) {
        newValues = [...props.modelValue, optionKey];
      }
    }

    if (!checked) {
      newValues = props.modelValue.filter((value) => value !== optionKey);
    }

    emit('update:modelValue', newValues);
  };

  const isChecked = (optionKey) => {
    return props.modelValue.includes(optionKey);
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
        type="checkbox"
        :name="name"
        :value="option.key"
        :checked="isChecked(option.key)"
        :disabled="disabled"
        class="h-4 w-4 rounded-sm text-primary-100"
        @change="(e) => handleChange(option.key, e.target.checked)"
      />
      <span class="select-none text-sm">{{ option.label }}</span>
    </label>
  </div>
</template>
