<script setup>
  import IconCheckmarkLineDarkGray from '@assets/icons/icon-checkmark-line-dark-gray.svg';
  import IconCheckmarkLineLightGray from '@assets/icons/icon-checkmark-line-light-gray.svg';

  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every((option) => 'key' in option && 'label' in option);
      },
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

  // disabled 상태에 따른 체크박스 색상 클래스
  const getCheckboxClass = (optionKey) => {
    const checked = isChecked(optionKey);

    if (props.disabled) {
      if (checked) {
        // disabled + checked: tertiary 색상
        return 'border-defaults-tertiary-border-tertiary bg-defaults-tertiary-background-tertiary';
      }
      // disabled + unchecked: neutral gray 색상
      return 'border-neutral-b-gray-200 bg-neutral-b-gray-50';
    }

    if (checked) {
      // 활성화 + checked: 브랜드 색상
      return 'border-brand-default-border-brand bg-brand-default-background-brand';
    }

    // 활성화 + unchecked: tertiary 색상
    return 'border-defaults-primary-border-primary-inverse bg-defaults-primary-background-primary';
  };
</script>

<template>
  <table class="w-full border-collapse">
    <tr>
      <td
        v-for="(option, optionIndex) in options"
        :key="option.key"
        :class="`w-24 ${optionIndex === 0 ? '' : 'border-l'}`"
      >
        <label
          class="flex cursor-pointer items-center justify-center px-3 py-2"
        >
          <input
            :id="`${name}-${option.key}`"
            type="radio"
            :name="name"
            :value="option.key"
            :checked="isChecked(option.key)"
            :disabled="disabled"
            class="peer sr-only"
            @change="() => handleChange(option.key)"
          />
          <div
            class="flex h-5 w-5 items-center justify-center rounded border transition-colors"
            :class="getCheckboxClass(option.key)"
          >
            <IconCheckmarkLineDarkGray
              v-if="disabled && isChecked(option.key)"
            />
            <IconCheckmarkLineLightGray
              v-else-if="!disabled && isChecked(option.key)"
            />
          </div>
        </label>
      </td>
    </tr>
  </table>
</template>
