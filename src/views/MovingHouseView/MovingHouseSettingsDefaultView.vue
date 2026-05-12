<script setup>
  import IconDeleteLineWhite from '@assets/icons/icon-delete-line-white.svg';
  import IconPlusLineWhite from '@assets/icons/icon-plus-line-white.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import MoveReservationTimeField from '@components/common/MoveReservationTimeField.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import SettingSubmitButton from '@views/ParkingView/components/SettingSubmitButton.vue';
  import _ from 'lodash';
  import { useFieldArray, useForm } from 'vee-validate';
  import { ref, watch } from 'vue';


  import { BANK_LIST } from '@/constants/common.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import {
    useFetchMoveHouseSetting,
    useUpdateMoveHouseSetting,
  } from '@/lib/queries/aptAdmin/adtAdminMoveHouseQueries.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import swalSuccessModal from '@/lib/swalModal/swalSuccessModal.js';
  import {
    findInvalidTimeOrder,
    hasDuplicateTime,
    hasTimeOverlap,
  } from '@/lib/utils/timeValidation.js';
  import { moveHouseSettingFormSchema } from '@/schemas/movingHouse.js';
  import { useUserInfoStore } from '@/stores/auth.js';


  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const isEditing = ref(false);

  const { moveHouseSetting, isMoveHouseSettingLoading } =
    useFetchMoveHouseSetting(aptUuid);

  const { updateMoveHouseSettingMutation, isUpdateMoveHouseSettingLoading } =
    useUpdateMoveHouseSetting(aptUuid);

  const { defineField, setValues, handleSubmit, errors } = useForm({
    validationSchema: moveHouseSettingFormSchema,
  });

  const { remove, push, fields, replace, update } = useFieldArray(
    'moveReservationTimeList',
  );

  const [depositBank] = defineField('depositBank');
  const [depositAccount] = defineField('depositAccount');
  const [depositAccountHolder] = defineField('depositAccountHolder');
  const [moveReservationText] = defineField('moveReservationText');
  const [moveReservationPrice] = defineField('moveReservationPrice');

  const toggleEditMoveHouseHoliday = () => {
    isEditing.value = !isEditing.value;
  };

  const onSubmit = handleSubmit(async (submitValue) => {
    try {
      const timeList = submitValue.moveReservationTimeList || [];

      // 중복된 시간대 체크
      if (hasDuplicateTime(timeList)) {
        swalErrorModal({
          text: '동일한 이사 시간은 등록이 불가합니다',
        });
        return;
      }

      // 시작 시간이 종료 시간보다 늦은지 검증
      if (findInvalidTimeOrder(timeList)) {
        swalErrorModal({
          text: '시작 시간은 종료 시간보다 빨라야 합니다.',
        });
        return;
      }

      // 시간대 겹침 검사
      if (hasTimeOverlap(timeList)) {
        swalErrorModal({
          text: '시간대가 겹치는 항목은 불가능합니다.',
        });
        return;
      }

      swalConfirmModal({
        text: '이사예약 설정을 수정하시겠습니까?',
        callback: async () => {
          try {
            await updateMoveHouseSettingMutation({
              ...submitValue,
              useFlag: true,
            });

            swalSuccessModal({
              text: '이사예약 설정이 수정되었습니다.',
            });

            isEditing.value = false;
          } catch (error) {
            swalErrorModal({
              text: '이사예약 설정 수정에 실패했습니다.',
            });
          }
        },
      });
    } catch (error) {
      swalErrorModal({
        text: '이사예약 설정 수정에 실패했습니다.',
      });
    }
  });

  // 서버 데이터를 폼에 로드하는 함수
  const loadServerDataToForm = (settings) => {
    if (!settings) return;

    // 시간대 리스트 가져오기 및 hours/minutes 분리
    const timeList = _.get(settings, 'moveReservationTimeList', []);
    const formattedTimeList =
      timeList.length > 0
        ? timeList.map((item) => {
            const [startHours, startMinutes] = item.startTime.split(':');
            const [endHours, endMinutes] = item.endTime.split(':');
            return {
              ...item,
              startHours,
              startMinutes,
              endHours,
              endMinutes,
            };
          })
        : [
            {
              uuid: null,
              name: '',
              startTime: '00:00:00',
              endTime: '00:00:00',
              startHours: '00',
              startMinutes: '00',
              endHours: '00',
              endMinutes: '00',
            },
          ];

    // useFieldArray의 replace로 배열 설정
    replace(formattedTimeList);

    // setValues로 나머지 값 설정
    setValues({
      depositBank: _.get(settings, 'depositBank', ''),
      depositAccount: _.get(settings, 'depositAccount', ''),
      depositAccountHolder: _.get(settings, 'depositAccountHolder', ''),
      moveReservationText: _.get(settings, 'moveReservationText', ''),
      moveReservationPrice: _.get(settings, 'moveReservationPrice', 0),
    });
  };

  const handleCancel = () => {
    isEditing.value = false;
    loadServerDataToForm(moveHouseSetting?.value);
  };

  // 최초 로드 시 서버 데이터 설정
  watch(
    moveHouseSetting,
    (newData) => {
      loadServerDataToForm(newData);
    },
    { immediate: true },
  );

  useUnsavedChangesGuard([isEditing]);
