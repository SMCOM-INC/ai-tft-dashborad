<script setup>
  import IconDeleteLineBlack from '@assets/icons/icon-delete-line-black.svg';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { ref } from 'vue';

  import useDeleteVoteSmsReservation from '@/lib/queries/vote/useDeleteVoteSmsReservation.js';
  import useGetVoteSmsReservationList from '@/lib/queries/vote/useGetVoteSmsReservationList.js';
  import { useVoteMessageStore } from '@/stores/vote.js';

  const voteMessageStore = useVoteMessageStore();

  const deletingId = ref(null);

  const { voteSmsReservationList, isVoteSmsReservationListLoading } =
    useGetVoteSmsReservationList({ voteUuid: voteMessageStore.voteUuid });

  const {
    deleteVoteSmsReservationMutationAsync,
    isDeleteVoteSmsReservationPending,
  } = useDeleteVoteSmsReservation();

  const deleteReservation = (reservationUuid) => {
    deletingId.value = reservationUuid;

    deleteVoteSmsReservationMutationAsync({
      voteUuid: voteMessageStore.voteUuid,
      reservationUuid,
    });
  };
</script>

<template>
  <div class="m-6 space-y-2">
    <div class="flex justify-between">
      <div>
        <h2
          class="text-defaults-secondary-text-secondary pretendard-16SemiBold"
        >
          메시지 발송예약 내역
        </h2>
        <p class="text-defaults-tertiary-text-tertiary">
          투표당 각 인원에 총 {{ voteMessageStore.smsSendLimit }}회의 메시지가
          기본 제공됩니다.
        </p>
      </div>
      <div>
        잔여
        <span class="text-alerts-warning-text-warning pretendard-18SemiBold">{{
          voteMessageStore.smsSendCount
        }}</span
        >회 | 총
        <span class="pretendard-18SemiBold">{{
          voteMessageStore.smsSendLimit
        }}</span
        >회
      </div>
    </div>
    <!-- 메시지발송예약 리스트 -->
    <div>
      <div
        v-if="isVoteSmsReservationListLoading"
        class="flex justify-center py-4"
      >
        <SpinnerCircle color="blue" class="flex" />
      </div>
      <ul v-else class="flex flex-wrap gap-4 rounded-md bg-muted-100 p-4">
        <p
          v-if="voteSmsReservationList?.length <= 0"
          class="w-full text-center text-sm"
        >
          발송예약 내역이 없습니다.<br />메시지를 예약해주세요.
        </p>
        <template v-else>
          <li
            v-for="reservation in voteSmsReservationList"
            :key="reservation.uuid"
            class="flex items-center gap-2 rounded-md bg-slate-300 px-2"
          >
            <div
              v-if="
                isDeleteVoteSmsReservationPending &&
                deletingId === reservation.uuid
              "
              class="flex h-6 w-32 items-center justify-center"
            >
              <SpinnerCircle class="flex" />
            </div>
            <template v-else>
              <span class="whitespace-nowrap">{{
                reservation.sendDateTime.slice(2, 16)
              }}</span>
              <button
                v-if="!reservation.sendFlag"
                type="button"
                @click="deleteReservation(reservation.uuid)"
              >
                <IconDeleteLineBlack />
              </button>
            </template>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
