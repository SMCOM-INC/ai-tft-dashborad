<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import VoteMessageErrorModal from '@views/VoteView/Message/VoteMessageErrorModal.vue';
  import VoteMessageReservationModal from '@views/VoteView/Message/VoteMessageReservationModal.vue';
  import { computed, ref, watch } from 'vue';

  import { VOTE_STATE } from '@/constants/vote.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { useVoteMessageStore } from '@/stores/vote.js';

  const props = defineProps({
    voteInfo: {
      type: Object,
      required: true,
    },
  });

  const voteMessageStore = useVoteMessageStore();

  const { getParams } = useNavigate();

  const modalType = ref(null);
  const errorMessage = ref(null);
  const voteInfo = computed(() => props.voteInfo);

  const updateVoteMessageStore = () => {
    voteMessageStore.setVoteMessageInfo({
      voteUuid: voteInfo.value.uuid || getParams().voteUuid,
      smsSendCount: voteInfo.value.voteSmsCount,
      smsSendLimit: voteInfo.value.voteSmsCountLimit,
      voteDateTime: {
        openTime: voteInfo.value.openVoteDateTime,
        closeTime: voteInfo.value.closeVoteDateTime,
      },
    });
  };
  const openSendModal = () => {
    updateVoteMessageStore();

    modalType.value = 'reservation';
  };

  const closeModal = () => {
    modalType.value = null;
  };

  // 모달 열기
  const openModal = () => {
    if (
      props.voteInfo.status === VOTE_STATE.CLOSE ||
      props.voteInfo.voteStatus === VOTE_STATE.CLOSE
    ) {
      errorMessage.value = {
        title: '투표 종료 후에는 메시지 발송이 불가합니다.',
        message: '투표 기간을 확인해주세요.',
      };

      modalType.value = 'error';
    } else {
      openSendModal();
    }
  };

  watch(
    () => props.voteInfo,
    (newValue) => {
      if (!newValue) {
        return;
      }

      updateVoteMessageStore();
    },
  );
</script>

<template>
  <ButtonBase
    type="submit"
    color="secondary-fill"
    size="md"
    @click="openModal"
    @click.stop
  >
    <span class="text-defaults-primary-text-primary">메시지 예약발송</span>
  </ButtonBase>
  <VoteMessageReservationModal
    v-if="modalType === 'reservation'"
    @close="closeModal"
  />
  <VoteMessageErrorModal
    v-if="modalType === 'error'"
    :title="errorMessage.title"
    :message="errorMessage.message"
    @close="closeModal"
  />
</template>
