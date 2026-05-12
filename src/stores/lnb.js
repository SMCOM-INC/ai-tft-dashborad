import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLnbStore = defineStore('lnb', () => {
  const isLNBVisible = useLocalStorage('lnb-visible', true);
  const isHoverLNBVisible = ref(false);

  // 한 번도 LNB를 접은 적 없으면 false (툴팁 표시 조건)
  const hasClosedLNBTooltip = useLocalStorage('lnb-has-closed', false);

  const setLNBTooltip = () => {
    hasClosedLNBTooltip.value = true;
  };

  return {
    isLNBVisible,
    isHoverLNBVisible,
    hasClosedLNBTooltip,
    setLNBTooltip,
  };
});
