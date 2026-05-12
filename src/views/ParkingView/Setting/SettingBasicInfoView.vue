<script setup>
  import IconDatepickerClockInput from '@assets/icons/icon-datepicker-clock-input-icon.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import SettingSubmitButton from '@views/ParkingView/components/SettingSubmitButton.vue';
  import SettingBasicInfoFreeParkingDate from '@views/ParkingView/Setting/SettingBasicInfoFreeParkingDate.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { ref, watch } from 'vue';

  import {
    FREE_PARKING_TIME_MIN_OPTIONS,
    PARKING_POLICY_EDIT_MAX_DATE,
  } from '@/constants/parking.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import {
    useFetchParkingPolicyCurrentMonth,
    useFetchParkingPolicyNextMonth,
    useUpdateParkingPolicy,
  } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
  import {
    convertTimeObjectToTimeString,
    convertTimeStringToTimeObject,
  } from '@/lib/utils/formatDate.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();

  const { aptUuid } = userInfo;

  const { parkingPolicyCurrentMonth, isParkingPolicyCurrentMonthLoading } =
    useFetchParkingPolicyCurrentMonth(aptUuid);
  const { parkingPolicyNextMonth, isParkingPolicyNextMonthLoading } =
    useFetchParkingPolicyNextMonth(aptUuid);

  const { updateParkingPolicyMutation, isUpdateParkingPolicyLoading } =
    useUpdateParkingPolicy(aptUuid);

  const isParkingPolicyCurrentMonthEditingRef = ref(false);
  const isParkingPolicyNextMonthEditingRef = ref(false);

  const freeParkingMinuteCurrentMonthRef = ref(0);
  const freeParkingMinuteNextMonthRef = ref(0);
  const freeParkingMinuteCurrentMonthFlagRef = ref(true);
  const freeParkingMinuteNextMonthFlagRef = ref(true);
  const freeParkingTimeCurrentMonthFlagRef = ref(true);
  const freeParkingTimeNextMonthFlagRef = ref(true);

  const freeParkingTimeRangeCurrentMonthRef = ref([
    { hours: 0, minutes: 0, seconds: 0 },
    { hours: 0, minutes: 0, seconds: 0 },
  ]);
  const freeParkingTimeRangeNextMonthRef = ref([
    { hours: 0, minutes: 0, seconds: 0 },
    { hours: 0, minutes: 0, seconds: 0 },
  ]);

  const resetCurrentMonthForm = () => {
    freeParkingMinuteCurrentMonthRef.value =
      parkingPolicyCurrentMonth.value?.freeParkingMinute || 0;
    freeParkingTimeRangeCurrentMonthRef.value = [
      convertTimeStringToTimeObject(
        parkingPolicyCurrentMonth.value.freeParkingStartTime,
      ),
      convertTimeStringToTimeObject(
        parkingPolicyCurrentMonth.value.freeParkingEndTime,
      ),
    ];
  };

  const resetNextMonthForm = () => {
    freeParkingMinuteNextMonthRef.value =
      parkingPolicyNextMonth.value?.freeParkingMinute || 0;
    freeParkingTimeRangeNextMonthRef.value = [
      convertTimeStringToTimeObject(
        parkingPolicyNextMonth.value.freeParkingStartTime,
      ),
      convertTimeStringToTimeObject(
        parkingPolicyNextMonth.value.freeParkingEndTime,
      ),
    ];
  };

  const toggleEditParkingPolicyCurrentMonth = () => {
    isParkingPolicyCurrentMonthEditingRef.value =
      !isParkingPolicyCurrentMonthEditingRef.value;
    if (!isParkingPolicyCurrentMonthEditingRef.value) {
      resetCurrentMonthForm();
    }
  };

  const toggleEditParkingPolicyNextMonth = () => {
    if (new Date().getDate() < PARKING_POLICY_EDIT_MAX_DATE) {
      isParkingPolicyNextMonthEditingRef.value =
        !isParkingPolicyNextMonthEditingRef.value;
      if (!isParkingPolicyNextMonthEditingRef.value) {
        resetNextMonthForm();
      }
    } else {
      swalWarningModal({
        title: '주차정책 수정 오류',
        text: `매월 1일-${PARKING_POLICY_EDIT_MAX_DATE - 1}일 사이에만 변경 가능합니다.`,
      });
    }
  };

  const handleSubmitParkingPolicy = (monthType) => {
    const editingRef =
      monthType === 'current'
        ? isParkingPolicyCurrentMonthEditingRef
        : isParkingPolicyNextMonthEditingRef;
    const minuteRef =
      monthType === 'current'
        ? freeParkingMinuteCurrentMonthRef
        : freeParkingMinuteNextMonthRef;
    const timeRangeRef =
      monthType === 'current'
        ? freeParkingTimeRangeCurrentMonthRef
        : freeParkingTimeRangeNextMonthRef;
    const timeFlagRef =
      monthType === 'current'
        ? freeParkingTimeCurrentMonthFlagRef
        : freeParkingTimeNextMonthFlagRef;
    const minuteFlagRef =
      monthType === 'current'
        ? freeParkingMinuteCurrentMonthFlagRef
        : freeParkingMinuteNextMonthFlagRef;
    const toggleEdit =
      monthType === 'current'
        ? toggleEditParkingPolicyCurrentMonth
        : toggleEditParkingPolicyNextMonth;

    if (!editingRef.value) return;

    swalConfirmModal({
      text: '주차설정을 수정하시겠습니까?',
      callback: async () => {
        const formValues = {
          freeParkingMinute: minuteRef.value,
          freeParkingStartTime: convertTimeObjectToTimeString(
            timeRangeRef.value?.[0],
          ),
          freeParkingEndTime: convertTimeObjectToTimeString(
            timeRangeRef.value?.[1],
          ),
          freeParkingTimeFlag: !timeFlagRef.value,
          freeParkingMinuteFlag: !minuteFlagRef.value,
          month: monthType,
        };

        await updateParkingPolicyMutation(formValues);
        toggleEdit();
      },
    });
  };

  watch(
    [freeParkingMinuteCurrentMonthFlagRef, freeParkingMinuteNextMonthFlagRef],
    ([currentMonthFlag, nextMonthFlag]) => {
      if (currentMonthFlag) {
        freeParkingMinuteCurrentMonthRef.value = 0;
      }
      if (nextMonthFlag) {
        freeParkingMinuteNextMonthRef.value = 0;
      }
    },
  );

  watch(
    [freeParkingTimeCurrentMonthFlagRef, freeParkingTimeNextMonthFlagRef],
    ([currentMonthFlag, nextMonthFlag]) => {
      if (currentMonthFlag) {
        freeParkingTimeRangeCurrentMonthRef.value = [
          { hours: 0, minutes: 0, seconds: 0 },
          { hours: 0, minutes: 0, seconds: 0 },
        ];
      }
      if (nextMonthFlag) {
        freeParkingTimeRangeNextMonthRef.value = [
          { hours: 0, minutes: 0, seconds: 0 },
          { hours: 0, minutes: 0, seconds: 0 },
        ];
      }
    },
    { immediate: true, deep: true },
  );

  watch(
    [parkingPolicyCurrentMonth, parkingPolicyNextMonth],
    ([currentMonthValue, nextMonthValue]) => {
      const updateParkingPolicy = (
        monthValue,
        minuteRef,
        timeRangeRef,
        minuteFlagRef,
        timeFlagRef,
      ) => {
        if (monthValue) {
          minuteRef.value = monthValue?.freeParkingMinute || 0;
          timeRangeRef.value = [
            convertTimeStringToTimeObject(monthValue.freeParkingStartTime),
            convertTimeStringToTimeObject(monthValue.freeParkingEndTime),
          ];
          if (
            monthValue.freeParkingMinute &&
            monthValue.freeParkingMinute === 0
          ) {
            minuteFlagRef.value = true;
          } else {
            minuteFlagRef.value = false;
          }
          if (
            monthValue.freeParkingStartTime === '00:00:00' &&
            monthValue.freeParkingEndTime === '00:00:00'
          ) {
            timeFlagRef.value = true;
          } else {
            timeFlagRef.value = false;
          }
        }
      };

      updateParkingPolicy(
        currentMonthValue,
        freeParkingMinuteCurrentMonthRef,
        freeParkingTimeRangeCurrentMonthRef,
        freeParkingMinuteCurrentMonthFlagRef,
        freeParkingTimeCurrentMonthFlagRef,
      );
      updateParkingPolicy(
        nextMonthValue,
        freeParkingMinuteNextMonthRef,
        freeParkingTimeRangeNextMonthRef,
        freeParkingMinuteNextMonthFlagRef,
        freeParkingTimeNextMonthFlagRef,
      );
    },
    { immediate: true, deep: true },
  );

  useUnsavedChangesGuard([
    isParkingPolicyCurrentMonthEditingRef,
    isParkingPolicyNextMonthEditingRef,
  ]);
