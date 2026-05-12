<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TextError from '@components/common/TextError.vue';
  import { useForm } from 'vee-validate';

  import useDeleteFireInspection from '@/lib/queries/fireInspection/useDeleteFireInspection.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { fireInspectionDeleteFormSchema } from '@/schemas/fireInspection.js';

  const props = defineProps({
    inspectionUuid: {
      type: [Number, String],
      required: true,
    },
    inspectionTitle: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  // 점검 제목 디코딩
  const decodedTitle = decodeUrl(props.inspectionTitle);

  const { deleteFireInspectionMutationAsync, isDeleteFireInspectionPending } =
    useDeleteFireInspection();

  const { defineField, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: fireInspectionDeleteFormSchema({
      inspectionTitle: decodedTitle,
    }),
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
    await deleteFireInspectionMutationAsync({
      fireInspectionUuid: props.inspectionUuid,
    });

    closeModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <form id="deleteInspectionForm" class="mb-4 space-y-2" @submit="onSubmit">
        <div class="space-y-2">
          <p class="pretendard-18Medium">점검을 삭제하시겠습니까?</p>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            삭제하면 등록되었던 모든 내용이 함께 삭제되며, 이 작업은 되돌릴 수
            없습니다.
          </p>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            확인을 위해
            <strong class="pretendard-14Bold">{{ decodedTitle }}</strong
            >을(를) 입력해주세요.
          </p>
        </div>
        <div>
          <input
            :value="confirmationText"
            type="text"
            :placeholder="decodedTitle"
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
          :disabled="isDeleteFireInspectionPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="deleteInspectionForm"
          type="submit"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isDeleteFireInspectionPending"
        >
          <SpinnerCircle v-if="isDeleteFireInspectionPending" />
          <template v-else>삭제</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
