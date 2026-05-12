<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TextError from '@components/common/TextError.vue';
  import { useForm } from 'vee-validate';
  import { watch } from 'vue';

  import { ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES } from '@/constants/member.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import usePatchResidentState from '@/lib/queries/member/usePatchResidentState.js';
  import { residentWaitingConfirmInputSchema } from '@/schemas/member.js';

  const props = defineProps({
    residentName: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const { getParams } = useNavigate();

  const {
    patchResidentStateMutationAsync,
    isPatchResidentStatePending,
    isPatchResidentStateError,
  } = usePatchResidentState();

  const { defineField, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: residentWaitingConfirmInputSchema(props.residentName),
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
    await patchResidentStateMutationAsync({
      residentUuid: getParams().uuid,
      residentState: ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES.WAITING,
    });

    closeModal();
  });

  watch(isPatchResidentStateError, (newValue) => {
    if (newValue) {
      closeModal();
    }
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <form id="waitingForm" class="mb-4 space-y-2" @submit="onSubmit">
        <div class="space-y-2">
          <p class="pretendard-18Medium">
            정말로 대기 상태로 변경 하시겠습니까?
          </p>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            대기 상태에서는 앱을 사용할 수 없습니다. 대기 상태로 변경할 회원
            이름을 정확하게 입력해주세요.
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
          :disabled="isPatchResidentStatePending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="waitingForm"
          type="submit"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isPatchResidentStatePending"
        >
          <SpinnerCircle v-if="isPatchResidentStatePending" />
          <template v-else>대기 상태로 변경</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