</script>

<template>
  <form class="flex flex-col gap-8">
    <!-- 기본 예약 시간대 설정 -->
    <div class="flex max-w-[640px] flex-col gap-4">
      <div class="flex flex-nowrap items-center gap-2">
        <h3 class="font-bold">기본 예약 시간대 설정</h3>
      </div>
      <div
        :class="[
          'grid justify-start gap-4 bg-muted-50 px-4 py-2',
          isEditing
            ? 'grid-cols-[175px_300px_80px]'
            : 'grid-cols-[260px_300px_80px]',
        ]"
      >
        <span>시간대 이름</span>
        <span>이사 시간</span>
      </div>
      <div v-if="isMoveHouseSettingLoading" class="py-4">
        <SkeletonBar v-for="i in 3" :key="i" />
      </div>
      <div v-else>
        <p
          v-if="fields.length === 0"
          class="w-full py-8 text-center font-medium text-muted-foreground-100"
        >
          현재 등록된 시간대가 없습니다. <br />
          시간대를 추가해주세요.
        </p>
        <ul
          v-else
          class="mb-4 flex max-h-[270px] flex-col gap-3 overflow-y-auto"
        >
          <li
            v-for="(field, fieldIndex) in fields"
            :key="field.key"
            class="space-y-2 p-1"
          >
            <div
              :class="[
                'grid gap-4 px-4',
                isEditing
                  ? 'grid-cols-[175px_300px_80px]'
                  : 'grid-cols-[260px_300px_80px]',
              ]"
            >
              <div class="flex flex-col">
                <input
                  :id="`moveReservationTimeList_${fieldIndex}_name`"
                  v-model="field.value.name"
                  :disabled="!isEditing"
                  class="h-[38px] w-full rounded-md border px-3 py-2"
                  maxlength="20"
                  placeholder="시간대 이름 지정"
                  type="text"
                />
                <p
                  v-if="errors[`moveReservationTimeList[${fieldIndex}].name`]"
                  class="mt-1 text-xs text-destructive-100"
                >
                  {{ errors[`moveReservationTimeList[${fieldIndex}].name`] }}
                </p>
              </div>
              <div class="flex flex-col">
                <MoveReservationTimeField
                  :key="field.key"
                  :disabled="!isEditing"
                  :model-value="field.value"
                  @update:model-value="(val) => update(fieldIndex, val)"
                />
                <p
                  v-if="
                    errors[
                      `moveReservationTimeList[${fieldIndex}].startTime`
                    ] ||
                    errors[`moveReservationTimeList[${fieldIndex}].endTime`]
                  "
                  class="mt-1 text-xs text-destructive-100"
                >
                  {{
                    errors[
                      `moveReservationTimeList[${fieldIndex}].startTime`
                    ] ||
                    errors[`moveReservationTimeList[${fieldIndex}].endTime`]
                  }}
                </p>
              </div>
              <ButtonBase
                v-if="isEditing"
                type="button"
                color="destructive"
                custom-class="flex items-center gap-2 px-2"
                @click="remove(fieldIndex)"
              >
                <IconDeleteLineWhite class="h-5 w-5" />
                삭제
              </ButtonBase>
            </div>
            <input :value="field.value.uuid" type="hidden" />
          </li>
        </ul>
        <ButtonBase
          v-if="isEditing"
          key="button-base-2"
          type="button"
          color="primary"
          custom-class="flex w-full items-center justify-center gap-2 rounded-md border border-dark-100 px-4 py-2"
          @click="
            push({
              // uuid: null,
              name: '',
              startTime: '00:00:00',
              endTime: '00:00:00',
              startHours: '00',
              startMinutes: '00',
              endHours: '00',
              endMinutes: '00',
            })
          "
        >
          <IconPlusLineWhite class="h-5 w-5" />
          <span class="pretendard-14SemiBold">시간대 추가</span>
        </ButtonBase>
      </div>
    </div>
    <!-- 예약금 입금 정보 -->
    <div class="flex flex-col gap-4">
      <h3 class="font-bold">예약금 입금 정보</h3>
      <ul
        v-if="!isMoveHouseSettingLoading"
        class="flex w-fit flex-col gap-4 rounded-lg bg-muted-50 p-4"
      >
        <li class="flex items-center gap-4">
          <LabelBase
            asterisk
            class="w-[60px]"
            label-for="moveReservationPrice"
            label-text="가격"
          />
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <input
                id="moveReservationPrice"
                v-model.number="moveReservationPrice"
                :disabled="!isEditing"
                class="w-36 rounded-md border px-3 py-2 text-right"
                inputmode="numeric"
                type="text"
                @keydown="
                  (e) =>
                    e.key.length === 1 &&
                    isNaN(Number(e.key)) &&
                    e.preventDefault()
                "
              />
              <label for="moveReservationPrice">원</label>
            </div>
            <p
              v-if="errors.moveReservationPrice"
              class="mt-1 text-xs text-destructive-100"
            >
              {{ errors.moveReservationPrice }}
            </p>
          </div>
        </li>
        <li class="flex gap-4">
          <LabelBase
            asterisk
            class="min-w-[60px] pt-3"
            label-for="depositBank"
            label-text="입금정보"
          />
          <div class="flex gap-4">
            <div class="flex flex-col">
              <select
                id="depositBank"
                v-model="depositBank"
                :disabled="!isEditing"
                class="icon-chevron-down select-background-position-custom z-10 h-[42px] w-36 cursor-pointer rounded-md border bg-no-repeat py-2 pl-3 pr-[38px] disabled:bg-gray-100"
                name="depositBank"
              >
                <option value="">은행 선택</option>
                <option
                  v-for="option in BANK_LIST"
                  :key="option.key"
                  :value="option.key"
                >
                  {{ option.label }}
                </option>
              </select>
              <p
                v-if="errors.depositBank"
                class="mt-1 text-xs text-destructive-100"
              >
                {{ errors.depositBank }}
              </p>
            </div>
            <div class="flex flex-col">
              <input
                id="depositAccount"
                v-model="depositAccount"
                :disabled="!isEditing"
                :maxlength="20"
                class="w-52 rounded-md border px-3 py-2"
                name="depositAccount"
                placeholder="계좌번호 입력"
                type="text"
              />
              <p
                v-if="errors.depositAccount"
                class="mt-1 text-xs text-destructive-100"
              >
                {{ errors.depositAccount }}
              </p>
            </div>
            <div class="flex flex-col">
              <input
                id="depositAccountHolder"
                v-model="depositAccountHolder"
                :disabled="!isEditing"
                :maxlength="20"
                class="w-[154px] rounded-md border px-3 py-2"
                name="depositAccountHolder"
                placeholder="예금주 입력"
                type="text"
              />
              <p
                v-if="errors.depositAccountHolder"
                class="mt-1 text-xs text-destructive-100"
              >
                {{ errors.depositAccountHolder }}
              </p>
            </div>
          </div>
        </li>
        <li class="flex gap-4">
          <LabelBase
            class="min-w-[60px] pt-3"
            label-for="moveReservationText"
            label-text="메모"
          />
          <div class="flex flex-col">
            <textarea
              v-model="moveReservationText"
              :disabled="!isEditing"
              :maxlength="100"
              :placeholder="`입금 관련해 입주민에게 노출될 메모를 작성해주세요. \n ex. 입금 시 동/호수를 입력해주세요.`"
              class="border-border-input min-w-[540px] rounded-md border px-3 py-2 focus:border-primary-100"
              name="moveReservationText"
            />
            <div class="text-right text-muted-foreground-100">
              {{ moveReservationText?.length || 0 }}/100
            </div>
          </div>
        </li>
      </ul>
      <div v-if="isMoveHouseSettingLoading" class="w-80">
        <SkeletonBar v-for="i in 3" :key="i" />
      </div>
    </div>
    <SettingSubmitButton
      :is-editing="isEditing"
      :is-loading="isUpdateMoveHouseSettingLoading"
      :is-manual-submit="true"
      btn-text="이사예약 설정 수정하기"
      @cancel="handleCancel"
      @edit="toggleEditMoveHouseHoliday"
      @submit="onSubmit"
    />
  </form>
</template>
