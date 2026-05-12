<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import { computed } from 'vue';

  import { LIST_ERROR_MODAL_MESSAGE, VOTE_STATE } from '@/constants/vote.js';

  const props = defineProps({
    errorType: {
      type: String,
      required: true,
    },
    voteState: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const isProgressState = computed(
    () => props.voteState === VOTE_STATE.PROGRESS,
  );
  const isPendingState = computed(() => props.voteState === VOTE_STATE.PENDING);

  const isEditType = computed(() => props.errorType === 'edit');

  const errorMessage = computed(() => {
    if (isEditType.value) {
      // 진행중, 종료일 때
      if (!isPendingState.value) {
        return LIST_ERROR_MODAL_MESSAGE.EDIT.STATE_LIMIT;
      }
      // 시작전일 때
      if (isPendingState.value) {
        return LIST_ERROR_MODAL_MESSAGE.EDIT.TIME_LIMIT;
      }

      return;
    }

    // 진행중일 때
    if (isProgressState.value) {
      return LIST_ERROR_MODAL_MESSAGE.DELETE.STATE_LIMIT;
    }

    // 시작전일 떄
    if (isPendingState.value) {
      return LIST_ERROR_MODAL_MESSAGE.DELETE.TIME_LIMIT;
    }

    return LIST_ERROR_MODAL_MESSAGE.NONE;
  });

  const closeVoteErrorModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">
          {{ isEditType ? '수정 불가' : '삭제 불가' }}
        </p>
        <p>
          {{ errorMessage }}
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="md"
          class="items-end"
          @click="closeVoteErrorModal"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