</script>

<template>
  <section class="flex w-[800px] flex-row gap-10 border-b border-dark-100">
    <div class="flex w-[320px] flex-col gap-8">
      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap justify-between">
          <h3 class="font-medium">현재 달 무료 회차 시간</h3>
          <p class="text-muted-foreground-100">
            무료 회차 시간 동안 마일리지 차감이 되지 않습니다
          </p>
        </div>
        <SkeletonBar
          v-if="isParkingPolicyCurrentMonthLoading"
          key="skeleton-bar-1"
        />
        <div
          v-else
          class="mr-3 flex w-[320px] items-center justify-between gap-3"
        >
          <div class="relative flex w-full items-center gap-1">
            <input
              id="freeParkingMinuteCurrentMonth"
              v-model="freeParkingMinuteCurrentMonthRef"
              type="number"
              name="freeParkingMinuteCurrentMonth"
              min="0"
              max="1440"
              class="w-52 rounded-md border px-3 py-2 pr-10"
              :disabled="
                freeParkingMinuteCurrentMonthFlagRef ||
                !isParkingPolicyCurrentMonthEditingRef
              "
            />
            <LabelBase
              label-for="freeParkingMinuteCurrentMonth"
              label-text="분"
              :class="
                isParkingPolicyCurrentMonthEditingRef
                  ? 'absolute right-4 select-none'
                  : 'absolute right-32'
              "
            />
          </div>
          <div
            v-if="isParkingPolicyCurrentMonthEditingRef"
            class="flex items-center gap-2"
          >
            <input
              id="freeParkingMinuteFlagCurrentMonth"
              v-model="freeParkingMinuteCurrentMonthFlagRef"
              name="freeParkingMinuteFlagCurrentMonth"
              type="checkbox"
              :value="false"
              :unchecked-value="true"
              class="h-4 w-4 rounded-sm text-primary-100"
              :disabled="!isParkingPolicyCurrentMonthEditingRef"
            />
            <LabelBase
              label-for="freeParkingMinuteFlagCurrentMonth"
              label-text="회차 시간 없음"
            />
          </div>
        </div>
      </div>
      <div class="mb-8 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap justify-between">
            <h3 class="font-medium">현재 달 무료 주차 시간</h3>
            <p class="text-muted-foreground-100">
              무료 주차 시간 동안 마일리지 차감이 되지 않습니다
            </p>
          </div>
          <SkeletonBar v-if="isParkingPolicyCurrentMonthLoading" />
          <div
            v-else
            class="mr-3 flex w-[320px] items-center justify-between gap-3"
          >
            <VueDatePicker
              v-model="freeParkingTimeRangeCurrentMonthRef"
              time-picker
              range
              auto-apply
              disable-time-range-validation
              locale="ko"
              range-separator="~"
              minutes-increment="30"
              minutes-grid-increment="30"
              :clearable="false"
              :is-24="true"
              :filters="FREE_PARKING_TIME_MIN_OPTIONS"
              :disabled="
                !isParkingPolicyCurrentMonthEditingRef ||
                freeParkingTimeCurrentMonthFlagRef
              "
              class="custom-date-picker w-52"
            >
              <template #input-icon>
                <IconDatepickerClockInput class="mr-2 mt-1 h-7 w-7" />
              </template>
            </VueDatePicker>
            <div
              v-if="isParkingPolicyCurrentMonthEditingRef"
              class="flex items-center gap-2"
            >
              <input
                id="freeParkingDisabledCurrentMonth"
                v-model="freeParkingTimeCurrentMonthFlagRef"
                name="freeParkingDisabledCurrentMonth"
                type="checkbox"
                :value="false"
                :unchecked-value="true"
                class="h-4 w-4 rounded-sm text-primary-100"
                :disabled="!isParkingPolicyCurrentMonthEditingRef"
              />
              <LabelBase
                label-for="freeParkingDisabledCurrentMonth"
                label-text="무료 주차 없음"
              />
            </div>
          </div>
        </div>
        <SettingSubmitButton
          v-if="
            (token.userRole === 'master' ||
              token.userRole === 'middle_admin') &&
            parkingPolicyCurrentMonth?.isFreeParkingTimeBlank
          "
          btn-text="이번달 주차설정 수정하기"
          :is-loading="isUpdateParkingPolicyLoading"
          :is-editing="isParkingPolicyCurrentMonthEditingRef"
          :is-manual-submit="true"
          class="w-fit"
          @submit="handleSubmitParkingPolicy('current')"
          @edit="toggleEditParkingPolicyCurrentMonth"
          @cancel="toggleEditParkingPolicyCurrentMonth"
        />
      </div>
    </div>
    <div class="flex w-[320px] flex-col gap-8">
      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap justify-between">
          <h3 class="font-medium">다음 달 무료 회차 시간</h3>
          <p class="text-muted-foreground-100">
            무료 회차 시간 동안 마일리지 차감이 되지 않습니다
          </p>
        </div>
        <SkeletonBar
          v-if="isParkingPolicyNextMonthLoading"
          key="skeleton-bar-2"
        />
        <div
          v-else
          class="mr-3 flex w-[320px] items-center justify-between gap-3"
        >
          <div class="relative flex w-full items-center gap-1">
            <input
              id="freeParkingMinuteNextMonth"
              v-model="freeParkingMinuteNextMonthRef"
              type="number"
              name="freeParkingMinuteNextMonth"
              min="0"
              max="1440"
              class="w-52 rounded-md border px-3 py-2 pr-10"
              :disabled="
                freeParkingMinuteNextMonthFlagRef ||
                !isParkingPolicyNextMonthEditingRef
              "
            />
            <LabelBase
              label-for="freeParkingMinuteNextMonth"
              label-text="분"
              :class="
                isParkingPolicyNextMonthEditingRef
                  ? 'absolute right-4 select-none'
                  : 'absolute right-32'
              "
            />
          </div>
          <div
            v-if="isParkingPolicyNextMonthEditingRef"
            class="flex items-center gap-2"
          >
            <input
              id="freeParkingMinuteFlagNextMonth"
              v-model="freeParkingMinuteNextMonthFlagRef"
              name="freeParkingMinuteFlagNextMonth"
              type="checkbox"
              :value="false"
              :unchecked-value="true"
              class="h-4 w-4 rounded-sm text-primary-100"
              :disabled="!isParkingPolicyNextMonthEditingRef"
            />
            <LabelBase
              label-for="freeParkingMinuteFlagNextMonth"
              label-text="회차 시간 없음"
            />
          </div>
        </div>
      </div>
      <div class="mb-8 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap justify-between">
            <h3 class="font-medium">다음 달 무료 주차 시간</h3>
            <p class="text-muted-foreground-100">
              무료 주차 시간 동안 마일리지 차감이 되지 않습니다
            </p>
          </div>
          <SkeletonBar v-if="isParkingPolicyNextMonthLoading" />
          <div v-else class="flex items-center gap-3">
            <VueDatePicker
              v-model="freeParkingTimeRangeNextMonthRef"
              time-picker
              range
              auto-apply
              disable-time-range-validation
              locale="ko"
              range-separator="~"
              minutes-increment="30"
              minutes-grid-increment="30"
              :clearable="false"
              :is-24="true"
              :filters="FREE_PARKING_TIME_MIN_OPTIONS"
              :disabled="
                !isParkingPolicyNextMonthEditingRef ||
                freeParkingTimeNextMonthFlagRef
              "
              class="custom-date-picker w-52"
            >
              <template #input-icon>
                <IconDatepickerClockInput class="mr-2 mt-1 h-7 w-7" />
              </template>
            </VueDatePicker>
            <div
              v-if="isParkingPolicyNextMonthEditingRef"
              class="flex items-center gap-2"
            >
              <input
                id="freeParkingDisabledNextMonth"
                v-model="freeParkingTimeNextMonthFlagRef"
                name="freeParkingDisabledNextMonth"
                type="checkbox"
                :value="false"
                :unchecked-value="true"
                class="h-4 w-4 rounded-sm text-primary-100"
                :disabled="!isParkingPolicyNextMonthEditingRef"
              />
              <LabelBase
                label-for="freeParkingDisabledNextMonth"
                label-text="무료 주차 없음"
              />
            </div>
          </div>
        </div>
        <SettingSubmitButton
          btn-text="다음달 주차설정 수정하기"
          :is-loading="isUpdateParkingPolicyLoading"
          :is-editing="isParkingPolicyNextMonthEditingRef"
          :is-manual-submit="true"
          class="w-fit"
          @submit="handleSubmitParkingPolicy('next')"
          @edit="toggleEditParkingPolicyNextMonth"
          @cancel="toggleEditParkingPolicyNextMonth"
        />
      </div>
    </div>
  </section>
  <!-- 마일리지 미차감 기간 -->
  <SettingBasicInfoFreeParkingDate />
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
