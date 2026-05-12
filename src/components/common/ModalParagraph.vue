<script setup>
  import IconErrorInfoRed from '@assets/icons/icon-errorInfo-red.svg';
  import IconTrashLineRed from '@assets/icons/icon-trash-line-red.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import SpinnerBlueView from '@components/common/SpinnerBlueView.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';


  const props = defineProps({
    triggerButtonName: { type: String, required: false, default: '' },
    title: { type: String, required: true },
    paragraph: { type: String, required: true },
    outlined: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false, default: false },
    color: {
      type: String,
      required: true,
      validator(value) {
        return ['red', 'deepBlue', 'lightGray', 'green'].includes(value);
      },
    },
    icon: { type: String, required: false, default: '' },
    closeButtonName: { type: String, required: true },
    closeButtonHandler: { type: Function, required: false, default: () => {} },
    hideButton: { type: Boolean, required: false, default: false },
    isLoading: { type: Boolean, required: false, default: false },
    error: { type: String, required: false, default: '' },
    isError: { type: Boolean, required: false, default: false },
    submitButtonColor: { type: String, required: false, default: undefined },
  });

  const emit = defineEmits(['cancel', 'confirm']);

  const triggerButtonColor = computed(() => {
    const isOutlined = props.color === 'red' || props.color === 'green';
    if (isOutlined) {
      if (props.color === 'red') return 'destructive-outlined';
      return 'outlined';
    }
    if (props.color === 'lightGray') return 'secondary-fill';
    if (props.color === 'deepBlue') return 'primary';
    return 'primary';
  });

  const confirmButtonColor = computed(() => {
    if (props.color === 'lightGray') return 'primary';
    const targetColor = props.submitButtonColor ?? props.color;
    if (targetColor === 'red') return 'destructive';
    if (targetColor === 'deepBlue') return 'primary';
    if (targetColor === 'green') return 'primary';
    return 'primary';
  });

  const modalRef = ref(null);
  const isModalOpenRef = ref(false);

  // Base Modal
  const handleOpenModal = () => {
    if (modalRef.value) {
      isModalOpenRef.value = true;
      modalRef.value.openModal();
    }
  };

  const closeModal = () => {
    if (modalRef.value) {
      isModalOpenRef.value = false;
      modalRef.value.closeModal();
    }
  };

  // Modal Paragraph

  const handleCancel = () => {
    emit('cancel');
    modalRef.value.closeModal();
  };

  const handleSubmit = async () => {
    emit('confirm');
    if (props.closeButtonHandler) {
      await props.closeButtonHandler();
    }
    closeModal();
  };

  // 키보드 이벤트
  const handleKeyEnter = (event) => {
    if (!isModalOpenRef.value) return;
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleKeyEscape = (event) => {
    if (!isModalOpenRef.value) return;
    if (event.key === 'Escape') {
      handleCancel();
    }
  };

  onMounted(() => {
    window.addEventListener('keyup', handleKeyEscape);
    window.addEventListener('keyup', handleKeyEnter);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keyup', handleKeyEscape);
    window.removeEventListener('keyup', handleKeyEnter);
  });

  defineExpose({
    handleOpenModal: () => modalRef.value?.openModal(),
    closeModal,
  });
</script>

<template>
  <ModalBase ref="modalRef" :has-form="false" :title="title">
    <template #button>
      <template v-if="!hideButton">
        <button
          v-if="!outlined"
          type="button"
          :class="`flex flex-nowrap items-center whitespace-nowrap px-3 py-2 font-medium ${
            color === 'red' ? ' text-destructive-100' : 'text-primary-100'
          }`"
          @click="handleOpenModal"
        >
          <IconTrashLineRed
            v-if="icon === 'trash'"
            class="mr-1 h-4 w-4"
            alt="삭제"
          />

          {{ triggerButtonName }}
        </button>
        <ButtonBase
          v-else
          type="button"
          :color="triggerButtonColor"
          :disabled="disabled"
          custom-class="flex flex-nowrap items-center whitespace-nowrap"
          @click="handleOpenModal"
        >
          <IconTrashLineRed
            v-if="icon === 'trash'"
            class="mr-1 h-4 w-4"
            alt="삭제"
          />
          <IconErrorInfoRed
            v-if="icon === 'warning' && !disabled"
            class="mr-2 h-4 w-4"
            aria-hidden="true"
          />
          <div>
            <div
              v-if="isLoading"
              class="flex items-center justify-center gap-2"
            >
              <SpinnerBlueView />
            </div>
            <div v-else>{{ triggerButtonName }}</div>
          </div>
        </ButtonBase>
      </template>
    </template>
    <template #modalBody>
      <p class="whitespace-pre-line leading-snug text-muted-foreground-100">
        {{ props.paragraph }}
      </p>
      <TextError v-if="isError">{{ error }}</TextError>
    </template>
    <template #submitButton>
      <div class="flex gap-2">
        <ButtonBase
          form="form"
          type="submit"
          color="secondary-fill"
          :disabled="isLoading"
          @click="handleCancel"
          @keyup="handleKeyEscape"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="form"
          type="submit"
          :color="confirmButtonColor"
          :disabled="props.disabled"
          custom-class="w-full"
          @click="handleSubmit"
          @keyup="handleKeyEnter"
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
