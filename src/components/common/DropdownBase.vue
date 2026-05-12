<script setup>
  import { onClickOutside } from '@vueuse/core';
  import { ref } from 'vue';

  const props = defineProps({
    buttonList: { type: Array, required: true },
    rowData: { type: Object, required: false, default: undefined },
  });

  const menuContainer = ref(null);
  const isButtonListOpen = ref(false);

  const handleButtonClick = () => {
    isButtonListOpen.value = !isButtonListOpen.value;
  };

  // 드롭다운 영역 외부 클릭 시 드롭다운 닫기
  onClickOutside(menuContainer, () => {
    isButtonListOpen.value = false;
  });

  const handleButtonAction = (handler) => {
    if (props.rowData) {
      handler(props.rowData);
    } else {
      handler();
    }

    isButtonListOpen.value = false;
  };
</script>

<template>
  <div ref="menuContainer" class="relative">
    <div @click="handleButtonClick">
      <slot name="button"></slot>
    </div>
    <ul
      v-if="isButtonListOpen"
      class="border-input-100 absolute right-0 top-12 z-50 flex w-fit flex-col items-end rounded-md border bg-background-100 shadow-md"
    >
      <li>
        <button
          v-for="(button, index) in buttonList"
          :key="button.label"
          type="button"
          :class="`w-full text-nowrap px-5 py-[10px] text-left text-sm hover:bg-secondary-80 ${button.color} ${index === buttonList.length - 1 ? undefined : 'border-b border-dark-100'}`"
          @click="handleButtonAction(button.handler)"
        >
          {{ button.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
