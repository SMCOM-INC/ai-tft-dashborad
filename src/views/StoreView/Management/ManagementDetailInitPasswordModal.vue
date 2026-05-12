<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import usePatchInitPassword from '@/lib/queries/store/usePatchInitPassword.js';

  const props = defineProps({
    storeId: {
      type: String,
      required: true,
    },
  });
  const emits = defineEmits(['close']);

  const { patchInitPasswordMutationAsync, isPatchInitPasswordPending } =
    usePatchInitPassword();

  const closeModal = () => {
    emits('close');
  };

  const initPassword = async () => {
    await patchInitPasswordMutationAsync({ password: props.storeId });
    closeModal();
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[400px] rounded-lg bg-white p-6">
      <div class="mb-4 space-y-2">
        <h2 class="pretendard-18Medium">비밀번호를 초기화하시겠습니까?</h2>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          비밀번호가
          <span class="pretendard-14Bold">{{ storeId }}</span>
          으로 초기화됩니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          variants="filled"
          round-type="round"
          color="secondary"
          :height="40"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="confirmForm"
          type="button"
          variants="filled"
          round-type="round"
          color="destructive"
          :height="40"
          :disabled="isPatchInitPasswordPending"
          class="flex items-center gap-2"
          @click="initPassword"
        >
          <SpinnerCircle v-if="isPatchInitPasswordPending" />
          <template v-else>초기화</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
