<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import usePatchStoreChargeCancel from '@/lib/queries/store/usePatchStoreChargeCancel.js';

  const props = defineProps({
    uuid: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const closeModal = () => {
    emits('close');
  };

  const {
    patchStoreChargeCancelMutationAsync,
    isPatchStoreChargeCancelPending,
  } = usePatchStoreChargeCancel();

  const cancelCharge = async () => {
    await patchStoreChargeCancelMutationAsync({ chargeUuid: props.uuid });
    closeModal();
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[400px] space-y-4 p-6">
      <div class="space-y-2">
        <p class="pretendard-18Medium">취소 처리 하시겠습니까?</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          취소가 완료되면 충전 요청한 주차 시간은 취소되며, 사용자는 다시 충전을
          신청해야 합니다.
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
          type="submit"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isPatchStoreChargeCancelPending"
          @click="cancelCharge"
        >
          <SpinnerCircle v-if="isPatchStoreChargeCancelPending" />
          <template v-else>취소 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
