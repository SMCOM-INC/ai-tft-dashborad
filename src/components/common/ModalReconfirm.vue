<script setup>
  import IconTrashLineRed from '@assets/icons/icon-trash-line-red.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { Field, useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';

  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import { reconfirmStringInputSchema } from '@/schemas/common.js';

  const props = defineProps({
    triggerButtonName: { type: String, required: true },
    title: { type: String, required: true },
    paragraph: { type: String, required: true },
    placeholder: { type: String, required: false, default: '' },
    fieldId: { type: String, required: false, default: '' },
    outlined: { type: Boolean, required: false, default: true },
    color: {
      type: String,
      required: true,
      validator(value) {
        return ['red', 'deepBlue', 'lightGray'].includes(value);
      },
    },
    icon: { type: String, required: false, default: '' },
    closeButtonName: { type: String, required: true },
    closeButtonHandler: { type: Function, required: false, default: () => {} },
    isLoading: { type: Boolean, required: false, default: false },
    error: { type: String, required: false, default: '' },
    isError: { type: Boolean, required: false, default: false },
  });

  const modalRef = ref(null);

  const triggerButtonColor = computed(() => {
    if (props.color === 'red') return 'destructive-outlined';
    if (props.color === 'deepBlue') return 'primary';
    return 'secondary-fill';
  });

  const submitButtonColor = computed(() => {
    return props.color === 'red' ? 'destructive' : 'primary';
  });

  const { errors, resetForm, setFieldError } = useForm({
    validationSchema: toTypedSchema(
      reconfirmStringInputSchema(props.fieldId, props.placeholder),
    ),
    validationMode: 'onSubmit',
  });

  const handleOpenModal = () => {
    if (modalRef.value) {
      modalRef.value.openModal();
      setTimeout(() => {
        const inputElement = document.getElementById(props.fieldId);
        if (inputElement) {
          inputElement.focus();
        }
      }, 10);
    }
  };

  const handleFormSubmit = () => {
    swalConfirmModal({
      text: `${props.title}`,
      callback: async () => {
        try {
          // API 호출
          await props.closeButtonHandler();

          resetForm();
          modalRef.value.closeModal();
        } catch (err) {
          setFieldError(props.fieldId, err.message);
        }
      },
    });
  };

  watch(
    () => props.isError,
    (newVal) => {
      if (newVal) {
        swalErrorModal({
          text: props.error,
        });
      }
    },
  );
</script>

<template>
  <ModalBase
    ref="modalRef"
    :has-form="true"
    form-id="reconfirmForm"
    :title="props.title"
    @form-submit="handleFormSubmit"
  >
    <template #button>
      <button
        v-if="!props.outlined"
        type="button"
        :class="`flex flex-nowrap items-center px-3 py-2 font-medium ${
          props.color === 'red' ? ' text-destructive-100' : 'text-primary-100'
        }`"
      >
        <IconTrashLineRed
          v-if="props.icon === 'trash'"
          class="mr-1 h-4 w-4"
          alt="삭제"
        />
        {{ props.triggerButtonName }}
      </button>
      <ButtonBase
        v-else
        type="button"
        :color="triggerButtonColor"
        @click="handleOpenModal"
      >
        <span class="flex flex-nowrap items-center">
          <IconTrashLineRed
            v-if="props.icon === 'trash'"
            class="mr-1 h-4 w-4"
            alt="삭제"
          />
          {{ props.triggerButtonName }}
        </span>
      </ButtonBase>
    </template>
    <template #modalBody>
      <div class="flex flex-col gap-4">
        <p class="break-all text-muted-foreground-100">
          {{ props.paragraph }}
        </p>
        <Field
          :id="props.fieldId"
          type="text"
          :name="props.fieldId"
          :placeholder="props.placeholder"
          class="w-full rounded-md border px-3 py-2"
        />
      </div>
      <TextError v-if="errors[props.fieldId]">{{
        errors[props.fieldId]
      }}</TextError>
    </template>
    <template #submitButton>
      <div class="flex gap-2">
        <ButtonBase
          type="submit"
          color="secondary-fill"
          @click="modalRef.closeModal()"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="reconfirmForm"
          type="submit"
          :color="submitButtonColor"
          :disabled="errors[props.fieldId] ? true : false"
          custom-class="w-full"
        >
          <div v-if="isLoading" class="flex items-center justify-center gap-2">
            <span>처리중..</span>
            <SpinnerWhiteView />
          </div>
          <div v-else class="w-full">{{ closeButtonName }}</div>
        </ButtonBase>
      </div>
    </template>
  </ModalBase>
</template>
