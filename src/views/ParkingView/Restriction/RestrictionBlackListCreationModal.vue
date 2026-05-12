<script setup>
  import CloseIcon from '@assets/icons/icon-close-darkGray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalFieldCarNum from '@components/common/ModalFieldCarNum.vue';
  import ModalFieldTextarea from '@components/common/ModalFieldTextarea.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';

  import usePostBlackList from '@/lib/queries/parkingBlacklistReject/usePostBlackList.js';
  import { blackListCarFormSchema } from '@/schemas/parking.js';

  const emits = defineEmits(['close']);

  const { errors, handleSubmit } = useForm({
    validationSchema: blackListCarFormSchema,
  });

  const { postBlackListMutationAsync, isPostBlackListPending } =
    usePostBlackList();

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (submitValue) => {
    await postBlackListMutationAsync({
      carNum: submitValue.carNum,
      reason: submitValue.reason,
    });

    closeModal();
  });
</script>

<template>
  <!-- 삭제 확인 모달 -->
  <ModalBaseNew>
    <div class="max-h-[80vh] w-[400px] space-y-4 overflow-y-auto p-6">
      <header class="mb-4 flex items-center justify-between">
        <h1 class="select-none text-lg font-medium">블랙리스트 등록하기</h1>
        <button type="button" class="w-fit" @click="closeModal">
          <CloseIcon class="h-5" aria-hidden="true" />
        </button>
      </header>
      <form
        id="creationBlackListForm"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <ModalFieldCarNum :errors="errors" />
        <ModalFieldTextarea id="reason" label="사유" :errors="errors" />
      </form>
      <ButtonBase
        form="creationBlackListForm"
        type="submit"
        color="primary"
        custom-class="w-full"
        :disabled="isPostBlackListPending"
      >
        <div v-if="isPostBlackListPending" class="flex justify-center">
          <SpinnerCircle />
        </div>
        <template v-else>등록하기</template>
      </ButtonBase>
    </div>
  </ModalBaseNew>
</template>
