<script setup>
  import { useField } from 'vee-validate';
  import { computed } from 'vue';

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
      validator(value) {
        return ['lg', 'xl'].includes(value);
      },
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    maxlength: {
      type: Number,
      required: false,
      default: 100,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    error: {
      type: String,
      required: false,
      default: '',
    },
    hint: {
      type: String,
      required: false,
      default: '',
    },
    meta: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    classCustom: {
      type: String,
      required: false,
      default: '',
    },
    classInputCustom: {
      type: String,
      required: false,
      default: '',
    },
  });

  const { value, handleChange } = useField(props.id);

  const convertSize = computed(() => {
    switch (props.size) {
      case 'lg':
        return 'pretendard-14Regular';
      case 'xl':
        return 'pretendard-16Regular';
      default:
        return props.size;
    }
  });
</script>

<template>
  <div :class="`flex flex-col gap-2 ${classCustom}`">
    <label
      v-if="!!label"
      :for="id"
      class="text-defaults-secondary-text-secondary pretendard-16Medium"
      >{{ label }}</label
    >
    <input
      :id="id"
      :name="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :required="required"
      :disabled="disabled"
      :class="`rounded-md border bg-defaults-primary-background-mono px-4 py-3 placeholder:text-defaults-secondary-text-secondary disabled:bg-charts-chart-mono ${meta?.valid ? 'border-alerts-success-border-success shadow-[0px_0px_0px_3px_rgba(209,250,223,1.00)]' : ''} ${!!error ? 'border-alerts-error-border-error shadow-[0px_0px_0px_3px_rgba(254,228,226,1.00)]' : ''} ${!meta?.valid && !error ? 'border-defaults-primary-border-primary hover:border-defaults-hover-border-hover hover:shadow-[0px_0px_0px_3px_rgba(243,244,246,1.00)] focus:border-brand-focus-border-brand-focus focus:shadow-[0px_0px_0px_3px_rgba(155,183,246,1.00)]' : ''} ${convertSize} ${classInputCustom}`"
      @input="handleChange"
    />
    <p v-if="!!error" class="text-alerts-error-text-error pretendard-14Regular">
      {{ error }}
    </p>
    <p
      v-else-if="!!hint"
      class="text-defaults-tertiary-text-tertiary pretendard-14Regular"
    >
      {{ hint }}
    </p>
  </div>
</template>
