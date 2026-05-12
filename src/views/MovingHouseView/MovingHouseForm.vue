<script setup>
  import InputRadio from '@components/common/InputRadio.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useField } from 'vee-validate';
  import { computed } from 'vue';

  import { useFetchMoveHouseReservationTimeList } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import { formatTimeToHHMM } from '@/lib/utils/formatDate.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  defineProps({
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const moveTypeList = [
    { label: '전입', key: 'MOVE_IN' },
    { label: '전출', key: 'MOVE_OUT' },
  ];

  const { value: residentName } = useField('residentName');
  const { value: emergencyPhone } = useField('emergencyPhone');
  const { value: dong } = useField('dong');
  const { value: ho } = useField('ho');
  const { value: moveDate } = useField('moveDate', undefined, {
    initialValue: new Date(),
  });
  const { value: moveReservationTimeUuid } = useField(
    'moveReservationTimeUuid',
    undefined,
    {
      initialValue: '',
    },
  );
  const { value: depositDate } = useField('depositDate', undefined, {
    initialValue: new Date(),
  });
  const { value: depositorName } = useField('depositorName');
  const { value: memo } = useField('memo');

  const { moveHouseReservationTimeList } =
    useFetchMoveHouseReservationTimeList(aptUuid);

  const timeOptions = computed(() => {
    if (!moveHouseReservationTimeList.value) return [];
    return moveHouseReservationTimeList.value.map((item) => ({
      uuid: item.uuid,
      label: `${formatTimeToHHMM(item.startTime)} - ${formatTimeToHHMM(item.endTime)} (${item.name})`,
    }));
  });
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <LabelBase label-for="moveType" label-text="이사유형" asterisk />
      <div class="flex gap-2">
        <InputRadio
          :list="moveTypeList"
          name="moveType"
          variants="outlined"
          check-type="default"
        />
      </div>
      <TextError v-if="errors.moveType">{{ errors.moveType }}</TextError>
    </div>

    <div class="flex flex-col gap-2">
      <LabelBase label-for="residentName" label-text="이름" asterisk />
      <input
        id="residentName"
        v-model="residentName"
        type="text"
        name="residentName"
        class="h-[38px] w-full rounded-md border px-3 py-2"
        placeholder="이름을 입력해주세요"
      />
      <TextError v-if="errors.residentName" class="-mt-2 ml-1">{{
        errors.residentName
      }}</TextError>
    </div>

    <div class="flex flex-col gap-2">
      <LabelBase label-for="emergencyPhone" label-text="비상 연락처" asterisk />
      <input
        id="emergencyPhone"
        v-model="emergencyPhone"
        type="text"
        name="emergencyPhone"
        maxlength="11"
        class="h-[38px] w-full rounded-md border px-3 py-2"
        placeholder="'-' 없이 숫자만 입력해주세요"
      />
      <TextError v-if="errors.emergencyPhone" class="-mt-2 ml-1">{{
        errors.emergencyPhone
      }}</TextError>
    </div>

    <div class="flex flex-col gap-2">
      <LabelBase label-for="dong" label-text="동" asterisk />
      <input
        id="dong"
        v-model="dong"
        type="text"
        name="dong"
        class="h-[38px] w-full rounded-md border px-3 py-2"
        placeholder="동을 입력해주세요"
      />
      <TextError v-if="errors.dong" class="-mt-2 ml-1">{{
        errors.dong
      }}</TextError>
    </div>

    <div class="flex flex-col gap-2">
      <LabelBase label-for="ho" label-text="호수" asterisk />
      <input
        id="ho"
        v-model="ho"
        type="text"
        name="ho"
        class="h-[38px] w-full rounded-md border px-3 py-2"
        placeholder="호수를 입력해주세요"
      />
      <TextError v-if="errors.ho" class="-mt-2 ml-1">{{ errors.ho }}</TextError>
    </div>

    <div class="flex gap-2">
      <div class="flex w-full flex-col gap-2">
        <LabelBase label-for="moveDate" label-text="이사날짜" asterisk />
        <!--        :disabled-dates="disabledDates"-->
        <VueDatePicker
          v-model="moveDate"
          locale="ko"
          :enable-time-picker="false"
          auto-apply
          format="yyyy.MM.dd"
          placeholder="YYYY-MM-DD"
          :min-date="new Date()"
        />
        <TextError v-if="errors.moveDate" class="-mt-2 ml-1">{{
          errors.moveDate
        }}</TextError>
      </div>

      <div class="flex w-full flex-col gap-2">
        <LabelBase
          label-for="moveReservationTimeUuid"
          label-text="이사시간"
          asterisk
        />
        <select
          id="moveReservationTimeUuid"
          v-model="moveReservationTimeUuid"
          name="moveReservationTimeUuid"
          class="icon-chevron-down select-background-position-custom z-10 h-[38px] w-full cursor-pointer rounded-md border bg-no-repeat pl-3 pr-[38px] leading-[38px] disabled:bg-foreground-10 disabled:text-foreground-50"
        >
          <option value="">시간을 선택해주세요</option>
          <option
            v-for="option in timeOptions"
            :key="option.uuid"
            :value="option.uuid"
          >
            {{ option.label }}
          </option>
        </select>
        <TextError v-if="errors.moveReservationTimeUuid" class="-mt-2 ml-1">
          {{ errors.moveReservationTimeUuid }}
        </TextError>
      </div>
    </div>
    <div class="flex w-full flex-col gap-2">
      <LabelBase label-for="depositDate" label-text="입금일자" asterisk />
      <VueDatePicker
        v-model="depositDate"
        locale="ko"
        :enable-time-picker="false"
        auto-apply
        format="yyyy.MM.dd"
        placeholder="YYYY-MM-DD"
      />
      <TextError v-if="errors.depositDate">{{ errors.depositDate }}</TextError>
    </div>
    <div class="flex flex-col gap-2">
      <LabelBase label-for="depositorName" label-text="입금자명" asterisk />
      <input
        id="depositorName"
        v-model="depositorName"
        type="text"
        name="depositorName"
        class="h-[38px] w-full rounded-md border px-3 py-2"
        placeholder="입금자명을 입력해주세요"
      />
      <TextError v-if="errors.depositorName">{{
        errors.depositorName
      }}</TextError>
    </div>

    <div class="flex flex-col gap-2">
      <LabelBase label-for="memo" label-text="메모(선택)" />
      <textarea
        id="memo"
        v-model="memo"
        name="memo"
        maxlength="200"
        rows="4"
        class="w-full rounded-md border px-3 py-2"
        placeholder="메모를 입력해주세요"
      />
      <TextError v-if="errors.memo">{{ errors.memo }}</TextError>
    </div>
  </div>
</template>
