<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputText from '@components/common/InputText.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';
  import { computed, onMounted } from 'vue';

  import usePatchVoteGroup from '@/lib/queries/vote/usePatchVoteGroup.js';
  import usePostVoteGroup from '@/lib/queries/vote/usePostVoteGroup.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { voteCreateGroupFormSchema } from '@/schemas/vote.js';

  const props = defineProps({
    modalType: {
      type: String,
      required: true,
    },
    groupInfo: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['close', 'delete']);

  const { createVoteGroupMutationAsync, isCreateVoteGroupPending } =
    usePostVoteGroup();

  const { updateVoteGroupMutationAsync, isUpdateVoteGroupPending } =
    usePatchVoteGroup();

  const { meta, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: voteCreateGroupFormSchema,
  });

  const isCreateType = computed(() => {
    return props.modalType === 'create';
  });

  const closeGroupModal = () => {
    emits('close');
  };

  const deleteGroupModal = () => {
    emits('delete', props.groupInfo);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (isCreateType.value) {
      await createVoteGroupMutationAsync({ groupName: values.groupName });
    } else {
      await updateVoteGroupMutationAsync({
        groupName: values.groupName,
        groupUuid: props.groupInfo.uuid,
      });
    }

    closeGroupModal();
  });

  onMounted(() => {
    if (props.modalType === 'edit') {
      setFieldValue('groupName', decodeUrl(props.groupInfo.title));
    }
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[672px]">
      <div
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-20Bold">
          그룹 {{ isCreateType ? '생성' : '정보 수정' }}하기
        </h1>
        <button
          type="button"
          :disabled="isCreateVoteGroupPending || isUpdateVoteGroupPending"
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
          id="groupName"
          type="text"
          size="lg"
          label="그룹명"
          placeholder="이름을 입력해 주세요."
          :error="errors.groupName"
          :meta="meta"
        />
      </form>
      <div
        :class="`flex gap-2 px-6 py-4 shadow-[0_-2px_3px_0px_rgba(0,0,0,0.1)] ${isCreateType ? 'justify-end' : 'justify-between'}`"
      >
        <ButtonBase
          v-if="!isCreateType"
          type="button"
          color="destructive-outlined"
          size="md"
          class="min-w-[100px]"
          :disabled="isCreateVoteGroupPending || isUpdateVoteGroupPending"
          @click="deleteGroupModal"
        >
          그룹 삭제하기
        </ButtonBase>
        <div class="flex gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            size="md"
            class="min-w-[80px]"
            :disabled="isCreateVoteGroupPending || isUpdateVoteGroupPending"
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
            :disabled="isCreateVoteGroupPending || isUpdateVoteGroupPending"
          >
            <SpinnerCircle
              v-if="isCreateVoteGroupPending || isUpdateVoteGroupPending"
              class="mx-auto"
            />
            <template v-else>
              {{ isCreateType ? '생성' : '수정' }}하기
            </template>
          </ButtonBase>
        </div>
      </div>
    </div>
  </ModalBaseNew>
</template>
