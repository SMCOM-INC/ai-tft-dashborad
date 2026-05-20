import { onUnmounted, ref, watch } from 'vue';

const useCountUp = (targetRef, { duration = 800, decimals = 0 } = {}) => {
  const display = ref(0);
  let rafId = null;
  let startTime = null;
  let startValue = 0;

  const ease = (t) => 1 - (1 - t) ** 4;

  const tick = (now) => {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = ease(progress);
    const current = startValue + (targetRef.value - startValue) * eased;
    display.value = decimals > 0
      ? Number(current.toFixed(decimals))
      : Math.round(current);
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const start = () => {
    if (rafId) cancelAnimationFrame(rafId);
    startTime = null;
    startValue = display.value;
    rafId = requestAnimationFrame(tick);
  };

  watch(
    targetRef,
    (newValue, oldValue) => {
      if (newValue === oldValue) return;
      if (typeof newValue !== 'number' || Number.isNaN(newValue)) {
        display.value = 0;
        return;
      }
      start();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  return display;
};

export default useCountUp;
