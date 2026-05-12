<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import HouseholdTableRegisterErrorModal from '@views/FireInspectionView/Household/HouseholdTableRegisterErrorModal.vue';
  import InspectionTemplateInfo from '@views/FireInspectionView/Household/InspectionTemplate/InspectionTemplateInfo.vue';
  import InspectionTemplateTable from '@views/FireInspectionView/Household/InspectionTemplate/InspectionTemplateTable.vue';

  import { useFireInspectionTemplate } from '@/lib/composables/fireInspection/useFireInspectionTemplate.js';
  import usePostFireInspectionHousehold from '@/lib/queries/fireInspection/usePostFireInspectionHousehold.js';

  const props = defineProps({
    householdInfo: {
      type: Object,
      required: true,
    },
    fireInspectionUuid: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const {
    createFireInspectionHouseholdMutationAsync,
    isCreateFireInspectionHouseholdPending,
  } = usePostFireInspectionHousehold();

  const {
    meta,

    validationErrors,
    isValidationErrorModalOpen,

    handleSubmit,
    handleValidationError,
    closeValidationErrorModal,
    convertQuestionAnswerList,
  } = useFireInspectionTemplate();

  const closeModal = () => {
    emits('close');
  };

  const onSubmit = handleSubmit(
    async (submitValues) => {
      await createFireInspectionHouseholdMutationAsync({
        fireInspectionUuid: props.fireInspectionUuid,
        householdUuid: props.householdInfo.householdFireInspectionUuid,
        submissionType: submitValues.submissionType,
        inspector: submitValues.inspector,
        inspectorPhone: submitValues.inspectorPhone,
        submissionDateTime: submitValues.submissionDateTime,
        questionAnswerList: convertQuestionAnswerList(
          submitValues.inspectionQuestions,
        ),
      });

      closeModal();
    },
    ({ errors }) => handleValidationError(errors),
  );
</script>

<template>
  <ModalBaseNew>
    <form
      id="manualInputForm"
      class="flex h-[840px] w-full flex-col"
      @submit="onSubmit"
    >
      <header
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-18SemiBold">점검항목 수기등록</h1>
        <button
          type="button"
          :disabled="isCreateFireInspectionHouseholdPending"
          @click="closeModal"
        >
          <CloseIcon class="h-5 w-5" />
        </button>
      </header>

      <div class="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <InspectionTemplateInfo :household-info="householdInfo" />
        <InspectionTemplateTable />
      </div>

      <footer
        class="flex justify-end gap-2 px-6 py-4 shadow-[0_-2px_3px_0px_rgba(0,0,0,0.1)]"
      >
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          class="w-24"
          :disabled="isCreateFireInspectionHouseholdPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          form="manualInputForm"
          type="submit"
          :color="meta.valid ? 'primary' : 'primary-disabled'"
          size="md"
          class="flex w-24 items-center justify-center gap-2"
          :disabled="isCreateFireInspectionHouseholdPending"
        >
          <SpinnerCircle v-if="isCreateFireInspectionHouseholdPending" />
          <template v-else>저장</template>
        </ButtonBase>
      </footer>
    </form>
  </ModalBaseNew>

  <!-- Validation 에러 모달 -->
  <HouseholdTableRegisterErrorModal
    v-if="isValidationErrorModalOpen"
    :errors="validationErrors"
    @close="closeValidationErrorModal"
  />
</template>
