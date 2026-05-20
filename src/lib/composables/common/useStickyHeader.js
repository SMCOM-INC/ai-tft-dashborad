import { onMounted, onUnmounted, ref } from 'vue';

const useStickyHeader = (scrollContainerRef, threshold = 8) => {
  const isScrolled = ref(false);

  const handleScroll = () => {
    const el = scrollContainerRef.value;
    if (!el) return;
    isScrolled.value = el.scrollTop > threshold;
  };

  onMounted(() => {
    const el = scrollContainerRef.value;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });

  onUnmounted(() => {
    const el = scrollContainerRef.value;
    if (!el) return;
    el.removeEventListener('scroll', handleScroll);
  });

  return { isScrolled };
};

export default useStickyHeader;
