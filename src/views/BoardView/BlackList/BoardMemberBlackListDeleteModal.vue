<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import useDeleteMemberBlackList from '@/lib/queries/boardBlacklist/useDeleteMemberBlackList.js';

  const props = defineProps({
    selectedRows: {
      type: Array,
      default: () => [],
    },
  });

  const emits = defineEmits(['close']);

  const closeModal = () => {
    emits('close');
  };

  const { deleteMemberBlackListMutation, isDeleteMemberBlackListPending } =
    useDeleteMemberBlackList();

  const handleDelete = async () => {
    if (props.selectedRows.length === 0) {
      alert('삭제할 블랙리스트를 선택해주세요.');
      closeModal();
      return;
    }
    const blackListUuidList = props.selectedRows.map(
      (item) => item.blackListUuid,
    );

    try {
      await deleteMemberBlackListMutation({ blackListUuidList });
      closeModal();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      closeModal();
    }
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[400px] space-y-4 p-6">
      <div class="space-y-2">
        <p class="pretendard-18Medium">삭제 하시겠습니까?</p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          삭제 이후 복구가 불가합니다.
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          :disabled="isDeleteMemberBlackListPending"
          @click="closeModal"
        >
          취소
        </ButtonBase>
        <ButtonBase
          type="submit"
          color="destructive"
          size="md"
          class="flex"
          :disabled="isDeleteMemberBlackListPending"
          @click="handleDelete"
        >
          <SpinnerCircle v-if="isDeleteMemberBlackListPending" />
          <template v-else>삭제 처리</template>
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
