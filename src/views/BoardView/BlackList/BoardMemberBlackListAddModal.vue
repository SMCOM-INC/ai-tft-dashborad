<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalFieldTextarea from '@components/common/ModalFieldTextarea.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';

  import usePostMemberBlackListAdd from '@/lib/queries/boardBlacklist/usePostMemberBlackListAdd.js';
  import { boardBlackListFormSchema } from '@/schemas/board.js';

  const props = defineProps({
    data: { type: Object, required: false, default: null },
  });

  const emits = defineEmits(['close']);

  const { errors, handleSubmit } = useForm({
    validationSchema: boardBlackListFormSchema,
  });

  const { postMemberBlackListAddMutation, isAddMemberBlackListPending } =
    usePostMemberBlackListAdd();

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (submitValue) => {
    await postMemberBlackListAddMutation({
      communityUuid: props.data.uuid,
      reason: submitValue.reason,
    });

    closeModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="max-h-[80vh] w-[400px] space-y-4 overflow-y-auto p-6">
      <div class="space-y-2">
        <p class="pretendard-18Medium">블랙리스트 등록 하시겠습니까?</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          해당 작성자를 블랙리스트로 등록합니다.
        </p>
      </div>
      <form
        id="createMemberBlackListForm"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <ModalFieldTextarea id="reason" label="사유" :errors="errors" />
      </form>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isAddMemberBlackListPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="createMemberBlackListForm"
          type="submit"
          color="primary"
          size="md"
          class="flex items-center"
          :disabled="isAddMemberBlackListPending"
          @click="onSubmit"
        >
          <SpinnerCircle v-if="isAddMemberBlackListPending" />
          <template v-else>등록 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
