<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';

  const emits = defineEmits(['close', 'createInOutHistorySubmit']);

  const closeModal = () => {
    emits('close');
  };

  const createSubmit = () => {
    emits('createInOutHistorySubmit');
    closeModal();
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[300px] max-w-[400px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">입출차 정보를 생성하시겠습니까?</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          세대 방문 차량(일반, 방문예약, 항상허용)으로 등록 시 해당 세대에
          생성된 주차시간만큼 마일리지가 차감됩니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          color="primary"
          size="md"
          class="flex"
          @click="createSubmit"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
