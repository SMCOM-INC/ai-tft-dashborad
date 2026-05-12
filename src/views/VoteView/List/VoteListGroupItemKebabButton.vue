<script setup>
  import ButtonKebab from '@components/common/ButtonKebab.vue';
  import VoteListActionErrorMessageModal from '@views/VoteView/List/VoteListActionErrorMessageModal.vue';
  import VoteListVoteEditModal from '@views/VoteView/List/VoteListVoteEditModal.vue';
  import VoteDetailVoteDeleteModal from '@views/VoteView/VoteDeleteModal.vue';
  import { ref } from 'vue';

  import useVoteState from '@/lib/composables/vote/useVoteState.js';

  const props = defineProps({
    voteInfo: {
      type: Object,
      required: true,
    },
  });

  const { canEdit, canDelete } = useVoteState({
    state: props.voteInfo.status,
    finishFlag: props.voteInfo.finishFlag,
    openTime: props.voteInfo.openVoteDateTime,
  });

  const modalType = ref(null);
  const isVoteErrorType = ref(undefined);

  const closeModal = () => {
    modalType.value = null;
  };

  const openVoteErrorMessageModal = () => {
    modalType.value = 'error';
  };

  const closeVoteErrorMessageModal = () => {
    isVoteErrorType.value = undefined;
    closeModal();
  };

  const openVoteEditModal = () => {
    if (!canEdit.value) {
      isVoteErrorType.value = 'edit';
      openVoteErrorMessageModal();
      return;
    }

    modalType.value = 'voteEdit';
  };

  const openVoteDeleteModal = () => {
    if (!canDelete.value) {
      isVoteErrorType.value = 'delete';
      openVoteErrorMessageModal();
      return;
    }

    modalType.value = 'voteDelete';
  };

  const KEBAB_BUTTON_LIST = [
    {
      label: '투표명 수정',
      color: 'text-defaults-primary-text-primary',
      handler: openVoteEditModal,
    },
    {
      label: '삭제',
      color: 'text-destructive-100',
      handler: openVoteDeleteModal,
    },
  ];
</script>

<template>
  <ButtonKebab :button-list="KEBAB_BUTTON_LIST" @click.stop />

  <!-- 투표 수정 모달 -->
  <VoteListVoteEditModal
    v-if="modalType === 'voteEdit'"
    :vote-uuid="voteInfo.uuid"
    :vote-title="voteInfo.title"
    @close="closeModal"
  />

  <!-- 투표 삭제 모달 -->
  <VoteDetailVoteDeleteModal
    v-if="modalType === 'voteDelete'"
    :vote-uuid="voteInfo.uuid"
    @close="closeModal"
  />

  <!-- 에러메시지 모달 -->
  <VoteListActionErrorMessageModal
    v-if="modalType === 'error'"
    :error-type="isVoteErrorType"
    :vote-state="voteInfo.status"
    @close="closeVoteErrorMessageModal"
  />
</template>
