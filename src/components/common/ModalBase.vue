<script setup>
  import CloseIcon from '@assets/icons/icon-close-darkGray.svg';
  import { ref } from 'vue';


  const props = defineProps({
    title: { type: String, required: true },
    hasForm: { type: Boolean, default: false },
    formId: { type: String, default: 'modalForm' },
    widthValue: { type: String, required: false, default: '' },
  });

  const emits = defineEmits(['formSubmit', 'closeModal']);

  const isModalOpen = ref(false);

  const openModal = () => {
    isModalOpen.value = true;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    emits('formSubmit', event);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      emits('formSubmit', event);
    }
  };

  const closeModal = () => {
    isModalOpen.value = false;
    emits('closeModal');
  };

  defineExpose({ openModal, handleFormSubmit, closeModal });
</script>

<template>
  <div>
    <slot name="button" :open-modal="openModal"></slot>

    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-[0px] z-[1000] bg-black bg-opacity-50"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            :class="`my-8 max-h-[80vh] w-full overflow-y-auto rounded-lg bg-white p-6 ${widthValue ? widthValue : 'max-w-[512px]'}`"
          >
            <header class="mb-4 flex items-center justify-between">
              <h1 class="select-none text-lg font-medium">{{ props.title }}</h1>
              <button type="button" class="w-fit" @click="closeModal">
                <CloseIcon class="h-5" aria-hidden="true" />
              </button>
            </header>
            <form
              v-if="props.hasForm"
              :id="props.formId"
              @submit.prevent="handleFormSubmit"
              @keydown="handleKeyDown"
            >
              <div>
                <slot name="modalBody" />
              </div>
              <div class="mt-8">
                <slot name="submitButton" />
              </div>
            </form>
            <div v-else>
              <slot name="modalBody" />
              <div class="mt-8">
                <slot name="submitButton" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
