<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    type: {
      type: String,
      required: true,
      default: 'text',
    },
    modelValue: {
      type: String,
      required: false,
      default: '',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    maxLength: {
      type: Number,
      required: false,
      default: Number.MAX_SAFE_INTEGER,
    },
  });

  const emits = defineEmits(['update:modelValue']);

  const rows = ref(1);

  const calculateRows = (value) => {
    const lineCount = (value.match(/\n/g) || []).length + 1;
    return lineCount;
  };

  const handleInput = (event) => {
    emits('update:modelValue', event.target.value);
    if (props.type === 'textarea') {
      rows.value = calculateRows(event.target.value);
    }
  };

  defineExpose({
    focus: () => {
      if (props.type === 'textarea') {
        const input = document.querySelector('textarea');
        if (input) {
          input.focus();
          return;
        }
      } else {
        const textarea = document.querySelector('input');
        if (textarea) {
          textarea.focus();
        }
      }
    },
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (props.type === 'textarea') {
        rows.value = calculateRows(newValue);
      }
    },
    { immediate: true },
  );
</script>

<template>
  <textarea
    v-if="props.type === 'textarea'"
    class="border-input-100 rounded-md border bg-background-100 px-3 py-2 text-sm text-foreground-100 placeholder:text-muted-foreground-100 focus:border-blue-500"
    :value="props.modelValue"
    :name="props.name"
    :maxlength="props.maxLength"
    :rows="rows"
    @input="handleInput"
  ></textarea>
  <input
    v-else
    class="border-input-100 h-10 whitespace-nowrap rounded-md border bg-background-100 px-3 text-sm text-foreground-100 placeholder:text-muted-foreground-100"
    :value="props.modelValue"
    :type="props.type"
    :name="props.name"
    :maxlength="props.maxLength"
    @input="handleInput"
  />
</template>
