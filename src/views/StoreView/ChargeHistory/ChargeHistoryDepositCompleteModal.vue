<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import usePatchStoreChargeComplete from '@/lib/queries/store/usePatchStoreChargeComplete.js';

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
    patchStoreChargeCompleteMutationAsync,
    isPatchStoreChargeCompletePending,
  } = usePatchStoreChargeComplete();

  const completeDeposit = async () => {
    await patchStoreChargeCompleteMutationAsync({ chargeUuid: props.uuid });
    closeModal();
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[400px] space-y-4 p-6">
      <div class="space-y-2">
        <p class="pretendard-18Medium">입금 완료 처리하시겠습니까?</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          처리 후 상태 변경 및 취소가 불가하니, 금액과 정보를 다시 한 번
          확인해주세요.
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
          color="primary"
          size="md"
          class="flex"
          :disabled="isPatchStoreChargeCompletePending"
          @click="completeDeposit"
        >
          <SpinnerCircle v-if="isPatchStoreChargeCompletePending" />
          <template v-else>입금 완료 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
