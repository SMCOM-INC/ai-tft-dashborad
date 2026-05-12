<script setup>
  import IconDatepickerClockInput from '@assets/icons/icon-datepicker-clock-input-icon.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import SettingSubmitButton from '@views/ParkingView/components/SettingSubmitButton.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useForm } from 'vee-validate';
  import { ref, watch, watchEffect } from 'vue';

  import {
    OFFICE_HOURS_KOREAN_WEEKDAY_LIST,
    OFFICE_HOURS_WEEKDAY_LIST,
  } from '@/constants/common.js';
  import { FREE_PARKING_TIME_MIN_OPTIONS } from '@/constants/parking.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import useGetAptOfficeHours from '@/lib/queries/apt/useGetAptOfficeHours.js';
  import usePutAptOfficeHours from '@/lib/queries/apt/usePutAptOfficeHours.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import {
    convertTimeObjectToTimeString,
    convertTimeStringToTimeObject,
  } from '@/lib/utils/formatDate.js';
  import { aptOfficeHoursFormSchema } from '@/schemas/apt.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const isEditing = ref(false);
  const officeHoursReactive = ref([]);

  const { aptOfficeHours, isAptOfficeHoursLoading } = useGetAptOfficeHours(
    userInfo.aptUuid,
  );
  const {
    updateAptOfficeHoursMutation,
    isUpdateAptOfficeHoursPending,
    isUpdateAptOfficeHoursSuccess,
  } = usePutAptOfficeHours(userInfo.aptUuid);

  const { handleSubmit, setValues } = useForm({
    validationSchema: toTypedSchema(aptOfficeHoursFormSchema),
    initialValues: { officeHours: [] },
  });

  const initializeOfficeHours = () => {
    officeHoursReactive.value = OFFICE_HOURS_WEEKDAY_LIST.map((day) => ({
      day,
      timeRange: [
        { hours: 0, minutes: 0, seconds: 0 },
        { hours: 0, minutes: 0, seconds: 0 },
      ],
      isDisabled: false,
    }));
  };

  const setOfficeHoursValues = () => {
    if (aptOfficeHours.value.length > 0) {
      officeHoursReactive.value = OFFICE_HOURS_WEEKDAY_LIST.map((day) => {
        const foundHour = aptOfficeHours.value.find(
          (hour) => hour.dayType === day,
        );
        return foundHour
          ? {
              day: foundHour.dayType,
              timeRange: [
                convertTimeStringToTimeObject(foundHour.startTime),
                convertTimeStringToTimeObject(foundHour.endTime),
              ],
              isDisabled: !foundHour.openFlag,
            }
          : {
              day,
              timeRange: [
                { hours: 0, minutes: 0, seconds: 0 },
                { hours: 0, minutes: 0, seconds: 0 },
              ],
              isDisabled: false,
            };
      });
    }
  };

  const toggleEditOfficeHours = () => {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
      if (aptOfficeHours.value.length === 0) {
        initializeOfficeHours();
      } else {
        setOfficeHoursValues();
      }
    }
  };

  const additionalDataProcessor = () => {
    return officeHoursReactive.value.map((day) => ({
      dayType: day.day,
      startTime: convertTimeObjectToTimeString(day.timeRange[0]),
      endTime: convertTimeObjectToTimeString(day.timeRange[1]),
      openFlag: !day.isDisabled,
    }));
  };

  const onSubmit = handleSubmit((values) => {
    swalConfirmModal({
      text: '수정하시겠습니까?',
      callback: () => {
        updateAptOfficeHoursMutation(values.officeHours);
      },
    });
  });

  const handleDisableToggle = (index, newValue) => {
    if (isEditing.value && officeHoursReactive.value[index]) {
      const updatedOfficeHour = {
        ...officeHoursReactive.value[index],
        isDisabled: newValue,
      };
      if (newValue) {
        updatedOfficeHour.timeRange = [
          { hours: 0, minutes: 0, seconds: 0 },
          { hours: 0, minutes: 0, seconds: 0 },
        ];
      }
      officeHoursReactive.value.splice(index, 1, updatedOfficeHour);
    }
  };

  const handleTimeRangeChange = (index, newTimeRange) => {
    if (isEditing.value && officeHoursReactive.value[index]) {
      officeHoursReactive.value[index].timeRange = newTimeRange;
    }
  };

  watchEffect(() => {
    if (aptOfficeHours.value) {
      if (aptOfficeHours.value.length === 0) {
        initializeOfficeHours();
      } else {
        setOfficeHoursValues();
      }
    }
  });

  watch(
    officeHoursReactive,
    (newValue) => {
      if (newValue.length > 0) {
        const processedData = additionalDataProcessor();
        setValues({ officeHours: processedData });
      }
    },
    { deep: true, immediate: true },
  );

  watch(isUpdateAptOfficeHoursSuccess, (success) => {
    if (success) {
      toggleEditOfficeHours();
    }
  });

  useUnsavedChangesGuard([isEditing]);
