<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TextError from '@components/common/TextError.vue';
  import { useForm } from 'vee-validate';
  import { watch } from 'vue';

  import useDeleteResident from '@/lib/queries/member/useDeleteResident.js';
  import { memberDeleteConfirmInputSchema } from '@/schemas/member.js';

  const props = defineProps({
    residentName: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const {
    deleteResidentMutationAsync,
    isDeleteResidentPending,
    isDeleteResidentError,
  } = useDeleteResident();

  const { defineField, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: memberDeleteConfirmInputSchema(props.residentName),
  });

  const [confirmationText] = defineField('confirmationText');

  const closeModal = () => {
    emits('close');
  };

  // 한글 IME 이슈 해결
  const onInput = (event) => {
    setFieldValue('confirmationText', event.target.value);
  };

  const onSubmit = handleSubmit(async () => {
    await deleteResidentMutationAsync();
    closeModal();
  });

  watch(isDeleteResidentError, (newValue) => {
    if (newValue) {
      closeModal();
    }
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <form id="deleteForm" class="mb-4 space-y-2" @submit="onSubmit">
        <div class="space-y-2">
          <p class="pretendard-18Medium">해당 회원을 전출 처리 하시겠습니까?</p>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            전출 처리 후 복구될 수 없습니다. 해당 세대에서만 전출 처리 되며,
            탈퇴는 별도로 처리가 필요합니다. 전출 처리할 회원 이름을 정확하게
            입력해주세요.
          </p>
        </div>
        <div>
          <input
            :value="confirmationText"
            type="text"
            :placeholder="residentName"
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
          :disabled="isDeleteResidentPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="deleteForm"
          type="submit"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isDeleteResidentPending"
        >
          <SpinnerCircle v-if="isDeleteResidentPending" />
          <template v-else>전출 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
