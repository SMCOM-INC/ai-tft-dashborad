<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TextError from '@components/common/TextError.vue';
  import { useForm } from 'vee-validate';

  import useDeleteVote from '@/lib/queries/vote/useDeleteVote.js';
  import { voteDeleteVoteConfirmSchema } from '@/schemas/vote.js';

  const props = defineProps({
    voteUuid: {
      type: String,
      required: false,
      default: '',
    },
  });

  const emits = defineEmits(['close']);

  const { deleteVoteMutationAsync, isDeleteVotePending } = useDeleteVote();

  const { defineField, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: voteDeleteVoteConfirmSchema,
  });

  const [confirmationText] = defineField('confirmationText');

  const closeVoteDeleteModal = () => {
    emits('close');
  };

  // 한글 IME 이슈 해결
  const onInput = (event) => {
    setFieldValue('confirmationText', event.target.value);
  };

  const onSubmit = handleSubmit(async () => {
    await deleteVoteMutationAsync({ voteUuid: props.voteUuid });

    closeVoteDeleteModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <form id="deleteForm" class="mb-4 space-y-2" @submit="onSubmit">
        <div class="space-y-2">
          <p class="pretendard-18Medium">삭제하시겠습니까?</p>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            삭제하면 등록되었던 모든 내용이 함께 삭제되며, 이 작업은 되돌릴 수
            없습니다.
          </p>
        </div>
        <div>
          <input
            :value="confirmationText"
            type="text"
            placeholder="삭제하기"
            class="w-full rounded-md border px-3 py-2"
            @input="onInput"
          />
          <TextError>{{ errors.confirmationText }}</TextError>
        </div>
      </form>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isDeleteVotePending"
          @click="closeVoteDeleteModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="deleteForm"
          type="submit"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isDeleteVotePending"
        >
          <SpinnerCircle v-if="isDeleteVotePending" />
          <template v-else>삭제</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
