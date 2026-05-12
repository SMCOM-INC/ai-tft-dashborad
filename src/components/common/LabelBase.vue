<script setup>
  const props = defineProps({
    labelFor: {
      type: String,
      required: true,
    },
    labelText: {
      type: String,
      required: false,
      default: '',
    },
    asterisk: {
      type: Boolean,
      required: false,
    },
    class: {
      type: String,
      required: false,
      default: '',
    },
  });
</script>

<template>
  <label
    :class="`flex flex-col gap-2 text-sm ${props.class}`"
    :for="props.labelFor"
  >
    <span
      v-if="props.labelText"
      :class="`select-none whitespace-nowrap text-sm font-medium leading-none`"
    >
      {{ props.labelText }}
      <span v-if="props.asterisk">*</span>
    </span>
    <slot></slot>
  </label>
</template>
