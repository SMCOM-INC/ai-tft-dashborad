<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import { ref, watch } from 'vue';

  import usePostAptHo from '@/lib/queries/apt/usePostAptHo.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import { createHouseholdAddHouseValidationSchema } from '@/schemas/apt.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const props = defineProps({
    dongName: {
      type: String,
      required: true,
    },
    lineName: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['before-open']);

  const { userInfo } = useUserInfoStore();

  const {
    createHoMutation,
    isCreateHoPending,
    isCreateHoSuccess,
    resetCreateHo,
  } = usePostAptHo();

  const addHouseModalRef = ref(null);

  const { errors, resetForm, handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(createHouseholdAddHouseValidationSchema),
  });

  const [floorName] = defineField('floorName');

  const openModal = () => {
    addHouseModalRef.value?.openModal();
  };

  const closeModal = () => {
    resetForm();
    addHouseModalRef.value?.closeModal();
  };

  const onSubmit = handleSubmit((values) => {
    swalConfirmModal({
      text: `세대를 추가하시겠습니까? ${props.dongName}동 ${props.lineName}라인 ${values.floorName}층`,
      callback: () => {
        createHoMutation({
          aptUuid: userInfo.aptUuid,
          payload: {
            floorName: String(values.floorName),
            dongName: props.dongName,
            lineName: props.lineName,
          },
        });
      },
    });
  });

  watch(isCreateHoSuccess, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      closeModal();
      resetCreateHo();
    }
  });

  defineExpose({
    openModal,
    closeModal,
  });
</script>

<template>
  <ModalBase
    ref="addHouseModalRef"
    title="호수 개별 추가"
    :has-form="true"
    form-id="addHouseForm"
    :is-loading="isCreateHoPending"
    @form-submit="onSubmit"
    @close-modal="resetForm"
  >
    <template #button>
      <ButtonBase type="button" color="primary" @click="emit('before-open')">
        호수 개별 추가
      </ButtonBase>
    </template>
    <template #modalBody>
      <div class="flex flex-col">
        <div class="flex w-full gap-4">
          <input
            type="text"
            :value="`${dongName}동`"
            disabled
            class="w-1/2 rounded-md border bg-gray-100 px-3 py-2"
          />
          <input
            type="text"
            :value="`${lineName}라인`"
            disabled
            class="w-1/2 rounded-md border bg-gray-100 px-3 py-2"
          />
        </div>
        <input
          v-model="floorName"
          type="text"
          inputmode="numeric"
          placeholder="해당 동·라인에 추가할 층수를 입력해주세요."
          class="mt-2 w-full rounded-md border px-3 py-2"
        />
        <TextError v-if="errors.floorName">
          {{ errors.floorName }}
        </TextError>
      </div>
    </template>
    <template #submitButton>
      <ButtonBase
        form="addHouseForm"
        type="submit"
        color="primary"
        size="lg"
        :disabled="isCreateHoPending"
        class="flex w-full justify-center"
      >
        <SpinnerCircle v-if="isCreateHoPending" />
        <template v-else>추가하기</template>
      </ButtonBase>
    </template>
  </ModalBase>
</template>
