<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SurveyMessageReservationModalDateTime from '@views/SurveyView/Message/SurveyMessageReservationModalDateTime.vue';
  import SurveyMessageReservationModalInfo from '@views/SurveyView/Message/SurveyMessageReservationModalInfo.vue';
  import SurveyMessageReservationModalList from '@views/SurveyView/Message/SurveyMessageReservationModalList.vue';
  import { computed } from 'vue';

  import useGetSurveySmsReservationList from '@/lib/queries/survey/useGetSurveySmsReservationList.js';
  import { useSurveyMessageStore } from '@/stores/survey.js';

  const emits = defineEmits(['close']);

  const surveyMessageStore = useSurveyMessageStore();

  const { surveySmsReservationList } = useGetSurveySmsReservationList({
    surveyUuid: surveyMessageStore.surveyUuid,
  });

  const isOverSendLimit = computed(
    () =>
      surveySmsReservationList?.value?.reservationList?.length >=
      surveyMessageStore.smsSendLimit,
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
        <SurveyMessageReservationModalInfo />
        <!-- 메시지 발송예약 내역 -->
        <SurveyMessageReservationModalList />
        <!-- 메시지 예약일시 -->
        <SurveyMessageReservationModalDateTime
          v-if="!isOverSendLimit"
          :is-over-send-limit="isOverSendLimit"
          @close="closeModal"
        />
        <p
          v-if="isOverSendLimit"
          class="m-6 max-h-32 overflow-y-auto rounded-lg bg-red-50 p-3 font-medium text-red-800"
        >
          이 설문의 기본 제공 메시지 발송 횟수({{
            surveyMessageStore.smsLimitCount
          }}회)를 모두 사용했습니다.<br />추가 발송을 원하시면 고객센터로 문의해
          주세요.
        </p>
      </div>
    </div>
  </ModalBaseNew>
</template>
