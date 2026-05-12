<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import VoteDetailPdfDownButton from '@views/VoteView/Detail/VoteDetailPdfDownButton.vue';
  import VoteDeleteModal from '@views/VoteView/VoteDeleteModal.vue';
  import { computed, ref } from 'vue';
  import { RouterView } from 'vue-router';

  import { DETAIL_TABS_LIST, VOTE_STATE } from '@/constants/vote.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useVoteState from '@/lib/composables/vote/useVoteState.js';
  import useGetVoteDetailDefault from '@/lib/queries/vote/useGetVoteDetailDefault.js';

  const { navigateTo, getParams } = useNavigate();

  const { voteDetailDefault, isVoteDetailDefaultLoading } =
    useGetVoteDetailDefault();

  const modalType = ref(null);

  const voteState = computed(() => voteDetailDefault.value?.voteStatus);
  const openTime = computed(() => voteDetailDefault.value?.openVoteDateTime);

  const { checkAuth, canEdit, canDelete } = useVoteState({
    state: voteState,
    finishFlag: true,
    openTime,
  });

  const editVote = () => {
    navigateTo(`/vote/edit/${getParams().groupUuid}/${getParams().voteUuid}`);
  };

  const openVoteDeleteModal = () => {
    modalType.value = 'voteDelete';
  };

  const closeModal = () => {
    modalType.value = null;
  };
</script>

<template>
  <div class="flex flex-col gap-7 p-10">
    <!-- 페이지 이름 및 버튼 -->
    <div class="flex justify-between">
      <div v-if="isVoteDetailDefaultLoading" class="flex w-full justify-center">
        <SpinnerCircle color="black" />
      </div>
      <template v-else>
        <PageTitleBase
          title="전자투표 상세"
          has-back-button
          back-url="/vote/list"
        />
        <div class="flex h-fit justify-end gap-4">
          <VoteDetailPdfDownButton
            v-if="voteDetailDefault?.voteStatus === VOTE_STATE.CLOSE"
            :disabled="voteDetailDefault?.voteStatus !== VOTE_STATE.CLOSE"
          />
          <div class="space-x-2">
            <ButtonBase
              v-if="canEdit"
              type="button"
              color="primary"
              size="md"
              :disabled="!canEdit"
              @click="editVote"
            >
              투표 수정하기
            </ButtonBase>
            <ButtonBase
              v-if="canDelete"
              type="button"
              color="destructive-outlined"
              size="md"
              :disabled="!canDelete"
              @click="openVoteDeleteModal"
            >
              삭제하기
            </ButtonBase>
          </div>
        </div>
      </template>
    </div>
    <div
      v-if="checkAuth !== 'ALL'"
      class="rounded-lg bg-blue-s-info-25 p-4 text-defaults-secondary-text-secondary pretendard-14Medium"
    >
      <template v-if="checkAuth === 'NONE'">
        투표가 진행중이거나, 시작시간 1시간 이내인 경우 수정 및 삭제가
        불가합니다.
      </template>
      <template v-else-if="checkAuth === 'DELETE_ONLY'">
        투표 종료시, 삭제만 가능합니다.
      </template>
    </div>
    <!-- tab bar -->
    <TabBarBase :tab-list="DETAIL_TABS_LIST" />
    <!-- 투표 기본 정보, 투표 참여자-->
    <RouterView />
  </div>
  <!-- 투표 삭제 모달 -->
  <VoteDeleteModal v-if="modalType === 'voteDelete'" @close="closeModal" />
</template>
