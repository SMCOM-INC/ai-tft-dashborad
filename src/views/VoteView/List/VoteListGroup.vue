<script setup>
  import VoteListGroupHeader from '@views/VoteView/List/VoteListGroupHeader.vue';
  import VoteListGroupItem from '@views/VoteView/List/VoteListGroupItem.vue';

  const props = defineProps({
    groupInfo: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
  });

  const emits = defineEmits(['edit', 'toggle']);

  const editGroup = () => {
    emits('edit', props.groupInfo);
  };

  const toggleGroup = () => {
    emits('toggle');
  };
</script>

<template>
  <li>
    <VoteListGroupHeader
      :group-info="groupInfo"
      :is-open="isOpen"
      @edit="editGroup"
      @toggle="toggleGroup"
    />
    <div
      :class="`rounded-bl-md rounded-br-md border transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'h-[0px] overflow-hidden opacity-0'
      }`"
    >
      <template v-if="groupInfo?.voteList?.length > 0">
        <ul v-for="(vote, index) in groupInfo?.voteList" :key="vote.voteUuid">
          <VoteListGroupItem
            :vote-info="vote"
            :group-uuid="groupInfo.uuid"
            :class="`${
              index === groupInfo?.voteList?.length - 1
                ? undefined
                : 'border-b border-b-defaults-secondary-border-secondary'
            }`"
          />
        </ul>
      </template>
      <p
        v-else
        class="w-full border-defaults-secondary-border-secondary py-12 text-center text-defaults-tertiary-text-tertiary pretendard-16Medium"
      >
        그룹에 추가된 하위 내용이 없습니다.
      </p>
    </div>
  </li>
</template>
