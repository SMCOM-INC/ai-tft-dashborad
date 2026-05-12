<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalFieldDongHo from '@components/common/ModalFieldDongHo.vue';
  import ModalFieldVisitPurpose from '@components/common/ModalFieldVisitPurpose.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TextError from '@components/common/TextError.vue';
  import { useForm } from 'vee-validate';
  import { ref, watch } from 'vue';

  import usePatchInOutHistoryGeneralCar from '@/lib/queries/parkingInoutHistory/usePatchInOutHistoryGeneralCar.js';
  import usePatchInOutHistoryUnknownCar from '@/lib/queries/parkingInoutHistory/usePatchInOutHistoryUnknownCar.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import { inOutHistoryDongHoFormSchema } from '@/schemas/parking.js';

  const props = defineProps({
    detail: {
      type: Object,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const { handleSubmit, setValues, errors, meta } = useForm({
    validationSchema: inOutHistoryDongHoFormSchema(props.detail.carType),
  });

  const {
    patchInOutHistoryGeneralCarMutationAsync,
    isPatchInOutHistoryGeneralCarPending,
  } = usePatchInOutHistoryGeneralCar();

  const {
    patchInOutHistoryUnknownCarMutationAsync,
    isPatchInOutHistoryUnknownCarPending,
  } = usePatchInOutHistoryUnknownCar();

  const showNotModifiedError = ref(false);

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!meta.value.dirty) {
      showNotModifiedError.value = true;
      return;
    }

    showNotModifiedError.value = false;

    const submitValues = {
      uuid: props.detail.uuid,
      dong: values.dong,
      ho: values.ho,
      visitPurposeUuid: values.visitPurposeUuid,
    };

    if (props.detail.carType === 'UNKNOWN') {
      await patchInOutHistoryUnknownCarMutationAsync(submitValues);
    } else {
      await patchInOutHistoryGeneralCarMutationAsync(submitValues);
    }

    closeModal();
  });

  watch(
    () => props.detail,
    (newValue) => {
      if (newValue) {
        setValues({
          dong: newValue.dong,
          ho: newValue.ho,
        });
      }
    },
    { immediate: true },
  );
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[400px] max-w-[500px] space-y-6 p-6">
      <div class="space-y-2">
        <h2 class="pretendard-18Medium">동호수 수정</h2>
        <div class="text-defaults-secondary-text-secondary">
          <p>차량번호 : {{ detail?.carNum || '-' }}</p>
          <p>
            입차일시 :
            {{
              detail?.inParkingTime
                ? formatDate(detail.inParkingTime).full()
                : '-'
            }}
          </p>
        </div>
      </div>
      <form id="dongHoForm" class="mb-6" @submit="onSubmit">
        <ul class="space-y-4">
          <ModalFieldDongHo :errors="errors" :asterisk="true" />
          <ModalFieldVisitPurpose
            v-if="detail.carType === 'UNKNOWN'"
            :errors="errors"
          />
          <TextError v-if="!meta.dirty && showNotModifiedError"
            >수정사항이 없습니다. 동호수를 수정해주세요.</TextError
          >
        </ul>
      </form>

      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="submit"
          color="primary"
          size="md"
          form="dongHoForm"
          class="flex"
          :disabled="
            isPatchInOutHistoryGeneralCarPending ||
            isPatchInOutHistoryUnknownCarPending
          "
        >
          <SpinnerCircle
            v-if="
              isPatchInOutHistoryGeneralCarPending ||
              isPatchInOutHistoryUnknownCarPending
            "
          />
          <template v-else>수정</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
