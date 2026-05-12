<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SurveyMessageErrorModal from '@views/SurveyView/Message/SurveyMessageErrorModal.vue';
  import SurveyMessageReservationModal from '@views/SurveyView/Message/SurveyMessageReservationModal.vue';
  import { computed, ref, watch } from 'vue';

  import { SURVEY_STATE } from '@/constants/survey.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { useSurveyMessageStore } from '@/stores/survey.js';

  const props = defineProps({
    itemInfo: {
      type: Object,
      required: true,
    },
  });

  const surveyMessageStore = useSurveyMessageStore();

  const { getParams } = useNavigate();

  const modalType = ref(null);
  const errorMessage = ref(null);
  const itemInfo = computed(() => props.itemInfo);

  const updateSurveyMessageStore = () => {
    surveyMessageStore.setSurveyMessageInfo({
      surveyUuid: itemInfo.value.uuid || getParams().surveyUuid,
      smsSendCount: itemInfo.value.smsCount,
      smsSendLimit: itemInfo.value.smsLimitCount,
      surveyDateTime: {
        openTime: itemInfo.value.startDateTime,
        closeTime: itemInfo.value.endDateTime,
      },
    });
  };
  const openSendModal = () => {
    updateSurveyMessageStore();

    modalType.value = 'reservation';
  };

  const closeModal = () => {
    modalType.value = null;
  };

  // 모달 열기
  const openModal = () => {
    if (
      props.itemInfo.state === SURVEY_STATE.CLOSE ||
      props.itemInfo.state === SURVEY_STATE.CLOSE
    ) {
      errorMessage.value = {
        title: '설문 종료 후에는 메시지 발송이 불가합니다.',
        message: '설문 기간을 확인해주세요.',
      };

      modalType.value = 'error';
    } else {
      openSendModal();
    }
  };

  watch(
    () => props.itemInfo,
    (newValue) => {
      if (!newValue) {
        return;
      }

      updateSurveyMessageStore();
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
  <SurveyMessageReservationModal
    v-if="modalType === 'reservation'"
    @close="closeModal"
  />
  <SurveyMessageErrorModal
    v-if="modalType === 'error'"
    :title="errorMessage.title"
    :message="errorMessage.message"
    @close="closeModal"
  />
</template>
