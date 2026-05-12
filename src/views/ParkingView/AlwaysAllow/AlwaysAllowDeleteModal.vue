<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import { watch } from 'vue';

  import useDeleteAlwaysAllow from '@/lib/queries/parkingAlwaysAllow/useDeleteAlwaysAllow.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  const emits = defineEmits(['close']);

  const {
    deleteAlwaysAllowMutation,
    isDeleteAlwaysAllowPending,
    isDeleteAlwaysAllowSuccess,
  } = useDeleteAlwaysAllow();

  const closeModal = () => {
    emits('close');
  };

  const deleteAlwaysAllow = () => {
    if (props.data.selectedRows.length > 0) {
      const alwaysAllowUuidList = props.data.selectedRows.map(
        (item) => item.uuid,
      );
      deleteAlwaysAllowMutation({ alwaysAllowUuidList });
    }
  };

  watch(
    () => isDeleteAlwaysAllowSuccess.value,
    (newValue) => {
      if (newValue) {
        closeModal();
      }
    },
  );
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">
          선택한 항상허용 차량을 삭제 하시겠습니까?
        </p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          삭제 이후에는 복구할 수 없습니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isDeleteAlwaysAllowPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isDeleteAlwaysAllowPending"
          @click="deleteAlwaysAllow"
        >
          <SpinnerCircle v-if="isDeleteAlwaysAllowPending" class="mr-2" />
          <template v-else>삭제</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
