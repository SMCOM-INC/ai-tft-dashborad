<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TextError from '@components/common/TextError.vue';
  import { useIsMutating } from '@tanstack/vue-query';
  import { useForm } from 'vee-validate';

  import { surveyDateEditConfirmSchema } from '@/schemas/survey.js';

  const emits = defineEmits(['close', 'submit']);

  const isPatchVoteSubmitMutating = useIsMutating({
    mutationKey: ['patchVoteSubmit'],
  });

  const { defineField, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: surveyDateEditConfirmSchema,
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
    emits('submit');
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <form id="confirmChangeForm" class="mb-4 space-y-2" @submit="onSubmit">
        <div class="space-y-2">
          <p class="pretendard-18Medium">
            설문 일시 변경시, 현재 예약된 문자가 모두 삭제됩니다.
          </p>
          <p class="text-alerts-error-text-error pretendard-14Regular">
            삭제된 문자는 복구할 수 없으니, 변경 전 반드시 확인해 주세요.
          </p>
        </div>
        <div>
          <input
            :value="confirmationText"
            type="text"
            placeholder="변경하기"
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
          :disabled="isPatchVoteSubmitMutating > 0"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="confirmChangeForm"
          type="submit"
          color="destructive"
          size="md"
          class="flex items-center gap-2"
          :disabled="isPatchVoteSubmitMutating > 0"
        >
          <SpinnerCircle v-if="isPatchVoteSubmitMutating > 0" />
          <template v-else>변경</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
