<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBase from '@components/common/ModalBase.vue';
  import ModalFieldBusinessType from '@components/common/ModalFieldBusinessType.vue';
  import ModalFieldCarNum from '@components/common/ModalFieldCarNum.vue';
  import ModalFieldCarType from '@components/common/ModalFieldCarType.vue';
  import ModalFieldCloseDatePickerTime from '@components/common/ModalFieldCloseDatePickerTime.vue';
  import ModalFieldCustomSelectBox from '@components/common/ModalFieldCustomSelectBox.vue';
  import ModalFieldDongHo from '@components/common/ModalFieldDongHo.vue';
  import ModalFieldMemo from '@components/common/ModalFieldMemo.vue';
  import ModalFieldOpenDatePickerTime from '@components/common/ModalFieldOpenDatePickerTime.vue';
  import ModalFieldPhone from '@components/common/ModalFieldPhone.vue';
  import ModalFieldRegistType from '@components/common/ModalFieldRegistType.vue';
  import ModalFieldVisitPurpose from '@components/common/ModalFieldVisitPurpose.vue';
  import InOutCreateSubmitModal from '@views/ParkingView/InOutHistory/InOutHistoryCreateSubmitModal.vue';
  import { useForm } from 'vee-validate';
  import { reactive, ref, watch } from 'vue';

  import { useFetchInOutHistoryAptLprList } from '@/lib/queries/aptAdmin/aptAdminParkingQueries.js';
  import usePostInOutHistory from '@/lib/queries/parkingInoutHistory/usePostInOutHistory.js';
  import { inOutHistoryFormSchema } from '@/schemas/parking.js';

  const inOutHistoryCreateModalRef = ref(null);
  const selectedRegistType = ref('HOUSEHOLD');

  const initialFormValues = {
    carNum: '',
    carType: '',
    openDate: '',
    openHours: '',
    openMinutes: '',
    closeDate: '',
    closeHours: '',
    closeMinutes: '',
    entranceGate: '',
    departureGate: '',
    dong: '',
    ho: '',
    visitPurposeUuid: 'GENERAL',
    phone: '',
    memo: '',
  };

  const { values, errors, resetForm, handleSubmit } = useForm({
    validationSchema: inOutHistoryFormSchema,
    initialValues: {
      ...initialFormValues,
      registType: 'HOUSEHOLD',
    },
  });
  const isInOutHistoryModal = ref(false);
  const formValues = reactive({});

  const handleModalClose = () => {
    resetForm();
    selectedRegistType.value = 'HOUSEHOLD';
  };

  const handleOpenModal = () => {
    if (inOutHistoryCreateModalRef.value) {
      inOutHistoryCreateModalRef.value.openModal();
    }
  };
  const { inOutAptLprList, isinOutAptLprListLoading } =
    useFetchInOutHistoryAptLprList();

  const { createInOutHistoryMutationAsync } = usePostInOutHistory();

  // 차량 유형 List
  const carTypeList = reactive([
    { key: 'REGULAR', name: '정기차량' },
    { key: 'GENERAL', name: '일반방문' },
    { key: 'REGULAR_RESIDENT', name: '입주민' },
    { key: 'RESERVATION', name: '방문예약' },
    { key: 'ALWAYS_ALLOW', name: '항상허용' },
  ]);

  // 세대 carTypeList
  const createSubmitInOutHistory = async () => {
    await createInOutHistoryMutationAsync(formValues);
    inOutHistoryCreateModalRef.value.closeModal();
  };

  // 업무 carTypeList
  const businessCarTypeList = carTypeList.slice(0, 2);

  const onSubmit = handleSubmit((data) => {
    if (data) {
      isInOutHistoryModal.value = true;
      formValues.value = data;
    }
  });
  const closeModal = () => {
    isInOutHistoryModal.value = false;
  };

  watch(
    () => values.registType,
    (newValue) => {
      if (newValue === 'BUSINESS') {
        resetForm({
          values: {
            ...initialFormValues,
            registType: 'BUSINESS',
            openDate: new Date(),
            openHours: '00',
            openMinutes: '00',
            closeDate: new Date(),
            closeHours: '00',
            closeMinutes: '00',
          },
        });
        selectedRegistType.value = 'BUSINESS';
      } else if (newValue === 'HOUSEHOLD') {
        resetForm({
          values: {
            ...initialFormValues,
            registType: 'HOUSEHOLD',
            openDate: new Date(),
            openHours: '00',
            openMinutes: '00',
            closeDate: new Date(),
            closeHours: '00',
            closeMinutes: '00',
          },
        });
        selectedRegistType.value = 'HOUSEHOLD';
      }
    },
  );
</script>
<template>
  <ModalBase
    ref="inOutHistoryCreateModalRef"
    title="입출차 생성"
    :has-form="true"
    form-id="createInOutForm"
    @form-submit="onSubmit"
    @close-modal="handleModalClose"
  >
    <template #button>
      <ButtonBase
        type="button"
        color="primary"
        custom-class="inline"
        @click="handleOpenModal"
      >
        입출차 생성
      </ButtonBase>
    </template>
    <template #modalBody>
      <ul class="flex flex-col gap-4">
        <ModalFieldRegistType v-model="selectedRegistType" :errors="errors" />
        <ModalFieldCarType
          :option-list="
            selectedRegistType === 'HOUSEHOLD'
              ? carTypeList
              : businessCarTypeList
          "
          :errors="errors"
        />
        <ModalFieldCarNum :errors="errors" />
        <ModalFieldCustomSelectBox
          id="entranceGate"
          label-text="입차 게이트"
          :option-list="inOutAptLprList?.IN"
          :loading-value="isinOutAptLprListLoading"
          :errors="errors"
        />
        <ModalFieldOpenDatePickerTime :errors="errors" />
        <ModalFieldCustomSelectBox
          id="departureGate"
          label-text="출차 게이트"
          :option-list="inOutAptLprList?.OUT"
          :loading-value="isinOutAptLprListLoading"
          :errors="errors"
        />
        <ModalFieldCloseDatePickerTime :errors="errors" />

        <ModalFieldVisitPurpose
          v-if="
            selectedRegistType === 'HOUSEHOLD' &&
            values.carType !== 'REGULAR' &&
            values.carType !== 'REGULAR_RESIDENT'
          "
          :errors="errors"
        />
        <ModalFieldBusinessType
          v-if="selectedRegistType === 'BUSINESS'"
          :errors="errors"
        />
        <ModalFieldDongHo
          v-if="selectedRegistType === 'HOUSEHOLD'"
          :asterisk="true"
          :errors="errors"
        />
        <ModalFieldPhone
          id="phone"
          :is-required="false"
          :errors="errors"
          label-text="연락처"
        />
        <ModalFieldMemo :errors="errors" />
      </ul>
    </template>
    <template #submitButton>
      <ButtonBase
        type="submit"
        form="createInOutForm"
        color="primary"
        custom-class="w-full"
        @click="onSubmit"
      >
        <div class="w-full">입출차 생성하기</div>
      </ButtonBase>
    </template>
  </ModalBase>
  <InOutCreateSubmitModal
    v-if="isInOutHistoryModal"
    @close="closeModal"
    @create-in-out-history-submit="createSubmitInOutHistory"
  />
</template>
