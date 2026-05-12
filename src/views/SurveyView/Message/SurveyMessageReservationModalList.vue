<script setup>
  import IconDeleteLineBlack from '@assets/icons/icon-delete-line-black.svg';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { ref } from 'vue';

  import useDeleteSurveySmsReservation from '@/lib/queries/survey/useDeleteSurveySmsReservation.js';
  import useGetSurveySmsReservationList from '@/lib/queries/survey/useGetSurveySmsReservationList.js';
  import { useSurveyMessageStore } from '@/stores/survey.js';

  const surveyMessageStore = useSurveyMessageStore();

  const deletingId = ref(null);

  const {
    surveySmsReservationList,
    isSurveySmsReservationListLoading,
    surveySmsReservationListError,
  } = useGetSurveySmsReservationList({
    surveyUuid: surveyMessageStore.surveyUuid,
  });

  const {
    deleteSurveySmsReservationMutationAsync,
    isDeleteSurveySmsReservationPending,
  } = useDeleteSurveySmsReservation();

  const deleteReservation = (reservationUuid) => {
    deletingId.value = reservationUuid;

    deleteSurveySmsReservationMutationAsync({
      surveyUuid: surveyMessageStore.surveyUuid,
      reservationUuid,
    });
  };

  const isFutureDateTime = (dateTime) => {
    return new Date(dateTime) > new Date();
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
          설문당 각 인원에 총 {{ surveyMessageStore.smsSendLimit }}회의 메시지가
          기본 제공됩니다.
        </p>
      </div>
      <div>
        잔여
        <span class="text-alerts-warning-text-warning pretendard-18SemiBold">{{
          surveyMessageStore.smsSendCount
        }}</span
        >회 | 총
        <span class="pretendard-18SemiBold">{{
          surveyMessageStore.smsSendLimit
        }}</span
        >회
      </div>
    </div>
    <!-- 메시지발송예약 리스트 -->
    <div>
      <div
        v-if="isSurveySmsReservationListLoading"
        class="flex justify-center py-4"
      >
        <SpinnerCircle color="blue" class="flex" />
      </div>
      <ul v-else class="flex flex-wrap gap-4 rounded-md bg-muted-100 p-4">
        <p
          v-if="surveySmsReservationListError"
          class="w-full text-center text-sm"
        >
          내역을 불러오지 못했습니다. <br />
          발송예약 내역 창 닫기 후, 다시 시도해주세요.
        </p>
        <p
          v-if="surveySmsReservationList?.reservationList?.length <= 0"
          class="w-full text-center text-sm"
        >
          발송예약 내역이 없습니다.<br />메시지를 예약해주세요.
        </p>
        <template v-else>
          <li
            v-for="reservation in surveySmsReservationList?.reservationList"
            :key="reservation.uuid"
            class="flex items-center gap-2 rounded-md bg-slate-300 px-2"
          >
            <div
              v-if="
                isDeleteSurveySmsReservationPending &&
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
                v-if="
                  !reservation.sendFlag &&
                  isFutureDateTime(reservation.sendDateTime)
                "
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
