<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '입력할 값을 쉼표로 구분하여 입력해주세요',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const inputValue = ref('');
  const chips = ref(props.modelValue || []);
  const inputRef = ref(null);

  const emitUpdate = () => {
    emit('update:modelValue', chips.value);
  };

  const addChip = () => {
    const trimmedValue = inputValue.value.trim();
    if (trimmedValue && !chips.value.includes(trimmedValue)) {
      chips.value.push(trimmedValue);
      inputValue.value = '';
      emitUpdate();
    }
  };

  const removeChip = (index) => {
    chips.value.splice(index, 1);
    emitUpdate();
  };

  const onInput = (e) => {
    inputValue.value = e.target.value;
  };

  const onKeydown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addChip();
    } else if (
      e.key === 'Backspace' &&
      inputValue.value === '' &&
      chips.value.length > 0
    ) {
      removeChip(chips.value.length - 1);
    }
  };

  const onBlur = () => {
    addChip();
  };

  const focusInput = () => {
    inputRef.value.focus();
  };

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        chips.value = newValue;
      }
    },
  );
</script>
<template>
  <div class="chip-input relative">
    <div
      class="flex w-full flex-wrap items-center gap-1 rounded-md border px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500"
      @click="focusInput"
    >
      <div
        v-for="(chip, index) in chips"
        :key="index"
        class="flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-sm"
      >
        <span>{{ chip }}</span>
        <button
          class="ml-1 text-gray-600 hover:text-gray-800 focus:outline-none"
          type="button"
          @click.stop="removeChip(index)"
        >
          &times;
        </button>
      </div>
      <input
        ref="inputRef"
        :value="inputValue"
        class="flex-grow bg-transparent py-1 outline-none"
        :placeholder="chips.length === 0 ? placeholder : ''"
        @input="onInput"
        @keydown="onKeydown"
        @blur="onBlur"
      />
    </div>
    <p class="pt-2 text-xs leading-5 text-muted-foreground-100">
      {{ placeholder }}
    </p>
  </div>
</template>

<style scoped>
  .chip-input input::placeholder {
    color: #9ca3af;
  }
</style>
