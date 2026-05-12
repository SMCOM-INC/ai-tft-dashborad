<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import VoteListGroupItemKebabButton from '@views/VoteView/List/VoteListGroupItemKebabButton.vue';
  import VoteMessageButton from '@views/VoteView/Message/VoteMessageButton.vue';
  import VoteStateChip from '@views/VoteView/VoteStateChip.vue';

  import { VOTE_STATE, VOTE_TYPE } from '@/constants/vote.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    voteInfo: {
      type: Object,
      required: true,
    },
    groupUuid: {
      type: String,
      required: true,
    },
  });

  const { navigateTo } = useNavigate();

  const moveVoteDetail = () => {
    navigateTo(`/vote/detail/${props.groupUuid}/${props.voteInfo.uuid}`);
  };

  const moveToCreationForm = () => {
    navigateTo(`/vote/create/${props.groupUuid}/${props.voteInfo.uuid}`);
  };
</script>

<template>
  <li class="cursor-pointer hover:bg-slate-50">
    <!-- 완성 투표 -->
    <div
      v-if="voteInfo.finishFlag"
      class="flex w-full justify-between pretendard-16Regular"
      type="button"
      @click="moveVoteDetail"
    >
      <div class="flex items-center gap-8 p-4">
        <span class="w-14 whitespace-nowrap">{{
          VOTE_TYPE[voteInfo.voteType]
        }}</span>
        <VoteStateChip :vote-state="voteInfo.status" class="h-fit w-16" />
        <span class="text-left">{{ decodeUrl(voteInfo.title) }}</span>
      </div>
      <div class="flex items-center justify-between gap-4 p-4">
        <!-- 투표 시작전, 투표 진행중일 때만 -->
        <VoteMessageButton
          v-if="voteInfo.status !== VOTE_STATE.CLOSE"
          :vote-info="voteInfo"
        />
        <span class="min-w-52">{{
          `${voteInfo.openVoteDateTime?.slice(0, 10)} ~ ${voteInfo.closeVoteDateTime?.slice(0, 10)}`
        }}</span>
        <div class="w-10">
          <VoteListGroupItemKebabButton
            v-if="voteInfo.status !== VOTE_STATE.PROGRESS"
            :vote-info="voteInfo"
          />
        </div>
      </div>
    </div>
    <!-- 미완성 투표 -->
    <div
      v-else
      class="flex w-full justify-between pretendard-16Regular"
      type="button"
      @click="moveToCreationForm"
    >
      <div class="flex items-center gap-8 p-4">
        <span class="w-14 whitespace-nowrap">{{
          VOTE_TYPE[voteInfo.voteType]
        }}</span>
        <span
          class="w-16 px-1 text-center text-alerts-error-text-error pretendard-16Medium"
          >미완성</span
        >
        <span class="text-left">{{ decodeUrl(voteInfo.title) }}</span>
      </div>
      <div class="flex items-center justify-between gap-4 p-4">
        <ButtonBase
          type="button"
          size="md"
          class="flex items-center justify-center gap-2"
          color="primary"
          @click.stop="moveToCreationForm"
        >
          완성하러 가기
        </ButtonBase>
        <VoteListGroupItemKebabButton :vote-info="voteInfo" />
      </div>
    </div>
  </li>
</template>
