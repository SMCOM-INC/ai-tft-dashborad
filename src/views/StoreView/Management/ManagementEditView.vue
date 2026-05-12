<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputText from '@components/common/InputText.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';
  import { computed, watch } from 'vue';

  import { HOURS_IN_DAY, VALID_MINUTES } from '@/constants/store.js';
  import useGetStoreDetail from '@/lib/queries/store/useGetStoreDetail.js';
  import usePatchStore from '@/lib/queries/store/usePatchStore.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatMinutesAbs from '@/lib/utils/formatMinutesAbs.js';
  import { storeManagementEditForm } from '@/schemas/store.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { storeDetail, isStoreDetailLoading } = useGetStoreDetail();
  const { patchStoreMutation, isPatchStorePending } = usePatchStore();

  const {
    values,
    handleSubmit,
    errors,
    meta,
    defineField,
    setValues,
    setFieldValue,
  } = useForm({
    validationSchema: storeManagementEditForm,
  });

  const [freeParkingDiscountHours] = defineField('freeParkingDiscountHours');
  const [freeParkingDiscountMinutes] = defineField(
    'freeParkingDiscountMinutes',
  );

  // 상가 관리자 아이디와 초기 비밀번호 시작은 'aptId에서 3 index 부터 있는 숫자'로 함
  const slicedAptId = computed(() => {
    return userInfo?.aptId.slice(3);
  });

  const onSubmit = handleSubmit((submitValue) => {
    patchStoreMutation({
      storeName: submitValue.storeName,
      representativePhone: submitValue.representativePhone,
      representativeName: submitValue.representativeName,
      freeParkingDiscountHours: submitValue.freeParkingDiscountHours,
      freeParkingDiscountMinutes: submitValue.freeParkingDiscountMinutes,
    });
  });

  watch(
    storeDetail,
    (newValue) => {
      if (newValue) {
        const { storeName, freeParkingDiscountMinute, ...restValues } =
          newValue;

        const { hours, minutes } = formatMinutesAbs(freeParkingDiscountMinute);

        setValues(restValues);
        setFieldValue('storeName', decodeUrl(storeName));
        setFieldValue('freeParkingDiscountHours', hours || 0);
        setFieldValue('freeParkingDiscountMinutes', minutes || 0);
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div>
    <div class="flex items-start justify-between">
      <PageTitleBase has-back-button title="상가 수정하기" class="mb-0" />
      <ButtonBase
        form="storeAddForm"
        type="submit"
        :color="meta.valid ? 'primary' : 'primary-disabled'"
        size="md"
        class="flex h-fit items-center gap-2"
        :disabled="isPatchStorePending"
        @click="onSubmit"
      >
        <SpinnerCircle v-if="isPatchStorePending" />
        <template v-else>수정하기</template>
      </ButtonBase>
    </div>
    <div v-if="isStoreDetailLoading" class="flex w-full justify-center py-20">
      <SpinnerCircle color="blue" />
    </div>
    <form v-else id="storeAddForm" class="space-y-10" @submit="onSubmit">
      <!-- 상가 기본 정보 -->
      <section
        class="space-y-5 rounded-lg bg-defaults-secondary-background-mono p-7"
      >
        <h3 class="pretendard-20SemiBold">상가 기본 정보</h3>
        <ul class="space-y-5">
          <!-- 동, 호수 -->
          <div class="flex w-full gap-2">
            <!-- 동 -->
            <InputText
              id="storeDong"
              type="text"
              size="xl"
              label="동"
              placeholder="동 입력"
              class-custom="w-full"
              :disabled="true"
            />
            <!-- 호수 -->
            <InputText
              id="storeHo"
              type="text"
              size="xl"
              label="호수"
              placeholder="호수 입력"
              class-custom="w-full"
              :disabled="true"
            />
          </div>
          <!-- 상가명 -->
          <InputText
            id="storeName"
            type="text"
            size="xl"
            label="상가명"
            :maxlength="30"
            placeholder="상가명 입력"
            :error="errors.storeName"
            class-custom="w-full"
          />
          <!-- 대표 연락처 -->
          <InputText
            id="representativePhone"
            type="text"
            size="xl"
            label="대표 연락처"
            :maxlength="30"
            placeholder="대표 연락처 입력"
            :error="errors.representativePhone"
            class-custom="w-full"
          />
          <!-- 대표 이름 -->
          <InputText
            id="representativeName"
            type="text"
            size="xl"
            label="대표 이름"
            :maxlength="30"
            placeholder="대표 이름 입력"
            :error="errors.representativeName"
            class-custom="w-full"
          />
          <!-- 계정(아이디) -->
          <div>
            <div
              class="text-defaults-secondary-text-secondary pretendard-16Medium"
            >
              계정
            </div>
            <div class="flex gap-2">
              <div class="space-x-2">
                <span
                  class="text-defaults-tertiary-text-tertiary pretendard-16Regular"
                  >로그인 아이디</span
                >
                <span class="pretendard-16Medium">
                  {{ `${slicedAptId}${values?.storeDong}${values?.storeHo}` }}
                </span>
              </div>
            </div>
          </div>
        </ul>
      </section>
      <!-- 할인 설정 -->
      <section
        class="space-y-5 rounded-lg bg-defaults-secondary-background-mono p-7"
      >
        <h3 class="pretendard-20SemiBold">할인 설정</h3>
        <div class="space-y-2">
          <h4
            class="text-defaults-secondary-text-secondary pretendard-16SemiBold"
          >
            방문자당 무료 제공 시간
          </h4>
          <div class="flex gap-1">
            <select
              v-model="freeParkingDiscountHours"
              class="h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
              required
              name="freeParkingDiscountHours"
            >
              <option :value="0">0시간</option>
              <option
                v-for="number in HOURS_IN_DAY"
                :key="number"
                :value="number"
              >
                {{ number }}시간
              </option>
            </select>
            <select
              v-model="freeParkingDiscountMinutes"
              class="h-[38px] w-28 rounded-[4px] border border-defaults-primary-border-primary bg-[url('@assets/icons/icon-chevron-down-black.svg')] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm"
              required
            >
              <option value="">선택</option>
              <option
                v-for="number in VALID_MINUTES"
                :key="number"
                :value="number"
              >
                {{ number }}분
              </option>
            </select>
          </div>
          <p class="h-5 text-alerts-error-text-error">
            {{
              errors.freeParkingDiscountHours ||
              errors.freeParkingDiscountMinutes
            }}
          </p>
        </div>
      </section>
    </form>
  </div>
</template>
``
