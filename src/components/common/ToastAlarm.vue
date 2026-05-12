<script setup>
  import CheckIcon from '@assets/icons/icon-check-circle-green.svg';
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import InfoIcon from '@assets/icons/icon-info-filled-blue.svg';
  import FailIcon from '@assets/icons/icon-warning-filled-red.svg';
  import WarningIcon from '@assets/icons/icon-warning-filled-yellow.svg';

  import { useToastStore } from '@/stores/toast.js';

  const toastStore = useToastStore();

  const getToastTypeClass = (type) => {
    const typeClasses = {
      success: 'border-green-200 bg-green-50',
      error: 'border-red-200 bg-red-50',
      warning: 'border-yellow-200 bg-yellow-50',
      info: 'border-blue-200 bg-blue-50',
    };
    return typeClasses[type] || typeClasses.info;
  };
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toastStore.toast"
        :class="`fixed right-4 top-4 z-50 min-w-80 max-w-96 rounded-lg border bg-white p-4 shadow-lg ${getToastTypeClass(toastStore.toast.type)}`"
      >
        <div class="flex items-center gap-3">
          <div class="h-5 w-5">
            <CheckIcon v-if="toastStore.toast.type === 'success'" />

            <FailIcon v-else-if="toastStore.toast.type === 'error'" />

            <WarningIcon v-else-if="toastStore.toast.type === 'warning'" />

            <InfoIcon v-else-if="toastStore.toast.type === 'info'" />
          </div>
          <p class="text-gray-900 pretendard-14Medium">
            {{ toastStore.toast.message }}
          </p>
          <button
            type="button"
            class="hover:text-gray-600"
            @click="toastStore.hideToast()"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
