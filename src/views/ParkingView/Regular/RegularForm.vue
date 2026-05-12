<script setup>
  import CloseIcon from '@assets/icons/icon-close-darkGray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalFieldBusinessType from '@components/common/ModalFieldBusinessType.vue';
  import ModalFieldCarNum from '@components/common/ModalFieldCarNum.vue';
  import ModalFieldDongHo from '@components/common/ModalFieldDongHo.vue';
  import ModalFieldMemo from '@components/common/ModalFieldMemo.vue';
  import ModalFieldName from '@components/common/ModalFieldName.vue';
  import ModalFieldPhone from '@components/common/ModalFieldPhone.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { useForm } from 'vee-validate';
  import { computed, onMounted, ref, watch } from 'vue';

  import { REGIST_TYPE_MAP } from '@/constants/common.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useWallPadContent from '@/lib/composables/parking/useWallPadContent.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import { formatDateObject } from '@/lib/utils/formatDate.js';
  import { getRegularCarFormSchema } from '@/schemas/parking.js';

  const props = defineProps({
    mode: {
      type: String,
      required: true,
    },
    initialInfo: {
      type: Object,
      required: false,
      default: undefined,
    },
    householdMutation: {
      type: Function,
      required: true,
    },
    businessMutation: {
      type: Function,
      required: true,
    },
    isHouseholdSuccess: {
      type: Boolean,
      required: true,
    },
    isBusinessSuccess: {
      type: Boolean,
      required: true,
    },
    isHouseholdPending: {
      type: Boolean,
      required: true,
    },
    isBusinessPending: {
      type: Boolean,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const { getCurrentRoutePath } = useNavigate();

  const { hasWallPadUI } = useWallPadContent();

  const isEndDateDisabled = ref(false);

  const isCreateMode = computed(() => {
    return props.mode === 'create';
  });

  const registType = computed(() => {
    return getCurrentRoutePath().split('/')[3];
  });

  const isHouseholdRegistType = computed(() => {
    return registType.value === 'house';
  });

  const schema = computed(() => {
    return toTypedSchema(
      getRegularCarFormSchema({
        type: registType.value,
        withAlarm: hasWallPadUI,
      }),
    );
  });

  const initialValues = computed(() => {
    if (isCreateMode.value) {
      return {
        startDate: new Date(),
        endDate: new Date(),
      };
    }

    return {};
  });

  const { errors, handleSubmit, setFieldValue, setValues, defineField } =
    useForm({
      validationSchema: schema,
      initialValues,
    });

  const [regularCarType] = defineField('regularCarType');
  const [startDate] = defineField('startDate');
  const [endDate] = defineField('endDate');
  const [parkingWallPadAlarm] = defineField('parkingWallPadAlarm');

  // 등록 모달 닫기
  const closeModal = () => {
    emits('close');
  };

  // form 제출
  const onSubmit = handleSubmit((submitValues) => {
    swalConfirmModal({
      title: `정기차량 ${isCreateMode.value ? '등록' : '수정'}`,
      text: `정기차량을 ${isCreateMode.value ? '등록' : '수정'}하시겠습니까?`,
      callback: () => {
        const commonSubmitVales = {
          uuid: isCreateMode.value ? undefined : props.initialInfo.uuid,
          carNum: submitValues.carNum,
          phone: submitValues.phone,
          name: submitValues.name,
          startDate: formatDateObject(submitValues.startDate, 'hyphen'),
          endDate: formatDateObject(submitValues.endDate, 'hyphen'),
          memo: submitValues.memo,
        };

        if (isHouseholdRegistType.value) {
          return props.householdMutation({
            ...commonSubmitVales,
            regularCarType: submitValues.regularCarType,
            dong: submitValues.dong,
            ho: submitValues.ho,
            parkingWallPadAlarm: submitValues.parkingWallPadAlarm,
          });
        }

        return props.businessMutation({
          ...commonSubmitVales,
          businessTypeUuid: submitValues.businessTypeUuid,
        });
      },
    });
  });

  // 정기권 만료일 미지정 체크박스 변경
  watch(isEndDateDisabled, (newValue) => {
    if (newValue) {
      setFieldValue('endDate', new Date('9999-12-31'));
    } else {
      setFieldValue('endDate', new Date());
    }
  });

  // API CALL 성공시 모달 닫기
  watch(
    [() => props.isHouseholdSuccess, () => props.isBusinessSuccess],
    ([newHouseholdSuccess, newBusinessSuccess]) => {
      if (newHouseholdSuccess || newBusinessSuccess) {
        closeModal();
      }
    },
  );

  watch(
    () => props.initialInfo,
    (newValue) => {
      if (newValue && props.mode === 'edit') {
        // 날짜 비교
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const EXPIRED_DATE = '2099-12-31 23:59:59';

        // 공통 value 값 설정
        setValues({
          carNum: newValue.carNum,
          phone: newValue.phone,
          name: newValue.name,
          memo: newValue.memo,
          parkingWallPadAlarm: newValue.notificationFlag,
          startDate: new Date(newValue.startDate),
          endDate: new Date(newValue.endDate),
        });

        // 만료일 미지정 체크박스 설정
        isEndDateDisabled.value = newValue.endDate === EXPIRED_DATE;

        if (isHouseholdRegistType.value) {
          // 세대 value 값 설정
          setValues({
            regularCarType: newValue.regularCarType,
            dong: newValue.dong,
            ho: newValue.ho,
          });
        } else {
          // 업무 value 값 설정
          setValues({
            businessTypeUuid: newValue.businessTypeUuid,
          });
        }
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    // 등록 모달
    if (isCreateMode.value) {
      if (isHouseholdRegistType.value) {
        // 세대 value 값 설정
        setFieldValue('regularCarType', 'RESIDENT');
      }
    }
  });
</script>

<template>
  <ModalBaseNew>
    <div class="max-h-[80vh] w-[512px] overflow-y-auto rounded-lg bg-white p-6">
      <header class="mb-4 flex items-center justify-between">
        <h1 class="select-none text-lg font-medium">
          {{ REGIST_TYPE_MAP[registType] }} 정기 차량
          {{ mode === 'create' ? '등록' : '수정' }}하기
        </h1>
        <button
          type="button"
          class="w-fit"
          :disabled="isHouseholdPending || isBusinessPending"
          @click="closeModal"
        >
          <CloseIcon class="h-5" aria-hidden="true" />
        </button>
      </header>
      <form id="createRegularForm" @submit="onSubmit">
        <ul class="flex flex-col gap-4">
          <!-- 정기차량 유형 및 업무 목적 -->
          <li v-if="isHouseholdRegistType" class="flex flex-col gap-2">
            <LabelBase
              label-for="regularCarType"
              label-text="정기 차량 유형"
              asterisk
            />
            <div>
              <ul class="flex w-full gap-2">
                <li class="flex w-full gap-2 rounded-md border p-3">
                  <input
                    id="regularCarType-RESIDENT"
                    v-model="regularCarType"
                    name="regularCarType"
                    type="radio"
                    value="RESIDENT"
                    :disabled="!isHouseholdRegistType"
                  />
                  <LabelBase
                    label-for="regularCarType-RESIDENT"
                    label-text="입주민 차량"
                  />
                </li>
                <li class="flex w-full gap-2 rounded-md border p-3">
                  <input
                    id="regularCarType-REGULAR"
                    v-model="regularCarType"
                    name="regularCarType"
                    type="radio"
                    value="REGULAR"
                    :disabled="!isHouseholdRegistType"
                  />
                  <LabelBase
                    label-for="regularCarType-REGULAR"
                    label-text="정기 차량"
                  />
                </li>
              </ul>
              <TextError v-if="props.errors?.regularCarType">
                {{ props.errors?.regularCarType }}
              </TextError>
            </div>
          </li>
          <ModalFieldBusinessType
            v-if="!isHouseholdRegistType"
            :errors="errors"
          />
          <!-- 차량번호 -->
          <ModalFieldCarNum :errors="errors" />
          <!-- 연락처 -->
          <ModalFieldPhone id="phone" :errors="errors" label-text="연락처" />
          <!-- 동호수 -->
          <ModalFieldDongHo
            v-if="isHouseholdRegistType"
            :errors="errors"
            asterisk
            type="text"
          />
          <!-- 이름 -->
          <ModalFieldName id="name" :errors="errors" />
          <!-- 정기권 시작일 -->
          <li class="flex flex-col gap-2">
            <LabelBase
              label-for="startDate"
              label-text="정기권 시작일"
              asterisk
            />
            <VueDatePicker
              v-model="startDate"
              locale="ko"
              no-today
              :enable-time-picker="false"
              auto-apply
              format="yyyy.MM.dd"
              placeholder="YYYY.MM.DD"
              class="custom-date-picker"
            />
            <TextError v-if="errors.startDate" key="text-error-1">{{
              errors.startDate
            }}</TextError>
          </li>
          <!-- 정기권 만료일 -->
          <li class="flex flex-col gap-2">
            <div class="flex justify-between">
              <LabelBase
                label-for="endDate"
                label-text="정기권 만료일"
                asterisk
              />
              <div class="flex gap-2">
                <input
                  id="isEndDateDisabled"
                  v-model="isEndDateDisabled"
                  type="checkbox"
                  name="isEndDateDisabled"
                  class="h-4 w-4"
                />
                <LabelBase label-for="isEndDateDisabled" label-text="미지정" />
              </div>
            </div>
            <VueDatePicker
              v-model="endDate"
              locale="ko"
              no-today
              :enable-time-picker="false"
              auto-apply
              format="yyyy.MM.dd"
              placeholder="YYYY.MM.DD"
              class="custom-date-picker"
              :disabled="isEndDateDisabled"
            />
            <TextError v-if="errors.endDate">{{ errors.endDate }}</TextError>
          </li>
          <!-- 메모 -->
          <ModalFieldMemo :errors="errors" />
          <!-- 입출차 시 월패드 알림 -->
          <li
            v-if="hasWallPadUI && isHouseholdRegistType"
            class="flex flex-col gap-2"
          >
            <LabelBase
              label-for="parkingWallPadAlarm"
              label-text="입출차 시 월패드 알림"
              asterisk
            />
            <div>
              <ul class="flex w-full gap-2">
                <li class="flex w-full gap-2 rounded-md border p-3">
                  <input
                    id="parkingWallPadAlarm-yes"
                    v-model="parkingWallPadAlarm"
                    type="radio"
                    name="parkingWallPadAlarm"
                    :value="true"
                  />
                  <LabelBase
                    label-for="parkingWallPadAlarm-yes"
                    label-text="예"
                  />
                </li>
                <li class="flex w-full gap-2 rounded-md border p-3">
                  <input
                    id="parkingWallPadAlarm-no"
                    v-model="parkingWallPadAlarm"
                    type="radio"
                    name="parkingWallPadAlarm"
                    :value="false"
                  />
                  <LabelBase
                    label-for="parkingWallPadAlarm-no"
                    label-text="아니오"
                  />
                </li>
              </ul>
              <TextError v-if="errors.parkingWallPadAlarm">{{
                errors.parkingWallPadAlarm
              }}</TextError>
            </div>
          </li>
        </ul>
        <div class="pt-6">
          <ButtonBase
            form="createRegularForm"
            type="submit"
            color="primary"
            custom-class="w-full"
          >
            <div
              v-if="props.isHouseholdPending || props.isBusinessPending"
              class="flex items-center justify-center gap-2"
            >
              <span>{{ mode === 'create' ? '등록' : '수정' }}중..</span>
              <SpinnerWhiteView />
            </div>
            <div v-else class="w-full">
              {{ mode === 'create' ? '등록' : '수정' }}하기
            </div>
          </ButtonBase>
        </div>
      </form>
    </div>
  </ModalBaseNew>
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
