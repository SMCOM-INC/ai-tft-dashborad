<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import VoteMessageReservationModalDateTime from '@views/VoteView/Message/VoteMessageReservationModalDateTime.vue';
  import VoteMessageReservationModalInfo from '@views/VoteView/Message/VoteMessageReservationModalInfo.vue';
  import VoteMessageReservationModalList from '@views/VoteView/Message/VoteMessageReservationModalList.vue';
  import { computed } from 'vue';

  import useGetVoteSmsReservationList from '@/lib/queries/vote/useGetVoteSmsReservationList.js';
  import { useVoteMessageStore } from '@/stores/vote.js';

  const emits = defineEmits(['close']);

  const voteMessageStore = useVoteMessageStore();

  const { voteSmsReservationList } = useGetVoteSmsReservationList({
    voteUuid: voteMessageStore.voteUuid,
  });

  const isOverSendLimit = computed(
    () => voteSmsReservationList.value?.length >= voteMessageStore.smsSendLimit,
  );

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[720px]">
      <div
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-20Bold">메시지 예약발송</h1>
        <button type="button" @click="closeModal">
          <CloseIcon class="h-5 w-5" />
        </button>
      </div>
      <div :class="`space-y-5 ${isOverSendLimit ? 'mb-6 ' : ''}`">
        <!-- 메시지 발송 안내 -->
        <VoteMessageReservationModalInfo />
        <!-- 메시지 발송예약 내역 -->
        <VoteMessageReservationModalList />
        <!-- 메시지 예약일시 -->
        <VoteMessageReservationModalDateTime
          v-if="!isOverSendLimit"
          :is-over-send-limit="isOverSendLimit"
          @close="closeModal"
        />
        <p
          v-if="isOverSendLimit"
          class="m-6 max-h-32 overflow-y-auto rounded-lg bg-red-50 p-3 font-medium text-red-800"
        >
          이 투표의 기본 제공 메시지 발송 횟수({{
            voteMessageStore.smsSendLimit
          }}회)를 모두 사용했습니다.<br />추가 발송을 원하시면 고객센터로 문의해
          주세요.
        </p>
      </div>
    </div>
  </ModalBaseNew>
</template>
