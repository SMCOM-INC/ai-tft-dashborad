<script setup>
  import KebabMenuIcon from '@assets/icons/icon-kebabMenu-black.svg';
  import { onClickOutside } from '@vueuse/core';
  import { ref } from 'vue';


  const props = defineProps({
    buttonList: {
      type: Array,
      required: true,
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
  });

  const containerRef = ref(null);
  const isOpen = ref(false);

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const handleAction = (handler) => {
    if (typeof handler === 'function') {
      handler(props.rowData);
    }
    isOpen.value = false;
  };

  // 바깥 클릭 시 닫기
  onClickOutside(containerRef, () => {
    isOpen.value = false;
  });
</script>

<template>
  <div ref="containerRef" class="relative inline-block">
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-md border border-dark-100 p-2 shadow-sm hover:bg-secondary-80"
      @click.stop="toggleDropdown"
    >
      <KebabMenuIcon class="h-4 w-4" aria-hidden="true" />
    </button>

    <ul
      v-if="isOpen"
      class="absolute right-0 top-12 z-50 w-max rounded-md border border-dark-100 bg-background-100 shadow-md"
    >
      <li
        v-for="(button, index) in buttonList"
        :key="button.label"
        class="w-full text-sm hover:bg-secondary-80"
      >
        <button
          type="button"
          class="w-full px-5 py-2 text-left"
          :class="[
            button.color,
            index < buttonList.length - 1 ? 'border-b border-dark-100' : '',
          ]"
          @click="handleAction(button.handler)"
        >
          {{ button.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
