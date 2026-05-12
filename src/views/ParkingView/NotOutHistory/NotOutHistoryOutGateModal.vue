<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalFieldCloseDatePickerTime from '@components/common/ModalFieldCloseDatePickerTime.vue';
  import ModalFieldCustomSelectBox from '@components/common/ModalFieldCustomSelectBox.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { useForm } from 'vee-validate';

  import { ADMIN_PARKING_OUT_HISTORY_TABLE_COLUMNS_LIST } from '@/constants/parking.js';
  import { useFetchInOutHistoryAptLprList } from '@/lib/queries/aptAdmin/aptAdminParkingQueries.js';
  import usePostNotOutHistoryOutGate from '@/lib/queries/parkingNotoutHistory/usePostNotOutHistoryOutGate.js';
  import findCarType from '@/lib/utils/findCarType.js';
  import findRegistType from '@/lib/utils/findRegistType.js';
  import formatContact from '@/lib/utils/formatContact.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import { notOutHistoryFormSchema } from '@/schemas/parking.js';

  const props = defineProps({
    detail: {
      type: Object,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const { inOutAptLprList, isinOutAptLprListLoading } =
    useFetchInOutHistoryAptLprList();

  const {
    postNotOutHistoryOutGateMutationAsync,
    isPostNotOutHistoryOutGatePending,
  } = usePostNotOutHistoryOutGate();

  const schema = notOutHistoryFormSchema(props.detail);

  const { handleSubmit, errors } = useForm({
    validationSchema: schema,
  });

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'phone') {
      return formatContact(value);
    }

    if (key === 'inParkingTime') {
      return formatDate(value).full();
    }

    if (key === 'registType') {
      return findRegistType(value);
    }

    if (key === 'carType') {
      return findCarType(value);
    }

    return value || '-';
  };

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (submitValues) => {
    await postNotOutHistoryOutGateMutationAsync({
      inParkingUuid: props.detail.uuid,
      outLprUuid: submitValues.outLprUuid,
      closeDate: submitValues.closeDate,
      closeHours: submitValues.closeHours,
      closeMinutes: submitValues.closeMinutes,
    });

    closeModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div
      class="max-h-[80vh] min-w-[400px] max-w-[500px] space-y-7 overflow-y-auto p-6"
    >
      <!-- 제목 -->
      <div class="flex items-center justify-between gap-3">
        <h2 class="pretendard-18Medium">출차 생성</h2>
        <button
          type="button"
          :disabled="isPostNotOutHistoryOutGatePending"
          @click="closeModal"
        >
          <CloseIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- 기존 정보 -->
      <div
        class="rounded-lg border border-defaults-secondary-border-secondary bg-defaults-secondary-background-secondary p-4"
      >
        <ul class="grid grid-cols-2 gap-2">
          <li
            v-for="column in ADMIN_PARKING_OUT_HISTORY_TABLE_COLUMNS_LIST.filter(
              (col) => col.key !== 'edit',
            )"
            :key="column.key"
            class="flex"
          >
            <span
              class="w-20 flex-shrink-0 text-defaults-secondary-text-secondary pretendard-14Regular"
            >
              {{ column.name }}
            </span>
            <span
              class="text-defaults-primary-text-primary pretendard-14Regular"
            >
              {{ renderFieldValue(column.key, detail?.[column.key]) }}
            </span>
          </li>
        </ul>
      </div>

      <form id="createOutForm" @submit="onSubmit">
        <ul class="space-y-4">
          <SpinnerCircle
            v-if="isinOutAptLprListLoading"
            color="blue"
            class="mx-auto flex"
          />
          <ModalFieldCustomSelectBox
            v-else
            id="outLprUuid"
            label-text="출차 게이트"
            :option-list="inOutAptLprList?.OUT || []"
            :errors="errors"
          />
          <ModalFieldCloseDatePickerTime :errors="errors" />
        </ul>
      </form>

      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isPostNotOutHistoryOutGatePending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="submit"
          color="primary"
          size="md"
          form="createOutForm"
          class="flex"
          :disabled="isPostNotOutHistoryOutGatePending"
        >
          <SpinnerCircle v-if="isPostNotOutHistoryOutGatePending" />
          <template v-else>생성</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
