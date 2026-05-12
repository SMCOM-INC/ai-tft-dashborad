<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import SurveyCreateSubmitBarTime from '@views/SurveyView/Form/SurveyCreateSubmitBarTime.vue';
  import SurveyCreateSubmitChangeDateModal from '@views/SurveyView/Form/SurveyCreateSubmitChangeDateModal.vue';
  import SurveyCreateSubmitErrorModal from '@views/SurveyView/Form/SurveyCreateSubmitErrorModal.vue';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import usePatchSurveySubmit from '@/lib/queries/survey/usePatchSurveySubmit.js';
  import { surveySubmitSchema } from '@/schemas/survey.js';
  import { useQuestionFormStore } from '@/stores/questionForm.js';
  import { useSurveySubmitStore } from '@/stores/survey.js';

  const props = defineProps({
    detail: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['submitSuccess']);

  const { getCurrentRoutePath } = useNavigate();

  const surveyStore = useSurveySubmitStore();
  const questionFormStore = useQuestionFormStore();

  const { handleSubmit, meta, errors, setValues, values } = useForm({
    validationSchema: surveySubmitSchema,
  });

  const { patchSurveySubmitMutationAsync, isPatchSurveySubmitPending } =
    usePatchSurveySubmit();

  const modalType = ref(false);

  const isCreatePage = computed(() => {
    return getCurrentRoutePath().includes('create');
  });

  const closeModal = () => {
    modalType.value = null;
  };

  // 시작종료일시가 최초값에서 달라졌는지 체크
  const isSurveyDateChanged = (prevOpen, prevClose, submitValues) => {
    const pevOpenDate = new Date(prevOpen);
    const pevCloseDate = new Date(prevClose);

    const currentOpenDate = new Date(submitValues.openSurveyDate);
    currentOpenDate.setHours(
      Number(submitValues.openSurveyHours),
      Number(submitValues.openSurveyMinutes),
      0,
    );

    const currentCloseDate = new Date(submitValues.closeSurveyDate);
    currentCloseDate.setHours(
      Number(submitValues.closeSurveyHours),
      Number(submitValues.closeSurveyMinutes),
      0,
    );

    const isOpenChanged = pevOpenDate.getTime() !== currentOpenDate.getTime();
    const isCloseChanged =
      pevCloseDate.getTime() !== currentCloseDate.getTime();

    return isOpenChanged || isCloseChanged;
  };

  const submitSurveyDateTime = () => {
    emits('submitSuccess');

    patchSurveySubmitMutationAsync({
      openSurveyDate: values.openSurveyDate,
      openSurveyHours: values.openSurveyHours,
      openSurveyMinutes: values.openSurveyMinutes,
      closeSurveyDate: values.closeSurveyDate,
      closeSurveyHours: values.closeSurveyHours,
      closeSurveyMinutes: values.closeSurveyMinutes,
    });
  };

  // 최소 1개 이상의 질문이 필수로 설정되어 있는지 검증
  const validateRequiredQuestions = () => {
    const { questionForm } = questionFormStore.formValues;

    if (!questionForm || questionForm.length === 0) {
      return false;
    }

    const hasRequiredQuestion = questionForm.some(
      (question) => question.isRequired === true,
    );

    return hasRequiredQuestion;
  };

  const onSubmit = handleSubmit((submitValues) => {
    // 설문 단계별 작성완료 (기본정보, 참여자 업로드, 질문항목)
    if (!surveyStore.isAllStepCompleted) {
      modalType.value = 'incompleteSteps';

      return;
    }

    // 최소 1개 이상의 질문이 필수로 설정되어 있는지 검증
    if (!validateRequiredQuestions()) {
      modalType.value = 'requiredQuestionMissing';

      return;
    }

    // 시작종료일시가 달라졌는지 체크
    const isDateChanged = isSurveyDateChanged(
      props.detail.openSurveyDateTime,
      props.detail.closeSurveyDateTime,
      submitValues,
    );

    // 예약문자가 있고, 시작종료일시가 달라졌을 때
    // 변경 확인문구 입력 모달 띄우기
    if (props.detail.smsReservationFlag && isDateChanged) {
      modalType.value = 'submitChangeDate';

      return;
    }

    // 설문 완성 또는 수정
    submitSurveyDateTime();
  });

  const convertSurveyDateTime = ({ openTime, closeTime }) => {
    if (!openTime || !closeTime) {
      return {};
    }

    const parseDateTime = (dateTimeStr) => {
      const [date, time] = dateTimeStr.split(' ');
      const [hours, minutes] = time.split(':');

      const convertDate = new Date(date);

      convertDate.setHours(hours, minutes, 0);

      return {
        date: convertDate,
        hours,
        minutes,
      };
    };

    const open = parseDateTime(openTime);
    const close = parseDateTime(closeTime);

    return {
      openSurveyDate: open.date,
      openSurveyHours: open.hours,
      openSurveyMinutes: open.minutes,
      closeSurveyDate: close.date,
      closeSurveyHours: close.hours,
      closeSurveyMinutes: close.minutes,
    };
  };

  watch(
    () => props.detail,
    (newValue) => {
      if (!newValue) {
        return;
      }

      if (isCreatePage.value) {
        return;
      }

      const convertedValues = convertSurveyDateTime({
        openTime: newValue.startDateTime,
        closeTime: newValue.endDateTime,
      });

      setValues(convertedValues);
    },
    { immediate: true },
  );
</script>

<template>
  <div
    class="fixed bottom-0 left-0 z-50 flex w-full justify-center border-t bg-white px-6 py-4 pl-72"
  >
    <form
      id="surveyCreate"
      class="flex w-full max-w-[916px] items-center gap-4"
      @submit="onSubmit"
    >
      <SurveyCreateSubmitBarTime :errors="errors" />
      <ButtonBase
        form="surveyCreate"
        type="submit"
        size="md"
        class="flex h-fit w-36 items-center justify-center gap-2"
        :color="meta.valid ? 'primary' : 'primary-disabled'"
      >
        <SpinnerCircle v-if="isPatchSurveySubmitPending" />
        <template v-else>
          {{ isCreatePage ? '작성 완료' : '수정 완료' }}
        </template>
      </ButtonBase>
    </form>
  </div>
  <SurveyCreateSubmitErrorModal
    v-if="
      modalType === 'incompleteSteps' || modalType === 'requiredQuestionMissing'
    "
    :error-type="modalType"
    @close="closeModal"
  />
  <SurveyCreateSubmitChangeDateModal
    v-if="modalType === 'submitChangeDate'"
    @close="closeModal"
    @submit="submitSurveyDateTime"
  />
</template>
