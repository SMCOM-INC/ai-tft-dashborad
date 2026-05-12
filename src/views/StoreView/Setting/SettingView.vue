<script setup>
  import IconArrowCornerDownRightDarkGray from '@assets/icons/icon-arrowCorner-downRight-darkGray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';
  import { watch } from 'vue';

  import {
    SETTING_CHARGE_TYPE,
    SETTING_CHARGE_TYPES,
    SETTING_DISCOUNTS_TYPES,
    SETTING_TURN_TYPE,
    SETTING_TURN_TYPES,
  } from '@/constants/store.js';
  import useGetStoreSettingPolicy from '@/lib/queries/store/useGetStoreSettingPolicy.js';
  import usePatchStoreSettingPolicy from '@/lib/queries/store/usePatchStoreSettingPolicy.js';
  import { storeParkingSettingForm } from '@/schemas/store.js';

  const {
    storeSettingPolicy,
    isStoreSettingPolicyLoading,
    storeSettingPolicyError,
  } = useGetStoreSettingPolicy();

  const {
    patchStoreSettingPolicyMutationAsync,
    isPatchStoreSettingPolicyPending,
  } = usePatchStoreSettingPolicy();

  const { handleSubmit, errors, meta, defineField, setValues, setFieldValue } =
    useForm({
      validationSchema: storeParkingSettingForm,
    });

  const [parkingDiscountType] = defineField('parkingDiscountType');
  const [billingType] = defineField('billingType');
  const [bank] = defineField('bank');
  const [accountHolder] = defineField('accountHolder');
  const [account] = defineField('account');
  const [parkingPrice] = defineField('parkingPrice');
  const [turningCarPolicy] = defineField('turningCarPolicy');
  const [turningMinute] = defineField('turningMinute');

  watch(
    storeSettingPolicy,
    (newValue) => {
      const EMPTY_NUMBER = 0;

      // 주차 정책을 설정하지 않았을 경우, 아래와 같은 errorCode 뜸
      if (
        !newValue ||
        storeSettingPolicyError?.data?.error?.errorCode ===
          'STORE_PARKING_POLICY_NOT_FOUND'
      ) {
        return;
      }

      const {
        accountNumber,
        turningMinute: turningMinuteNewValue,
        ...restValues
      } = newValue;

      const convertTurningCarPolicy =
        turningMinuteNewValue > EMPTY_NUMBER
          ? SETTING_TURN_TYPE.YES
          : SETTING_TURN_TYPE.NO;

      if (newValue.accountNumber) {
        const [newValueBank, newValueAccountHolder, newValueAccount] =
          newValue.accountNumber.split('_');

        setValues({
          ...restValues,
          turningCarPolicy: convertTurningCarPolicy,
          turningMinute: turningMinuteNewValue,
          bank: newValueBank,
          accountHolder: newValueAccountHolder,
          account: newValueAccount,
        });
      }

      return setValues({
        ...restValues,
        turningCarPolicy: convertTurningCarPolicy,
        turningMinute: turningMinuteNewValue,
      });
    },
    { immediate: true },
  );

  const onSubmit = handleSubmit(async (submitValue) => {
    await patchStoreSettingPolicyMutationAsync({
      account: submitValue.account,
      accountHolder: submitValue.accountHolder,
      bank: submitValue.bank,
      billingType: submitValue.billingType,
      parkingDiscountType: submitValue.parkingDiscountType,
      parkingPrice: submitValue.parkingPrice,
      turningCarPolicy: submitValue.turningCarPolicy,
      turningMinute: submitValue.turningMinute,
    });

    if (submitValue.billingType === SETTING_CHARGE_TYPE.POSTPAID) {
      setFieldValue('bank', '');
      setFieldValue('accountHolder', '');
      setFieldValue('account', '');
    }
  });
</script>

