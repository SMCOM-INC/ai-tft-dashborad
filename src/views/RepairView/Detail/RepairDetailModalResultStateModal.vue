<script setup>
  import CloseIcon from '@assets/icons/icon-close-darkGray.svg';
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
  const emits = defineEmits(['close', 'submit']);

  const closeModal = () => {
    emits('close');
  };

  const editState = () => {
    emits('submit');
    closeModal();
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[500px] max-w-[400px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <div class="flex justify-between">
          <p class="pretendard-18Medium">접수상태 수정</p>
          <button type="button" class="w-fit" @click="closeModal">
            <CloseIcon class="h-5" aria-hidden="true" />
          </button>
        </div>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          접수상태를 수정 하시겠습니까?
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary-fill"
          size="md"
          class="w-1/5"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          color="primary"
          size="md"
          class="flex w-4/5 justify-center"
          @click="editState"
        >
          <SpinnerCircle v-if="isLoading" />
          <template v-else>저장</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
