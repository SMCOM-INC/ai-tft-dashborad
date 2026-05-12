import { computed, isRef } from 'vue';

import { VOTE_STATE } from '@/constants/vote.js';

const useVoteState = ({ state, finishFlag, openTime }) => {
  // ============================================
  // 매개변수
  // ============================================
  const stateValue = computed(() => {
    return isRef(state) ? state.value : state;
  });

  const finishFlagValue = computed(() => {
    return isRef(finishFlag) ? finishFlag.value : finishFlag;
  });

  const openTimeValue = computed(() => {
    return isRef(openTime) ? openTime.value : openTime;
  });

  // ============================================
  // 권한 체크 함수
  // ============================================
  const checkAuth = computed(() => {
    if (!openTimeValue.value) return 'NONE';

    const now = new Date();
    const start = new Date(openTimeValue.value?.replace(' ', 'T'));
    const oneHourInMs = 60 * 60 * 1000;

    if (stateValue.value === VOTE_STATE.PENDING) {
      const timeUntilStart = start.getTime() - now.getTime();

      if (timeUntilStart > oneHourInMs) {
        return 'ALL'; // 시작 1시간 이전이면 수정/삭제 가능
      }
      return 'NONE'; // 시작 1시간 이내면 모두 불가
    }

    if (stateValue.value === VOTE_STATE.CLOSE) {
      return 'DELETE_ONLY'; // 투표 종료 시 삭제만 가능
    }

    // 진행중(PROGRESS) 상태인 경우
    return 'NONE';
  });

  // ============================================
  // 상태 계산 로직
  // ============================================

  // 미완성 상태
  const isIncomplete = computed(() => !finishFlagValue.value);

  // 시작전 상태
  const isPendingState = computed(() => {
    return stateValue.value === VOTE_STATE.PENDING;
  });

  // 수정 가능
  const canEdit = computed(() => {
    // 미완성이거나 OR (투표상태가 시작전이고, 수정 또는 삭제가 모두 가능할 때).
    return (
      isIncomplete.value || (isPendingState.value && checkAuth.value === 'ALL')
    );
  });

  // 삭제 가능
  const canDelete = computed(() => {
    // 미완성이거나 (투표상태가 진행중이 아니고, 삭제만 가능하거나 모두가능할 때).
    return (
      isIncomplete.value || ['ALL', 'DELETE_ONLY'].includes(checkAuth.value)
    );
  });

  return {
    checkAuth,
    canEdit,
    canDelete,
  };
};

export default useVoteState;