<template>
  <div>
    <div class="flex items-start justify-between">
      <PageTitleBase
        title="주차 관리 설정"
        paragraph="단지 상가 전용 주차 정책을 설정합니다."
        class="mb-0"
      />
      <ButtonBase
        form="settingForm"
        type="submit"
        :color="meta.valid ? 'primary' : 'primary-disabled'"
        size="md"
        class="flex items-center gap-2"
        :disabled="isPatchStoreSettingPolicyPending"
        @click="onSubmit"
      >
        저장하기
        <SpinnerCircle v-if="isPatchStoreSettingPolicyPending" />
      </ButtonBase>
    </div>
    <div
      v-if="isStoreSettingPolicyLoading"
      class="flex w-full justify-center py-20"
    >
      <SpinnerCircle color="blue" />
    </div>
    <form v-else class="space-y-10">
      <!-- 할인 및 정산 정책 -->
      <section
        class="space-y-5 rounded-lg bg-defaults-secondary-background-mono p-7"
      >
        <h3 class="pretendard-20SemiBold">할인 및 정산 정책</h3>
        <ul class="space-y-5">
          <li
            class="space-y-2 border-b border-b-defaults-primary-border-primary pb-5"
          >
            <h4
              class="text-defaults-secondary-text-secondary pretendard-16SemiBold"
            >
              할인 방식
            </h4>
            <div class="flex gap-2">
              <label
                v-for="type in SETTING_DISCOUNTS_TYPES"
                :key="type.key"
                :class="`flex w-[400px] cursor-pointer items-start gap-3 rounded-md border border-defaults-primary-border-primary bg-defaults-primary-background-mono p-4 ${type.key === parkingDiscountType ? 'border-primary2-pc-indigo-300' : ''}`"
              >
                <input
                  v-model="parkingDiscountType"
                  type="radio"
                  :value="type.key"
                  class="mt-1"
                  name="parkingDiscountType"
                />
                <div>
                  <div class="pretendard-16Regular">{{ type.label }}</div>
                  <div class="text-defaults-secondary-text-secondary">
                    {{ type.description }}
                  </div>
                </div>
              </label>
            </div>
            <p class="h-5 text-alerts-error-text-error">
              {{ errors.parkingDiscountType }}
            </p>
          </li>
          <li class="space-y-2">
            <h4
              class="text-defaults-secondary-text-secondary pretendard-16SemiBold"
            >
              유료 정산 시간 처리 방식
            </h4>
            <div class="flex gap-2">
              <label
                v-for="type in SETTING_CHARGE_TYPES"
                :key="type.key"
                :class="`flex w-[400px] cursor-pointer items-start gap-3 rounded-md border border-defaults-primary-border-primary bg-defaults-primary-background-mono p-4 ${type.key === billingType ? 'border-primary2-pc-indigo-300' : ''}`"
              >
                <input
                  v-model="billingType"
                  type="radio"
                  :value="type.key"
                  class="mt-1"
                  name="billingType"
                />
                <div>
                  <div class="pretendard-16Regular">{{ type.label }}</div>
                  <div class="text-defaults-secondary-text-secondary">
                    {{ type.description }}
                  </div>
                </div>
              </label>
            </div>
            <div
              v-if="billingType === SETTING_CHARGE_TYPE.PREPAID"
              class="flex gap-2.5 rounded-lg bg-neutral-100 p-4"
            >
              <IconArrowCornerDownRightDarkGray />
              <div class="w-full">
                <h5 class="text-defaults-secondary-text-secondary">
                  충전 신청 계좌
                </h5>
                <div class="flex w-full gap-1">
                  <div class="relative flex w-full max-w-72 items-center gap-1">
                    <span class="absolute left-4">은행명 입력</span>
                    <input
                      id="bank"
                      v-model="bank"
                      type="text"
                      name="bank"
                      class="w-full rounded-md border px-3 py-2 pl-24"
                      maxlength="20"
                    />
                  </div>
                  <div class="relative flex w-full max-w-72 items-center gap-1">
                    <span class="absolute left-4">예금주 입력</span>
                    <input
                      id="accountHolder"
                      v-model="accountHolder"
                      type="text"
                      name="accountHolder"
                      class="w-full rounded-md border px-3 py-2 pl-24"
                      maxlength="30"
                    />
                  </div>
                  <div class="relative flex w-full max-w-80 items-center gap-1">
                    <span class="absolute left-4">계좌번호 입력</span>
                    <input
                      id="account"
                      v-model="account"
                      type="text"
                      name="account"
                      class="w-full rounded-md border px-3 py-2 pl-28"
                      maxlength="20"
                    />
                  </div>
                </div>
                <p class="h-5 text-alerts-error-text-error">
                  {{ errors.bank || errors.accountHolder || errors.account }}
                </p>
              </div>
            </div>
            <p class="h-5 text-alerts-error-text-error">
              {{ errors.billingType }}
            </p>
          </li>
          <li class="space-y-2">
            <h4
              class="text-defaults-secondary-text-secondary pretendard-16SemiBold"
            >
              요금 정산 기준
            </h4>
            <div class="relative flex w-fit items-center gap-1">
              <span class="absolute left-4">30분 당</span>
              <input
                id="parkingPrice"
                v-model="parkingPrice"
                type="number"
                class="w-52 rounded-md border px-3 py-2 pr-10 text-right"
              />
              <LabelBase
                label-for="parkingPrice"
                label-text="원"
                class="absolute right-4"
              />
            </div>
            <p v-if="errors.parkingPrice" class="text-alerts-error-text-error">
              {{ errors.parkingPrice }}
            </p>
            <p v-else class="text-defaults-tertiary-text-tertiary">
              30분 기준으로 적용할 기본 요금을 입력해주세요. (예: 30분당
              1,000원)
            </p>
          </li>
        </ul>
      </section>
      <!-- 회차 시간 정책 -->
      <section
        class="space-y-5 rounded-lg bg-defaults-secondary-background-mono p-7"
      >
        <h3 class="pretendard-20SemiBold">회차 시간 정책</h3>
        <p class="text-defaults-secondary-text-secondary">
          회차 시간은 상가 방문 없이 정차한 차량에만 적용되며, 상가 방문 후 주차
          할인을 적용받은 차량에게는 회차 시간이 별도로 차감되지 않습니다.<br />즉,
          회차 시간은 상가 무료 제공 시간과 중복 적용되지 않습니다. <br />
          예) 회차 시간 30분 + 상가 할인 2시간 → 총 무료 제공 시간은 2시간 (회차
          시간은 미적용)
        </p>
        <div class="space-y-2">
          <h4
            class="text-defaults-secondary-text-secondary pretendard-16SemiBold"
          >
            초기 요금 방식
          </h4>
          <div class="flex gap-2">
            <label
              v-for="type in SETTING_TURN_TYPES"
              :key="type.key"
              :class="`flex w-[400px] cursor-pointer items-start gap-3 rounded-md border border-defaults-primary-border-primary bg-defaults-primary-background-mono p-4 ${type.key === turningCarPolicy ? 'border-primary2-pc-indigo-300' : ''}`"
            >
              <input
                v-model="turningCarPolicy"
                type="radio"
                :value="type.key"
                class="mt-1"
                name="turningCarPolicy"
              />
              <div>
                <div class="pretendard-16Regular">{{ type.label }}</div>
                <div class="text-defaults-secondary-text-secondary">
                  {{ type.description }}
                </div>
              </div>
            </label>
          </div>
          <div
            v-if="turningCarPolicy === 'YES'"
            class="flex gap-2.5 rounded-lg bg-neutral-100 p-4"
          >
            <IconArrowCornerDownRightDarkGray />
            <div class="w-full">
              <h5 class="text-defaults-secondary-text-secondary">
                무료 회차 제공 시간
              </h5>
              <div class="relative flex w-fit items-center gap-1">
                <input
                  id="turningMinute"
                  v-model="turningMinute"
                  type="number"
                  name="turningMinute"
                  class="w-52 rounded-md border px-3 py-2 pr-10 text-right"
                  maxlength="7"
                />
                <LabelBase
                  label-for="turningMinute"
                  label-text="분"
                  class="absolute right-4"
                />
              </div>
              <p class="h-5 text-alerts-error-text-error">
                {{ errors.turningMinute }}
              </p>
            </div>
          </div>
          <p class="h-5 text-alerts-error-text-error">
            {{ errors.turningCarPolicy }}
          </p>
        </div>
      </section>
    </form>
  </div>
</template>
