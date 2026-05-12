import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

const useUnsavedChangesGuard = (editingRefs, apiRequestFn = null) => {
  const message = '변경사항이 저장되지 않습니다. 페이지를 떠나시겠습니까?';
  const isProcessing = ref(false);

  // 변경사항 여부 확인
  const hasUnsavedChanges = computed(() => {
    return editingRefs.some((item) => item.value);
  });

  // API 요청 함수 실행기
  const performApiRequest = async () => {
    if (apiRequestFn && !isProcessing.value) {
      isProcessing.value = true;
      try {
        await apiRequestFn();
      } finally {
        isProcessing.value = false;
      }
    }
  };

  // 브라우저 새로고침/닫기 감지
  const onBeforeUnload = async (e) => {
    if (hasUnsavedChanges.value) {
      e.preventDefault();
      e.returnValue = '';
      await performApiRequest();
    }
  };

  onBeforeRouteLeave(async (to, from, next) => {
    if (!hasUnsavedChanges.value) {
      return next();
    }

    const confirmed = window.confirm(message);

    if (confirmed) {
      await performApiRequest();
      next();
    } else {
      next(false);
    }
  });

  onMounted(() => window.addEventListener('beforeunload', onBeforeUnload));

  onBeforeUnmount(() =>
    window.removeEventListener('beforeunload', onBeforeUnload),
  );
};

export default useUnsavedChangesGuard;
