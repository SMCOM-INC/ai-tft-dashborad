import { ref } from 'vue';

import { useLnbStore } from '@/stores/lnb.js';

// 모듈 레벨 선언 - 모든 컴포넌트가 동일한 인스턴스를 공유
let hideTimer = null;
const buttonEl = ref(null);
const lnbLeft = ref(0);
const lnbTop = ref(0);

const useLnbHover = () => {
  const lnbStore = useLnbStore();

  // hover LNB 표시 직전 버튼 위치 갱신
  // 표시 시점에 계산하므로 별도 resize 리스너 불필요
  const updateLnbPosition = () => {
    if (!buttonEl.value) return;
    const { left: buttonLeft, bottom: buttonBottom } =
      buttonEl.value.getBoundingClientRect();
    lnbLeft.value = buttonLeft;
    lnbTop.value = buttonBottom + 14;
  };

  // 햄버거 버튼 클릭: LNB 토글 + hover 상태 초기화
  // hover LNB가 열린 채로 클릭해도 튀어나오지 않도록 즉시 정리
  const setLNBVisible = () => {
    if (lnbStore.isLNBVisible) {
      lnbStore.setLNBTooltip();
    }
    lnbStore.isLNBVisible = !lnbStore.isLNBVisible;
    clearTimeout(hideTimer);
    lnbStore.isHoverLNBVisible = false;
  };

  // 마우스 진입: 위치 갱신 후 진행 중인 숨김 타이머를 취소하고 즉시 표시
  // 버튼 → LNB 패널로 이동 시 버튼의 mouseleave 타이머를 여기서 취소
  const showHoverLNB = () => {
    updateLnbPosition();
    clearTimeout(hideTimer);
    lnbStore.isHoverLNBVisible = true;
  };

  // 마우스 이탈: 즉시 닫지 않고 100ms 딜레이 후 숨김
  // 버튼 → LNB 패널 사이 짧은 공백에서 깜빡임 방지
  const startHideHoverLNB = () => {
    hideTimer = setTimeout(() => {
      lnbStore.isHoverLNBVisible = false;
    }, 100);
  };

  return {
    buttonEl,
    lnbLeft,
    lnbTop,

    setLNBVisible,
    showHoverLNB,
    startHideHoverLNB,
  };
};

export default useLnbHover;
