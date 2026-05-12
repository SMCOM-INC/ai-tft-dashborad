<script setup>
  import IconCheckFilled from '@assets/icons/icon-checkmark-circle-filled.svg';
  import IconCheckSolid from '@assets/icons/icon-checkmark-circle-solid.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import SettingSubmitButton from '@views/ParkingView/components/SettingSubmitButton.vue';
  import { useForm } from 'vee-validate';
  import { computed, ref, watch, watchEffect } from 'vue';


  import { PARKING_POLICY_EDIT_MAX_DATE } from '@/constants/parking.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import {
    useFetchAptVisitPurposeList,
    useFetchMileagePolicyCurrentMonth,
    useFetchMileagePolicyNextMonth,
    useUpdateAptVisitPurposeList,
    useUpdateMileagePolicy,
  } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
  import {
    createAptHouseholdMileagePolicySchema,
    updateAptHouseholdMileagePolicySchema,
  } from '@/schemas/parking.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { token } = useTokenStore();
  const { aptUuid } = userInfo;
  const { userRole } = token;

  const { mileagePolicyCurrentMonth, isMileagePolicyCurrentMonthLoading } =
    useFetchMileagePolicyCurrentMonth(aptUuid);
  const { mileagePolicyNextMonth, isMileagePolicyNextMonthLoading } =
    useFetchMileagePolicyNextMonth(aptUuid);
  const { aptVisitPurposeList, isAptVisitPurposeListLoading } =
    useFetchAptVisitPurposeList();
  const { updateMileagePolicyMutation, isUpdateMileagePolicyLoading } =
    useUpdateMileagePolicy(aptUuid);
  const {
    updateAptVisitPurposeListMutation,
    isUpdateAptVisitPurposeListLoading,
  } = useUpdateAptVisitPurposeList(aptUuid);

  const isVisitPurposeEditing = ref(false);
  const isMileagePolicyCurrentMonthEditing = ref(false);
  const isMileagePolicyNextMonthEditing = ref(false);
  const aptVisitPurposeListReactive = ref([]);
  const aptVisitPurposeUseCount = computed(() =>
    aptVisitPurposeList.value
      ? aptVisitPurposeList.value.filter((item) => item.isUsed).length
      : 0,
  );
  const aptAllVisitPurposeCount = computed(() =>
    aptVisitPurposeList.value ? aptVisitPurposeList.value.length : 0,
  );
  const mileageMinutePriceCurrentMonthRef = computed(() => {
    return mileagePolicyCurrentMonth.value?.minuteAmount ?? -1;
  });
  const mileageMinutePriceNextMonthRef = computed(() => {
    return mileagePolicyNextMonth.value?.minuteAmount ?? -1;
  });

  const {
    handleSubmit: handleCurrentMonthSubmit,
    setValues: setCurrentMonthValues,
    defineField: defineCurrentMonthField,
  } = useForm({
    validationSchema: toTypedSchema(createAptHouseholdMileagePolicySchema),
    initialValues: { baseMileage: 0, hourAmount: 0 },
  });
  const [currentBaseMileage] = defineCurrentMonthField('baseMileage');
  const [currentHourAmount] = defineCurrentMonthField('hourAmount');

  const {
    handleSubmit: handleNextMonthSubmit,
    setValues: setNextMonthValues,
    defineField: defineNextMonthField,
  } = useForm({
    validationSchema: toTypedSchema(updateAptHouseholdMileagePolicySchema),
    initialValues: { monthBaseMileage: 0, hourlyPrice: 0 },
  });
  const [nextMonthBaseMileage] = defineNextMonthField('monthBaseMileage');
  const [nextHourlyPrice] = defineNextMonthField('hourlyPrice');

  const handleEditMileagePolicy = (month) => {
    if (month === 'current') {
      isMileagePolicyCurrentMonthEditing.value = true;
    } else if (month === 'next') {
      if (new Date().getDate() < PARKING_POLICY_EDIT_MAX_DATE) {
        isMileagePolicyNextMonthEditing.value = true;
      } else {
        swalWarningModal({
          title: '마일리지 정책 수정 오류',
          text: `매월 1일-${PARKING_POLICY_EDIT_MAX_DATE - 1}일 사이에만 변경 가능합니다.`,
        });
        isMileagePolicyNextMonthEditing.value = false;
      }
    }
  };

  const handleEditVisitPurpose = () => {
    isVisitPurposeEditing.value = true;
  };

  const handleCancelEditMileagePolicyCurrentMonth = () => {
    if (mileagePolicyCurrentMonth.value) {
      setCurrentMonthValues({
        baseMileage: mileagePolicyCurrentMonth.value.monthBaseMileage,
        hourAmount: mileagePolicyCurrentMonth.value.hourlyPrice,
      });
    } else {
      setCurrentMonthValues({ baseMileage: 0, hourAmount: 0 });
    }
    isMileagePolicyCurrentMonthEditing.value = false;
  };

  const handleCancelEditMileagePolicyNextMonth = () => {
    if (mileagePolicyNextMonth.value) {
      setNextMonthValues({
        monthBaseMileage: mileagePolicyNextMonth.value.monthBaseMileage,
        hourlyPrice: mileagePolicyNextMonth.value.hourlyPrice,
      });
    } else {
      setNextMonthValues({ monthBaseMileage: 0, hourlyPrice: 0 });
    }
    isMileagePolicyNextMonthEditing.value = false;
  };

  const handleCancelEditVisitPurpose = () => {
    isVisitPurposeEditing.value = false;
    aptVisitPurposeListReactive.value = JSON.parse(
      JSON.stringify(aptVisitPurposeList.value),
    );
  };

  const handleItemClick = (index, event) => {
    if (
      isVisitPurposeEditing.value &&
      aptVisitPurposeListReactive.value[index]
    ) {
      event.preventDefault();
      event.stopPropagation();
      aptVisitPurposeListReactive.value[index].isUsed =
        !aptVisitPurposeListReactive.value[index].isUsed;
    }
  };

  const onSubmitCurrentMonth = handleCurrentMonthSubmit((values) => {
    swalConfirmModal({
      text: '이번달 마일리지 정책을 수정하시겠습니까?',
      callback: async () => {
        await updateMileagePolicyMutation({ ...values, month: 'current' });
        handleCancelEditMileagePolicyCurrentMonth();
      },
    });
  });

  const onSubmitNextMonth = handleNextMonthSubmit((values) => {
    swalConfirmModal({
      text: '다음달 마일리지 정책을 수정하시겠습니까? 변경된 사항은 다음달 1일부터 적용됩니다.',
      callback: async () => {
        await updateMileagePolicyMutation({ ...values, month: 'next' });
        handleCancelEditMileagePolicyNextMonth();
      },
    });
  });

  const onSubmitVisitPurpose = () => {
    const hasChanges = aptVisitPurposeListReactive.value.some(
      (item, index) => item.isUsed !== aptVisitPurposeList.value[index].isUsed,
    );

    if (!hasChanges) {
      handleCancelEditVisitPurpose();
      return;
    }

    swalConfirmModal({
      text: '선택한 방문 목적으로 수정하시겠습니까?',
      callback: async () => {
        const updatedVisitPurposeUuidList = aptVisitPurposeListReactive.value
          .filter((item) => item.isUsed)
          .map((item) => item.uuid);
        await updateAptVisitPurposeListMutation({
          visitPurposeUuidList: updatedVisitPurposeUuidList,
        });
        handleCancelEditVisitPurpose();
      },
    });
  };

  watch(
    () => [mileagePolicyCurrentMonth.value, mileagePolicyNextMonth.value],
    ([currentMonth, nextMonth]) => {
      if (currentMonth) {
        setCurrentMonthValues({
          baseMileage: currentMonth.monthBaseMileage,
          hourAmount: currentMonth.hourlyPrice,
        });
      }
      if (nextMonth) {
        setNextMonthValues({
          monthBaseMileage: nextMonth.monthBaseMileage,
          hourlyPrice: nextMonth.hourlyPrice,
        });
      }
    },
    { immediate: true, deep: true },
  );

  watchEffect(() => {
    if (aptVisitPurposeList.value) {
      aptVisitPurposeListReactive.value = JSON.parse(
        JSON.stringify(aptVisitPurposeList.value),
      );
    }
  });

  useUnsavedChangesGuard([
    isMileagePolicyCurrentMonthEditing,
    isMileagePolicyNextMonthEditing,
    isVisitPurposeEditing,
  ]);