</script>

<template>
  <SkeletonBar v-if="isAptOfficeHoursLoading" key="skeleton-bar-1" />
  <form v-else id="officeHoursForm">
    <ul class="mb-12 flex flex-col gap-4">
      <li
        v-for="(officeHour, index) in officeHoursReactive"
        :key="officeHour.key"
        class="mb-4 flex items-center"
      >
        <LabelBase
          :label-for="`${officeHour.day}`"
          :label-text="
            OFFICE_HOURS_KOREAN_WEEKDAY_LIST[
              OFFICE_HOURS_WEEKDAY_LIST.indexOf(officeHour.day)
            ]
          "
          class="w-[120px]"
        />
        <div class="mr-3 flex items-center gap-3">
          <div class="flex items-center gap-1">
            <VueDatePicker
              :model-value="officeHour.timeRange"
              time-picker
              range
              auto-apply
              locale="ko"
              range-separator="~"
              minutes-increment="30"
              minutes-grid-increment="30"
              disable-time-range-validation
              :clearable="false"
              :is-24="true"
              :filters="FREE_PARKING_TIME_MIN_OPTIONS"
              :disabled="officeHour.isDisabled || !isEditing"
              class="custom-date-picker w-[180px]"
              @update:model-value="
                (newValue) => handleTimeRangeChange(index, newValue)
              "
            >
              <template #input-icon>
                <IconDatepickerClockInput class="mr-2 mt-1 h-7 w-7" />
              </template>
            </VueDatePicker>
          </div>
        </div>
        <div
          v-if="isEditing || officeHour.isDisabled"
          class="flex items-center gap-2"
        >
          <input
            :id="`${officeHour.day}-disabled`"
            v-model="officeHoursReactive[index].isDisabled"
            type="checkbox"
            :disabled="!isEditing"
            class="h-4 w-4 rounded-sm text-primary-100"
            @change="handleDisableToggle(index, $event.target.checked)"
          />
          <LabelBase
            :label-for="`${officeHour.day}-disabled`"
            label-text="운영안함"
            :class="
              officeHour.isDisabled
                ? 'font-medium text-destructive-100'
                : 'text-muted-foreground-100'
            "
          />
        </div>
      </li>
    </ul>
    <SettingSubmitButton
      :is-loading="isUpdateAptOfficeHoursPending"
      :is-editing="isEditing"
      :is-manual-submit="true"
      @edit="toggleEditOfficeHours"
      @cancel="toggleEditOfficeHours"
      @submit="onSubmit"
    />
  </form>
</template>

<style scoped>
  .custom-date-picker {
    --dp-font-family: 'Pretendard', -apple-system, 'Segoe UI', roboto, oxygen,
      ubuntu, cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --dp-font-size: 15px !important;
    --dp-font-weight: 600 !important;
  }
  .custom-date-picker :deep(.dp__input) {
    line-height: calc(var(--dp-font-size) * 1.8) !important;
  }
</style>
