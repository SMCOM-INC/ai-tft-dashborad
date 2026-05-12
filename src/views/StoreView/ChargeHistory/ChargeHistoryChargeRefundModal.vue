<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import usePatchStoreChargeRefund from '@/lib/queries/store/usePatchStoreChargeRefund.js';

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
    patchStoreChargeRefundMutationAsync,
    isPatchStoreChargeRefundPending,
  } = usePatchStoreChargeRefund();

  const refundCharge = async () => {
    await patchStoreChargeRefundMutationAsync({ chargeUuid: props.uuid });
    closeModal();
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[400px] space-y-4 p-6">
      <div class="space-y-2">
        <p class="pretendard-18Medium">환불 처리 하시겠습니까?</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          환불이 완료되면 충전된 주차 시간은 자동 회수되며, 이후 복구가
          불가합니다.
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
          :disabled="isPatchStoreChargeRefundPending"
          @click="refundCharge"
        >
          <SpinnerCircle v-if="isPatchStoreChargeRefundPending" />
          <template v-else>환불 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
