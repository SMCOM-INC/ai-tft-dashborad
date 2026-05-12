<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import useDeleteSurveyGroup from '@/lib/queries/survey/useDeleteSurveyGroup.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    groupInfo: {
      type: Object,
      required: true,
    },
  });
  const emits = defineEmits(['close']);

  const { deleteSurveyGroupMutationAsync, isDeleteSurveyGroupPending } =
    useDeleteSurveyGroup();

  const closeGroupModal = () => {
    emits('close');
  };

  const deleteGroup = async () => {
    await deleteSurveyGroupMutationAsync({ groupUuid: props.groupInfo.uuid });
    closeGroupModal();
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] max-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">
          <span class="text-alerts-error-text-error">
            {{ decodeUrl(groupInfo.title) }}</span
          >
          그룹을 삭제하시겠습니까?
        </p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          이 작업은 되돌릴 수 없습니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isDeleteSurveyGroupPending"
          @click="closeGroupModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="button"
          color="destructive"
          size="md"
          :disabled="isDeleteSurveyGroupPending"
          class="flex w-14 justify-center"
          @click="deleteGroup"
        >
          <SpinnerCircle v-if="isDeleteSurveyGroupPending" />
          <template v-else>삭제</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
