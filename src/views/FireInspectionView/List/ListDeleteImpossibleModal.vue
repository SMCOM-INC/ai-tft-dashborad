<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';

  const emits = defineEmits(['close']);

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">진행중인 점검은 삭제가 불가합니다.</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          삭제는 점검 기간 종료 후 가능합니다.
        </p>
      </div>
      <div class="flex justify-end">
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="md"
          class="items-end"
          @click="closeModal"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
