<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputText from '@components/common/InputText.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';
  import { onMounted } from 'vue';

  import usePatchVoteTitle from '@/lib/queries/vote/usePatchVoteTitle.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { voteEditVoteFormSchema } from '@/schemas/vote.js';

  const props = defineProps({
    voteUuid: {
      type: String,
      required: false,
      default: '',
    },
    voteTitle: {
      type: String,
      required: false,
      default: '',
    },
  });

  const emits = defineEmits(['close']);

  const { patchVoteTitleMutationAsync, isPatchVoteTitlePending } =
    usePatchVoteTitle();

  const { meta, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: voteEditVoteFormSchema,
  });

  const closeGroupModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (values) => {
    await patchVoteTitleMutationAsync({
      voteUuid: props.voteUuid,
      title: values.title,
    });

    closeGroupModal();
  });

  onMounted(() => {
    setFieldValue('title', decodeUrl(props.voteTitle));
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[672px]">
      <div
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-20Bold">투표명 수정하기</h1>
        <button
          type="button"
          :disabled="isPatchVoteTitlePending"
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
            :disabled="isPatchVoteTitlePending"
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
            :disabled="isPatchVoteTitlePending"
          >
            <SpinnerCircle v-if="isPatchVoteTitlePending" class="mx-auto" />
            <template v-else>수정하기</template>
          </ButtonBase>
        </div>
      </div>
    </div>
  </ModalBaseNew>
</template>
