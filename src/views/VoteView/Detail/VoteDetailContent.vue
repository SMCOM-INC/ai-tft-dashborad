<script setup>
  import VoteDetailContentDefault from '@views/VoteView/Detail/VoteDetailContentDefault.vue';
  import VoteDetailContentDescription from '@views/VoteView/Detail/VoteDetailContentDescription.vue';
  import VoteDetailContentQuestion from '@views/VoteView/Detail/VoteDetailContentQuestion.vue';
  import VotePriceInfo from '@views/VoteView/VotePriceInfo.vue';

  import useGetVoteDetailDefault from '@/lib/queries/vote/useGetVoteDetailDefault.js';

  const { voteDetailDefault, isVoteDetailDefaultLoading } =
    useGetVoteDetailDefault();
</script>

<template>
  <!-- 투표 기본 정보 -->
  <VoteDetailContentDefault
    :fetch-data="voteDetailDefault"
    :is-loading="isVoteDetailDefaultLoading"
  />
  <!-- 가격 정책 안내 -->
  <VotePriceInfo class="mb-4" />
  <!-- 투표 상세내용 -->
  <VoteDetailContentDescription
    :fetch-data="voteDetailDefault"
    :is-loading="isVoteDetailDefaultLoading"
  />
  <!-- 투표 항목 -->
  <VoteDetailContentQuestion
    :fetch-data="voteDetailDefault"
    :is-loading="isVoteDetailDefaultLoading"
  />
</template>
