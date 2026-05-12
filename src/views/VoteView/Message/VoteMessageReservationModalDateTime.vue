<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputDatePicker from '@components/common/InputDatePicker.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import usePostVoteSmsReservation from '@/lib/queries/vote/usePostVoteSmsReservation.js';
  import createTimeSlots from '@/lib/utils/createTimeSlots.js';
  import { getVoteSmsReservationSchema } from '@/schemas/vote.js';
  import { useVoteMessageStore } from '@/stores/vote.js';

  defineProps({
    isOverSendLimit: {
      type: Boolean,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const { getParams } = useNavigate();

  const voteMessageStore = useVoteMessageStore();

  const {
    createVoteSmsReservationMutationAsync,
    isCreateVoteSmsReservationPending,
  } = usePostVoteSmsReservation();

  const { handleSubmit, meta, defineField, errors } = useForm({
    validationSchema: getVoteSmsReservationSchema(
      voteMessageStore.voteDateTime.openTime,
      voteMessageStore.voteDateTime.closeTime,
    ),
    initialValues: {
      reservationHours: '00',
      reservationMinutes: '00',
    },
  });

  const [reservationDate] = defineField('reservationDate');
  const [reservationHours] = defineField('reservationHours');
  const [reservationMinutes] = defineField('reservationMinutes');

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (submitValues) => {
    await createVoteSmsReservationMutationAsync({
      voteUuid: voteMessageStore.voteUuid || getParams().voteUuid,
      reservationDate: submitValues.reservationDate,
      reservationHours: submitValues.reservationHours,
      reservationMinutes: submitValues.reservationMinutes,
    });
  });
</script>

<template>
  <form id="reserveMessageForm" class="m-6 space-y-3" @submit="onSubmit">
    <h2 class="text-defaults-secondary-text-secondary pretendard-16SemiBold">
      예약 일시
    </h2>
    <div class="flex gap-5">
      <div class="flex w-[364px] gap-2">
        <InputDatePicker
          id="reservationDate"
          v-model="reservationDate"
          local="ko"
          format="yyyy-MM-dd"
          :min-date="new Date()"
          class="w-[274px]"
        />
        <select
          v-model="reservationHours"
          class="h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
          required
        >
          <option
            v-for="number in createTimeSlots('hour')"
            :key="number"
            :value="number"
          >
            {{ number }}시
          </option>
        </select>
        <select
          v-model="reservationMinutes"
          class="h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
          required
        >
          <option v-for="number in ['00', '30']" :key="number" :value="number">
            {{ number }}분
          </option>
        </select>
      </div>
      <ButtonBase
        form="reserveMessageForm"
        type="submit"
        :color="meta.valid ? 'primary' : 'primary-disabled'"
        size="md"
        :class="`flex w-20 items-center justify-between gap-2`"
        :disabled="isOverSendLimit || isCreateVoteSmsReservationPending"
      >
        <SpinnerCircle
          v-if="isCreateVoteSmsReservationPending"
          class="mx-auto"
        />
        <template v-else>예약하기</template>
      </ButtonBase>
    </div>
    <p class="h-5 text-alerts-error-text-error pretendard-14Regular">
      {{ errors.reservationDate }}
    </p>
  </form>
  <div
    :class="`flex justify-end gap-2 px-6 py-4 shadow-[0_-2px_3px_0px_rgba(0,0,0,0.1)]`"
  >
    <div class="flex gap-2">
      <ButtonBase
        type="button"
        color="secondary"
        size="md"
        class="min-w-[80px]"
        :disabled="isCreateVoteSmsReservationPending"
        @click="closeModal"
      >
        닫기
      </ButtonBase>
    </div>
  </div>
</template>
