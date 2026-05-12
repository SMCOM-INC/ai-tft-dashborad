<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  defineProps({
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const emits = defineEmits(['close', 'delete']);

  // 삭제 모달
  const closeDeleteModal = () => {
    emits('close');
  };

  const deleteInOut = () => {
    emits('delete');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[400px] space-y-4 p-6">
      <div class="space-y-2">
        <p class="pretendard-18Medium">입출차 내역 삭제</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          선택한 입출차 내역을 삭제 하시겠습니까? <br />
          삭제 이후에는 복구할 수 없습니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isLoading"
          @click="closeDeleteModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="submit"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isLoading"
          @click="deleteInOut"
        >
          <SpinnerCircle v-if="isLoading" />
          <template v-else>삭제 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
