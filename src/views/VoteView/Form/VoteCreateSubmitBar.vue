<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import VoteCreateSubmitBarTime from '@views/VoteView/Form/VoteCreateSubmitBarTime.vue';
  import VoteCreateSubmitChangeDateModal from '@views/VoteView/Form/VoteCreateSubmitChangeDateModal.vue';
  import VoteCreateSubmitImpossibleModal from '@views/VoteView/Form/VoteCreateSubmitImpossibleModal.vue';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import usePatchVoteSubmit from '@/lib/queries/vote/usePatchVoteSubmit.js';
  import { voteSubmitSchema } from '@/schemas/vote.js';
  import { useVoteSubmitStore } from '@/stores/vote.js';

  const props = defineProps({
    voteDetail: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['submitSuccess']);

  const { getCurrentRoutePath } = useNavigate();

  const voteStore = useVoteSubmitStore();

  const { handleSubmit, meta, errors, setValues, values } = useForm({
    validationSchema: voteSubmitSchema,
  });

  const { patchVoteSubmitMutationAsync, isPatchVoteSubmitPending } =
    usePatchVoteSubmit();

  const modalType = ref(false);

  const isCreatePage = computed(() => {
    return getCurrentRoutePath().includes('create');
  });

  const closeModal = () => {
    modalType.value = null;
  };

  // 시작종료일시가 최초값에서 달라졌는지 체크
  const isVoteDateChanged = (prevOpen, prevClose, submitValues) => {
    const pevOpenDate = new Date(prevOpen);
    const pevCloseDate = new Date(prevClose);

    const currentOpenDate = new Date(submitValues.openVoteDate);
    currentOpenDate.setHours(
      Number(submitValues.openVoteHours),
      Number(submitValues.openVoteMinutes),
      0,
    );

    const currentCloseDate = new Date(submitValues.closeVoteDate);
    currentCloseDate.setHours(
      Number(submitValues.closeVoteHours),
      Number(submitValues.closeVoteMinutes),
      0,
    );

    const isOpenChanged = pevOpenDate.getTime() !== currentOpenDate.getTime();
    const isCloseChanged =
      pevCloseDate.getTime() !== currentCloseDate.getTime();

    return isOpenChanged || isCloseChanged;
  };

  const submitVoteDateTime = () => {
    emits('submitSuccess');

    patchVoteSubmitMutationAsync({
      openVoteDate: values.openVoteDate,
      openVoteHours: values.openVoteHours,
      openVoteMinutes: values.openVoteMinutes,
      closeVoteDate: values.closeVoteDate,
      closeVoteHours: values.closeVoteHours,
      closeVoteMinutes: values.closeVoteMinutes,
    });
  };

  const onSubmit = handleSubmit((submitValues) => {
    // 투표 단계별 작성완료
    if (!voteStore.isAllStepCompleted) {
      modalType.value = 'submitImpossible';

      return;
    }

    // 시작종료일시가 달라졌는지 체크
    const isDateChanged = isVoteDateChanged(
      props.voteDetail.openVoteDateTime,
      props.voteDetail.closeVoteDateTime,
      submitValues,
    );

    // 예약문자가 있고, 시작종료일시가 달라졌을 때
    // 변경 확인문구 입력 모달 띄우기
    if (props.voteDetail.smsReservationFlag && isDateChanged) {
      modalType.value = 'submitChangeDate';

      return;
    }

    // 투표 완성 또는 수정
    submitVoteDateTime();
  });

  const convertVoteDateTime = ({ openTime, closeTime }) => {
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
      openVoteDate: open.date,
      openVoteHours: open.hours,
      openVoteMinutes: open.minutes,
      closeVoteDate: close.date,
      closeVoteHours: close.hours,
      closeVoteMinutes: close.minutes,
    };
  };

  watch(
    () => props.voteDetail,
    (newValue) => {
      if (!newValue) {
        return;
      }

      if (isCreatePage.value) {
        return;
      }

      const convertedValues = convertVoteDateTime({
        openTime: newValue.openVoteDateTime,
        closeTime: newValue.closeVoteDateTime,
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
      id="voteCreate"
      class="flex w-full max-w-[916px] items-center gap-4"
      @submit="onSubmit"
    >
      <VoteCreateSubmitBarTime :errors="errors" />
      <ButtonBase
        form="voteCreate"
        type="submit"
        size="md"
        class="flex h-fit w-36 items-center justify-center gap-2"
        :color="meta.valid ? 'primary' : 'primary-disabled'"
      >
        <SpinnerCircle v-if="isPatchVoteSubmitPending" />
        <template v-else>
          {{ isCreatePage ? '작성 완료' : '수정 완료' }}
        </template>
      </ButtonBase>
    </form>
  </div>
  <VoteCreateSubmitImpossibleModal
    v-if="modalType === 'submitImpossible'"
    @close="closeModal"
  />
  <VoteCreateSubmitChangeDateModal
    v-if="modalType === 'submitChangeDate'"
    @close="closeModal"
    @submit="submitVoteDateTime"
  />
</template>
