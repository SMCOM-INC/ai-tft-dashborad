<script setup>
  import ButtonKebab from '@components/common/ButtonKebab.vue';
  import SurveyListActionErrorMessageModal from '@views/SurveyView/List/SurveyListActionErrorMessageModal.vue';
  import SurveyListSurveyEditModal from '@views/SurveyView/List/SurveyListSurveyEditModal.vue';
  import SurveyDetailSurveyDeleteModal from '@views/SurveyView/SurveyDeleteModal.vue';
  import { ref } from 'vue';

  import useSurveyState from '@/lib/composables/survey/useSurveyState.js';

  const props = defineProps({
    itemInfo: {
      type: Object,
      required: true,
    },
  });

  const { canEdit, canDelete } = useSurveyState({
    state: props.itemInfo.state,
    finishFlag: props.itemInfo.finishFlag,
    openTime: props.itemInfo.startDateTime,
  });

  const modalType = ref(null);
  const isErrorType = ref(undefined);

  const closeModal = () => {
    modalType.value = null;
  };

  const openErrorMessageModal = () => {
    modalType.value = 'error';
  };

  const closeErrorMessageModal = () => {
    isErrorType.value = undefined;
    closeModal();
  };

  const openEditModal = () => {
    if (!canEdit.value) {
      isErrorType.value = 'edit';
      openErrorMessageModal();
      return;
    }

    modalType.value = 'edit';
  };

  const openDeleteModal = () => {
    if (!canDelete.value) {
      isErrorType.value = 'delete';
      openErrorMessageModal();
      return;
    }

    modalType.value = 'delete';
  };

  const KEBAB_BUTTON_LIST = [
    {
      label: '설문명 수정',
      color: 'text-defaults-primary-text-primary',
      handler: openEditModal,
    },
    {
      label: '삭제',
      color: 'text-destructive-100',
      handler: openDeleteModal,
    },
  ];
</script>

<template>
  <ButtonKebab :button-list="KEBAB_BUTTON_LIST" @click.stop />

  <!-- 설문 수정 모달 -->
  <SurveyListSurveyEditModal
    v-if="modalType === 'edit'"
    :uuid="itemInfo.uuid"
    :title="itemInfo.title"
    @close="closeModal"
  />

  <!-- 설문 삭제 모달 -->
  <SurveyDetailSurveyDeleteModal
    v-if="modalType === 'delete'"
    :uuid="itemInfo.uuid"
    @close="closeModal"
  />

  <!-- 에러메시지 모달 -->
  <SurveyListActionErrorMessageModal
    v-if="modalType === 'error'"
    :error-type="isErrorType"
    :state="itemInfo.state"
    @close="closeErrorMessageModal"
  />
</template>
