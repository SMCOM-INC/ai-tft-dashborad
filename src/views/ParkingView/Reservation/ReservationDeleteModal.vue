<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { watch } from 'vue';

  import useDeleteReservation from '@/lib/queries/parkingReservation/useDeleteReservation.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  const emits = defineEmits(['close']);

  const {
    deleteReservationMutation,
    isDeleteReservationPending,
    isDeleteReservationSuccess,
  } = useDeleteReservation();

  const deleteReservation = () => {
    if (props.data.selectedRows.length > 0) {
      const reservationUuidList = props.data.selectedRows.map(
        (item) => item.uuid,
      );
      deleteReservationMutation({ reservationUuidList });
    }
  };

  const closeModal = () => {
    emits('close');
  };

  watch(
    () => isDeleteReservationSuccess.value,
    (newValue) => {
      if (newValue) {
        closeModal();
      }
    },
  );
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">
          선택한 방문예약 차량을 삭제 하시겠습니까?
        </p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          삭제 이후에는 복구할 수 없습니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isDeleteReservationPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isDeleteReservationPending"
          @click="deleteReservation"
        >
          <SpinnerCircle v-if="isDeleteReservationPending" class="mr-2" />
          <template v-else>삭제</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