</script>

<template>
  <div class="flex flex-auto flex-row gap-8">
    <form id="currentMonthForm" class="flex w-fit flex-col items-start gap-8">
      <div class="flex flex-col gap-2">
        <h3 class="font-medium">월 기본 마일리지</h3>
        <SkeletonBar
          v-if="isMileagePolicyCurrentMonthLoading"
          key="skeleton-bar-1"
          class="h-10 w-full"
        />
        <div v-else class="flex flex-col gap-2">
          <div>
            <div class="relative w-full">
              <div>
                <input
                  id="baseMileage"
                  v-model="currentBaseMileage"
                  type="number"
                  name="baseMileage"
                  class="w-52 rounded-md border px-3 py-2"
                  :disabled="!isMileagePolicyCurrentMonthEditing"
                />
                <label
                  for="baseMileage"
                  class="absolute right-28 top-2 select-none"
                  >분</label
                >
              </div>
            </div>
            <p class="mb-3 text-muted-foreground-100">
              매월 1일 세대당 충전될 마일리지 시간을 입력해주세요.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="font-medium">시간당 추가 과금 금액</h3>
            <SkeletonBar
              v-if="isMileagePolicyCurrentMonthLoading"
              class="h-10 w-full"
            />
            <div v-else class="relative w-full">
              <input
                id="hourAmount"
                v-model="currentHourAmount"
                type="number"
                name="hourAmount"
                class="w-52 rounded-md border px-3 py-2"
                :disabled="!isMileagePolicyCurrentMonthEditing"
              />
              <label
                for="hourAmount"
                class="absolute right-28 top-2 select-none"
                >원
                <span
                  v-if="mileageMinutePriceCurrentMonthRef !== -1"
                  class="text-muted-foreground-100"
                  >({{ mileageMinutePriceCurrentMonthRef }}원/분)</span
                >
              </label>
            </div>
            <p class="text-muted-foreground-100">
              기본 마일리지 소진 후 부과될 시간당 금액을 입력해주세요.
            </p>
          </div>
          <SettingSubmitButton
            v-if="
              (userRole === 'master' || userRole === 'middle_admin') &&
              mileagePolicyCurrentMonth?.isMileagePolicyBlank
            "
            :btn-text="'이번달 마일리지 정책 수정하기'"
            :is-loading="isUpdateMileagePolicyLoading"
            :is-editing="isMileagePolicyCurrentMonthEditing"
            :is-manual-submit="true"
            @submit="onSubmitCurrentMonth"
            @edit="handleEditMileagePolicy('current')"
            @cancel="handleCancelEditMileagePolicyCurrentMonth"
          />
        </div>
      </div>
    </form>
    <form id="nextMonthForm" class="flex w-fit flex-col items-start gap-8">
      <div class="flex flex-col gap-2">
        <h3 class="font-medium">월 기본 마일리지</h3>
        <SkeletonBar
          v-if="isMileagePolicyNextMonthLoading"
          key="skeleton-bar-1"
          class="h-10 w-full"
        />
        <div v-else class="flex flex-col items-start gap-2">
          <div>
            <div class="relative w-full">
              <div>
                <input
                  id="monthBaseMileage"
                  v-model="nextMonthBaseMileage"
                  type="number"
                  name="monthBaseMileage"
                  class="w-52 rounded-md border px-3 py-2"
                  :disabled="!isMileagePolicyNextMonthEditing"
                />
                <label
                  for="monthBaseMileage"
                  class="absolute right-28 top-2 select-none"
                  >분</label
                >
              </div>
            </div>
            <p class="mb-3 text-muted-foreground-100">
              매월 1일 세대당 충전될 마일리지 시간을 입력해주세요.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="font-medium">시간당 추가 과금 금액</h3>
            <SkeletonBar
              v-if="isMileagePolicyNextMonthLoading"
              class="h-10 w-full"
            />
            <div v-else class="relative w-full">
              <input
                id="hourlyPrice"
                v-model="nextHourlyPrice"
                type="number"
                name="hourlyPrice"
                class="w-52 rounded-md border px-3 py-2"
                :disabled="!isMileagePolicyNextMonthEditing"
              />
              <label
                for="hourlyPrice"
                class="absolute right-28 top-2 select-none"
                >원
                <span
                  v-if="mileageMinutePriceNextMonthRef !== -1"
                  class="text-muted-foreground-100"
                  >({{ mileageMinutePriceNextMonthRef }}원/분)</span
                >
              </label>
            </div>
            <p class="text-muted-foreground-100">
              기본 마일리지 소진 후 부과될 시간당 금액을 입력해주세요.
            </p>
          </div>
          <SettingSubmitButton
            :btn-text="'다음달 마일리지 정책 수정하기'"
            :is-loading="isUpdateMileagePolicyLoading"
            :is-editing="isMileagePolicyNextMonthEditing"
            :is-manual-submit="true"
            @submit="onSubmitNextMonth"
            @edit="handleEditMileagePolicy('next')"
            @cancel="handleCancelEditMileagePolicyNextMonth"
          />
        </div>
      </div>
    </form>
  </div>
  <form
    id="visitPurposeForm"
    class="mt-8 flex w-fit flex-col items-start gap-8"
  >
    <div class="flex max-w-[calc(100%-266px)] flex-col gap-2">
      <h3 class="whitespace-nowrap font-medium">방문 목적</h3>
      <p class="whitespace-nowrap text-muted-foreground-100">
        {{
          isVisitPurposeEditing
            ? '사용할 방문 목적을 선택해주세요.'
            : '사용 중인 방문 목적'
        }}. ({{ aptAllVisitPurposeCount }}개 중 {{ aptVisitPurposeUseCount }}개
        사용)
      </p>
      <div v-if="isAptVisitPurposeListLoading">
        <SkeletonBar class="h-10 w-72" />
      </div>
      <ul v-else class="flex flex-wrap gap-2">
        <li
          v-for="(purpose, purposeIndex) in isVisitPurposeEditing
            ? aptVisitPurposeListReactive
            : aptVisitPurposeList"
          :key="purpose.name"
          class="mb-2"
          @click.prevent="handleItemClick(purposeIndex, $event)"
        >
          <LabelBase
            :label-for="`${purpose.name}`"
            :class="`flex  items-center gap-2 rounded-md border px-3 py-2.5 ${
              isVisitPurposeEditing
                ? purpose.isUsed
                  ? 'cursor-pointer border-primary-100 bg-primary-20  text-primary-100'
                  : 'cursor-pointer border-dark-100 text-muted-foreground-100'
                : purpose.isUsed
                  ? 'cursor-not-allowed border-dark-200 bg-gray-200 text-primary-100'
                  : 'cursor-not-allowed border-dark-100 bg-gray-200 text-muted-foreground-100'
            }`"
          >
            <div class="flex items-center gap-2">
              <component
                :is="purpose.isUsed ? IconCheckFilled : IconCheckSolid"
                class="h-4 w-4"
                :class="
                  purpose.isUsed
                    ? 'fill-primary-100'
                    : 'fill-muted-foreground-50'
                "
              />
              <span
                class="select-none whitespace-nowrap text-sm font-medium leading-none"
              >
                {{ purpose.name }}
              </span>
            </div>
          </LabelBase>
          <input
            :id="`${purpose.name}`"
            v-model="aptVisitPurposeListReactive[purposeIndex].isUsed"
            :name="`visitPurposeUuidList[${purposeIndex}].isUsed`"
            type="checkbox"
            class="hidden"
          />
        </li>
      </ul>
    </div>
    <SettingSubmitButton
      :btn-text="'방문목적 수정하기'"
      :is-loading="isUpdateAptVisitPurposeListLoading"
      :is-editing="isVisitPurposeEditing"
      :is-manual-submit="true"
      @submit="onSubmitVisitPurpose"
      @edit="handleEditVisitPurpose"
      @cancel="handleCancelEditVisitPurpose"
    />
  </form>
</template>
