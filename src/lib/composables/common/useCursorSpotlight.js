import { onMounted, onUnmounted } from 'vue';

const useCursorSpotlight = (elementRef) => {
  const handleMove = (e) => {
    const el = elementRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  onMounted(() => {
    const el = elementRef.value;
    if (!el) return;
    el.addEventListener('mousemove', handleMove);
  });

  onUnmounted(() => {
    const el = elementRef.value;
    if (!el) return;
    el.removeEventListener('mousemove', handleMove);
  });
};

export default useCursorSpotlight;
