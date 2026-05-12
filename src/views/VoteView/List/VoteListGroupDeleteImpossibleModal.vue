<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';

  const emits = defineEmits(['close']);

  const closeGroupModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">
          하위 리스트가 존재하여 그룹 삭제가 불가합니다.
        </p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          삭제가 불가합니다. 하위 내용을 먼저 삭제해 주세요.
        </p>
      </div>
      <div class="flex justify-end">
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="md"
          class="items-end"
          @click="closeGroupModal"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
