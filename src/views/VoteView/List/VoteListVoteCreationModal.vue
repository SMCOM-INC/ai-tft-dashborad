<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputText from '@components/common/InputText.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import VoteType from '@views/VoteView/VoteType.vue';
  import { useForm } from 'vee-validate';

  import usePostVote from '@/lib/queries/vote/usePostVote.js';
  import { voteCreateVoteFormSchema } from '@/schemas/vote.js';

  const props = defineProps({
    groupUuid: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const { createVoteMutationAsync, isCreateVotePending } = usePostVote();

  const { meta, handleSubmit, errors } = useForm({
    validationSchema: voteCreateVoteFormSchema,
  });

  const closeGroupModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (values) => {
    await createVoteMutationAsync({
      groupUuid: props.groupUuid,
      title: values.title,
      voteType: values.voteType,
    });

    closeGroupModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[672px]">
      <div
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-20Bold">투표 생성하기</h1>
        <button
          type="button"
          :disabled="isCreateVotePending"
          @click="closeGroupModal"
        >
          <CloseIcon class="h-5 w-5" />
        </button>
      </div>
      <form
        id="createGroupForm"
        class="flex flex-col gap-6 p-6"
        @submit="onSubmit"
      >
        <InputText
          id="title"
          type="text"
          size="lg"
          label="투표 제목"
          placeholder="제목을 입력해 주세요."
          :error="errors.title"
          :meta="meta"
        />
        <!-- 투표 유형 -->
        <VoteType :errors="errors" />
      </form>
      <div
        :class="`flex justify-end gap-2 px-6 py-4 shadow-[0_-2px_3px_0px_rgba(0,0,0,0.1)]`"
      >
        <div class="flex gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            size="md"
            class="min-w-[80px]"
            :disabled="isCreateVotePending"
            @click="closeGroupModal"
          >
            취소
          </ButtonBase>
          <ButtonBase
            form="createGroupForm"
            type="submit"
            :color="meta.valid ? 'primary' : 'primary-disabled'"
            size="md"
            :class="`flex w-20 items-center justify-between gap-2`"
            :disabled="isCreateVotePending"
          >
            <SpinnerCircle v-if="isCreateVotePending" class="mx-auto" />
            <template v-else> 생성하기 </template>
          </ButtonBase>
        </div>
      </div>
    </div>
  </ModalBaseNew>
</template>
