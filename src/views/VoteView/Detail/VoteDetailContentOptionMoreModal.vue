<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';

  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  defineProps({
    optionInfo: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['close']);

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div
      class="h-auto max-h-[70vh] min-h-[40vh] w-auto min-w-[40vw] max-w-[70vw] overflow-auto"
    >
      <div
        class="flex items-center justify-between gap-6 border-b border-defaults-primary-border-primary px-7 py-5"
      >
        <div class="pretendard-18SemiBold">
          {{ decodeUrl(optionInfo.content) }}
        </div>
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          @click="closeModal"
        >
          닫기
        </ButtonBase>
      </div>
      <ul
        class="flex h-[calc(100%-106px)] w-full flex-col items-center space-y-2 overflow-auto p-6"
      >
        <li v-for="file in optionInfo.fileList" :key="file.fileUuid">
          <img
            :src="getFullImageUrl(file.fileUrl)"
            :alt="file.fileName"
            class="max-w-[760px]"
          />
        </li>
      </ul>
    </div>
  </ModalBaseNew>
</template>
