import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toast = ref(null);

  let timer = null;

  const hideToast = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    toast.value = null;
  };

  const showToast = ({ message, type = 'info', duration = 3000 }) => {
    // 기존 타이머가 있으면 제거
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    toast.value = {
      message,
      type,
      duration,
      visible: true,
    };

    if (duration > 0) {
      timer = setTimeout(() => {
        hideToast();
      }, duration);
    }
  };

  return {
    toast,
    showToast,
    hideToast,
  };
});
