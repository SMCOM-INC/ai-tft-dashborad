<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';

  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  defineProps({
    info: {
      type: Object,
      required: true,
    },
  });
  const emits = defineEmits(['close']);

  const closeModal = () => {
    emits('close');
  };
</script>
<template>
  <ModalBaseNew>
    <div class="min-w-[440px]">
      <div
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-20Bold">서명보기</h1>
        <button type="button" @click="closeModal">
          <CloseIcon class="h-5 w-5" />
        </button>
      </div>
      <div class="px-6 py-8">
        <img
          :src="getFullImageUrl(info?.signFileUrl)"
          :alt="`${info?.name} 서명이미지`"
        />
      </div>
    </div>
  </ModalBaseNew>
</template>
