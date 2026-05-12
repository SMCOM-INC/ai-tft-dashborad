<script setup>
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';
  import VoteStateChip from '@views/VoteView/VoteStateChip.vue';

  import {
    AUTH_TYPE,
    DETAIL_DEFAULTS_TABLE_HEADERS,
    VOTE_TYPE,
  } from '@/constants/vote.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    fetchData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  // 필드 값 렌더링
  const renderFieldValue = (fieldKey) => {
    if (Object.values(props.fetchData).length <= 0) {
      return;
    }

    const fieldValue = props.fetchData[fieldKey];
    const defaultValue =
      typeof fieldValue === 'number' ? fieldValue.toLocaleString() : fieldValue;

    const formatters = {
      groupName: decodeUrl(defaultValue),
      voteTitle: decodeUrl(defaultValue),
      voteType: VOTE_TYPE[defaultValue],
      voteAuthType: AUTH_TYPE.find((item) => item.key === defaultValue)?.label,
      date: `${props.fetchData.openVoteDateTime.slice(0, 16)} ~ ${props.fetchData.closeVoteDateTime.slice(0, 16)}`,
      fullVoterCount: `${defaultValue}명`,
      voteRate: `${defaultValue}%`,
      votedCount: `${defaultValue}명`,
      notVotedCount: `${defaultValue}명`,
      voteManagerName: decodeUrl(defaultValue),
      voteManagerPosition: decodeUrl(defaultValue),
    };

    return formatters[fieldKey] || fieldValue || '-';
  };
</script>

<template>
  <div>
    <h3 class="pb-3 pretendard-20SemiBold">기본 정보</h3>
    <template v-if="isLoading">
      <SkeletonBase v-for="item in 5" :key="item" class="m-4 h-7 rounded-md" />
    </template>
    <TableInfoBaseNew v-else :table-headers="DETAIL_DEFAULTS_TABLE_HEADERS">
      <template #cell="{ cell }">
        <template v-if="cell.key === 'voteStatus'">
          <VoteStateChip :vote-state="fetchData?.voteStatus" />
        </template>
        <template v-else>{{ renderFieldValue(cell.key) }}</template>
      </template>
    </TableInfoBaseNew>
  </div>
</template>
