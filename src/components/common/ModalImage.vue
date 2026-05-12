<!-- ImageViewerModal.vue -->
<script setup>

  import IconChevronLeft from '@assets/icons/icon-chevron-left-black.svg';
  import IconChevronRight from '@assets/icons/icon-chevron-right-black.svg';
  import IconClose from '@assets/icons/icon-close-black.svg';
  import { ref, watch } from 'vue';

  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      default: () => [],
    },
    imageIndex: {
      type: Number,
      default: 0,
    },
  });

  const emits = defineEmits(['close']);

  const currentIndex = ref(props.imageIndex);

  const closeModal = () => {
    emits('close');
  };

  const previousImage = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };

  const nextImage = () => {
    if (currentIndex.value < props.images.length - 1) {
      currentIndex.value++;
    }
  };

  watch(
    () => props.imageIndex,
    (newIndex) => {
      currentIndex.value = newIndex;
    },
    { immediate: true },
  );
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-[0px] z-[1000] flex items-center justify-center bg-black bg-opacity-75 transition-all"
    @click="closeModal"
  >
    <!-- 닫기 버튼 -->
    <button
      type="button"
      class="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-dark-200 p-2 text-white"
      @click="closeModal"
    >
      <IconClose class="h-10 w-10" />
    </button>

    <!-- 이미지 컨테이너 -->
    <div class="relative max-h-[80vh] max-w-[60vw] overflow-hidden" @click.stop>
      <!-- 이미지 내비게이션 버튼 -->
      <button
        v-if="currentIndex > 0"
        type="button"
        class="absolute left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-dark-200 p-2 text-white"
        @click="previousImage"
      >
        <IconChevronLeft class="h-7 w-7" />
      </button>

      <!-- 이미지 -->
      <img
        :src="getFullImageUrl(images[currentIndex]?.fileUrl)"
        class="max-h-[90vh] max-w-full object-contain"
        :alt="`${images[currentIndex]?.fileUrl.split('/').at(-1)} 확대된 이미지`"
      />

      <!-- 이미지 내비게이션 버튼 -->
      <button
        v-if="currentIndex < images.length - 1"
        type="button"
        class="absolute right-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-dark-200 p-2 text-white"
        @click="nextImage"
      >
        <IconChevronRight class="h-7 w-7" />
      </button>

      <!-- 이미지 인디케이터 -->
      <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <div
          v-for="(_, index) in images"
          :key="index"
          :class="[
            'h-2 w-2 rounded-full',
            currentIndex === index ? 'bg-white' : 'bg-gray-400',
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>
