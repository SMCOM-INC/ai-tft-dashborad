<script setup>

  import ArchiveIcon from '@assets/icons/icon-archive-fill-gray.svg';
  import ChevronDownIcon from '@assets/icons/icon-chevron-down-black.svg';
  import EditShadowIcon from '@assets/icons/icon-edit-shadow-solid.svg';
  import PlusIcon from '@assets/icons/icon-plus-line-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SurveyListSurveyCreationModal from '@views/SurveyView/List/SurveyListSurveyCreationModal.vue';
  import { ref } from 'vue';

  import decodeUrl from '@/lib/utils/decodeUrl.js';

  defineProps({
    groupInfo: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: false,
    },
  });

  const emits = defineEmits(['edit', 'toggle']);

  const modalType = ref(null);

  const openCreationModal = () => {
    modalType.value = 'create';
  };

  const closeModal = () => {
    modalType.value = null;
  };

  const editGroup = () => {
    emits('edit');
  };

  const toggleGroup = () => {
    emits('toggle');
  };

  const createSurvey = () => {
    openCreationModal();
  };
</script>

<template>
  <button
    :class="`flex w-full items-center justify-between gap-10 bg-defaults-tertiary-background-tertiary p-4 ${isOpen ? 'rounded-tl-md rounded-tr-md' : 'rounded-md'}`"
    type="button"
    @click="toggleGroup"
  >
    <div class="flex w-full items-center gap-2">
      <ArchiveIcon class="h-4 w-4" />
      <div class="flex w-full items-center gap-2">
        <span class="text-left pretendard-18SemiBold">{{
          decodeUrl(groupInfo?.title)
        }}</span>
        <span class="text-brand-default-text-brand pretendard-14Regular">{{
          groupInfo?.surveyList?.length
        }}</span>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <ButtonBase
        type="button"
        color="secondary"
        is-link
        size="sm"
        class="flex gap-2"
        @click.stop="editGroup"
      >
        <EditShadowIcon />
        그룹 정보 수정
      </ButtonBase>
      <ButtonBase
        type="button"
        color="secondary"
        size="sm"
        class="flex items-center gap-1"
        @click.stop="createSurvey"
      >
        <PlusIcon class="h-4 w-4" /> 설문 추가
      </ButtonBase>
      <div>
        <ChevronDownIcon
          v-if="isOpen"
          key="icon-chevron-up"
          class="rotate-180"
        />
        <ChevronDownIcon v-else key="icon-chevron-down" />
      </div>
    </div>
  </button>
  <!-- 설문 추가 모달 -->
  <SurveyListSurveyCreationModal
    v-if="modalType === 'create'"
    :group-uuid="groupInfo.uuid"
    @close="closeModal"
  />
</template>
