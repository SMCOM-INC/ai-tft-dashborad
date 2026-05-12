<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import { computed } from 'vue';

  import { useVoteSubmitStore } from '@/stores/vote.js';

  const emits = defineEmits(['close']);

  const voteStore = useVoteSubmitStore();

  const errors = computed(() => {
    const result = [];
    if (!voteStore.isDefaultCompleted) result.push('기본정보');
    if (!voteStore.isExcelCompleted) result.push('참여자 업로드');
    if (!voteStore.isQuestionCompleted) result.push('질문 항목');
    return result;
  });

  const closeGroupModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">
          {{ errors.join(', ') }}를(을) 완료해주세요.
        </p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          작성중인 내용이 있어 완성이 불가합니다.
        </p>
      </div>
      <div class="flex justify-end">
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="md"
          class="items-end"
          @click="closeGroupModal"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
