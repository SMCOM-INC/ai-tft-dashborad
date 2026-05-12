<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputText from '@components/common/InputText.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';

  import useDeleteStore from '@/lib/queries/store/useDeleteStore.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { storeManagementDeleteConfirmForm } from '@/schemas/store.js';

  const props = defineProps({
    storeName: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const { handleSubmit, errors, meta } = useForm({
    validationSchema: storeManagementDeleteConfirmForm(props.storeName),
  });

  const { deleteStoreMutation, isDeleteStorePending } = useDeleteStore();

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(() => {
    deleteStoreMutation();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="w-full max-w-[400px] rounded-lg bg-white p-6">
      <div class="space-y-2">
        <h2 class="pretendard-18Medium">상가를 퇴실처리 하시겠습니까?</h2>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          상가를 퇴실 처리하면 등록된 모든 정보가 영구적으로 삭제되며, 복구할 수
          없습니다.<br />계속 진행하시려면, 퇴실 처리할 상가명을 정확히
          입력해주세요.
        </p>
      </div>
      <form id="confirmForm" class="space-y-10" @submit="onSubmit">
        <InputText
          id="storeName"
          type="text"
          size="xl"
          :maxlength="30"
          :placeholder="decodeUrl(storeName)"
          :error="errors.storeName"
          class-custom="w-full my-4"
        />
      </form>
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
          type="submit"
          variants="filled"
          round-type="round"
          :height="40"
          :color="meta.valid ? 'destructive' : 'destructive-disabled'"
          :disabled="isDeleteStorePending"
          class="flex items-center gap-2"
        >
          <SpinnerCircle v-if="isDeleteStorePending" />
          <template v-else>퇴실 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
