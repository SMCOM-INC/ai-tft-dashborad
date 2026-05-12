<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import useDeleteFireInspectionHousehold from '@/lib/queries/fireInspection/useDeleteFireInspectionHousehold.js';

  const props = defineProps({
    fireInspectionUuid: {
      type: String,
      required: true,
    },
    householdFireInspectionUuid: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close', 'deleted']);

  const {
    deleteFireInspectionHouseholdMutationAsync,
    isDeleteFireInspectionHouseholdPending,
  } = useDeleteFireInspectionHousehold();

  const closeModal = () => {
    emits('close');
  };

  const deleteInspectionHousehold = async () => {
    await deleteFireInspectionHouseholdMutationAsync({
      fireInspectionUuid: props.fireInspectionUuid,
      householdFireInspectionUuid: props.householdFireInspectionUuid,
    });

    emits('deleted');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <div class="mb-4 space-y-4">
        <h1 class="pretendard-18Medium">세대 점검 항목 초기화</h1>
        <div>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            점검 항목을 초기화하면
            <span class="font-bold">해당 세대의</span> 작성된 모든 정보가
            삭제되며,
            <br />
            이 작업은 취소할 수 없습니다. 계속하시겠습니까?
          </p>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isDeleteFireInspectionHouseholdPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isDeleteFireInspectionHouseholdPending"
          @click="deleteInspectionHousehold"
        >
          <SpinnerCircle v-if="isDeleteFireInspectionHouseholdPending" />
          <template v-else>초기화</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
