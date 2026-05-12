<script setup>
  import IconCheckmark from '@assets/icons/icon-checkmark-line-black.svg';
  import IconUpDown from '@assets/icons/icon-chevrons-up-down.svg';
  import { computed, ref } from 'vue';

  const props = defineProps({
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    optionList: {
      type: Array,
      required: true,
      default: () => [],
    },
    hasSelectBoxIcon: {
      type: Boolean,
      required: false,
      default: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const emits = defineEmits(['selectValue']);

  const selectedValue = computed({
    get: () => props.value,
    set: (newValue) => emits('selectValue', newValue),
  });

  const selectContainerRef = ref(null);
  const isOptionOpen = ref(false);

  const handleButtonClick = () => {
    isOptionOpen.value = !isOptionOpen.value;
  };

  const handleButtonBlur = (event) => {
    const isDisabledOptionClick =
      event.relatedTarget?.classList.contains('cursor-not-allowed');

    if (isDisabledOptionClick) {
      event.target.focus();
    } else if (
      !selectContainerRef.value ||
      !selectContainerRef.value.contains(event.relatedTarget)
    ) {
      isOptionOpen.value = false;
    }
  };

  const handleOptionClick = (option) => {
    if (option?.disabled) return;
    emits('selectValue', option);
    selectedValue.value = option;
    isOptionOpen.value = false;
  };
</script>

<template>
  <div ref="selectContainerRef" class="relative w-full">
    <button
      type="button"
      class="border-border text-foreground-scale-100 flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-4 py-2 font-medium disabled:bg-gray-100"
      :disabled="disabled"
      @click="handleButtonClick"
      @blur="handleButtonBlur"
    >
      <span class="min-w-0 truncate pr-2">{{
        selectedValue?.label || value.label
      }}</span>
      <IconUpDown v-if="hasSelectBoxIcon" class="shrink-0" />
    </button>
    <ul
      v-if="isOptionOpen"
      class="border-border absolute top-10 z-50 w-full rounded-md border bg-white p-1"
    >
      <li v-for="option in optionList" :key="option?.key">
        <button
          type="button"
          class="flex h-full w-full items-center justify-between px-3 py-1.5 text-left"
          :class="{
            'text-foreground-scale-500 cursor-not-allowed': option?.disabled,
          }"
          @click.stop="handleOptionClick(option)"
        >
          <span>{{ option?.label }}</span>
          <IconCheckmark v-if="option?.label === selectedValue?.label" />
        </button>
      </li>
    </ul>
  </div>
</template>
