<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';

  defineProps({
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
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
    <div class="w-[400px] space-y-4 p-6">
      <div class="space-y-2">
        <p class="pretendard-18Medium">{{ title }}</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          {{ message }}
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          @click="closeModal"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
