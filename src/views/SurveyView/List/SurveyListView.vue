<script setup>
  import IconPlusLineWhite from '@assets/icons/icon-plus-line-white.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import SurveyListGroup from '@views/SurveyView/List/SurveyListGroup.vue';
  import SurveyListGroupDeleteImpossibleModal from '@views/SurveyView/List/SurveyListGroupDeleteImpossibleModal.vue';
  import SurveyListGroupDeleteModal from '@views/SurveyView/List/SurveyListGroupDeleteModal.vue';
  import SurveyListGroupModal from '@views/SurveyView/List/SurveyListGroupModal.vue';
  import SurveyPriceInfo from '@views/SurveyView/SurveyPriceInfo.vue';
  import { ref } from 'vue';

  import { LIST_SEARCH_INPUT_LIST } from '@/constants/survey.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetSurveyList from '@/lib/queries/survey/useGetSurveyList.js';

  const { getQueryString } = useNavigate();

  const { surveyList, isSurveyListLoading } = useGetSurveyList();

  const modalType = ref(null);
  const modalGroupInfo = ref({});
  const toggleOpenedGroupUuid = ref(null);

  const openGroupModal = (type, value) => {
    modalType.value = type;

    if (value) {
      modalGroupInfo.value = value;
    }
  };

  const closeModal = () => {
    modalType.value = null;
  };

  const deleteGroup = (info) => {
    if (info?.surveyList?.length > 0) {
      modalType.value = 'deleteImpossible';
      return;
    }

    modalType.value = 'delete';
    modalGroupInfo.value = info;
  };

  const toggleGroup = (groupUuid) => {
    // 현재 열려있는 그룹을 다시 클릭하면 닫힘
    if (toggleOpenedGroupUuid.value === groupUuid) {
      toggleOpenedGroupUuid.value = null;
      return;
    }
    // 다른 그룹을 클릭하면 그 그룹이 열림
    toggleOpenedGroupUuid.value = groupUuid;
  };
</script>

<template>
  <div class="flex items-start justify-between">
    <PageTitleBase title="설문조사" class="mb-0" />
    <ButtonBase
      type="submit"
      color="primary"
      size="md"
      class="flex items-center gap-2"
      @click="openGroupModal('create')"
    >
      <IconPlusLineWhite />
      그룹 생성하기
    </ButtonBase>
  </div>
  <SurveyPriceInfo class="mb-4" />
  <SearchBar
    :search-input="LIST_SEARCH_INPUT_LIST"
    class="mb-6"
    has-reset
    :is-search-loading="isSurveyListLoading"
  />
  <template v-if="isSurveyListLoading">
    <SkeletonBase v-for="item in 5" :key="item" class="m-5 h-7 rounded-md" />
  </template>
  <ul v-else-if="surveyList?.length > 0" class="flex flex-col gap-4">
    <SurveyListGroup
      v-for="group in surveyList"
      :key="group?.uuid"
      :group-info="group"
      :is-open="toggleOpenedGroupUuid === group.uuid"
      @edit="(value) => openGroupModal('edit', value)"
      @toggle="toggleGroup(group.uuid)"
    />
  </ul>
  <p
    v-else
    class="w-full border-defaults-secondary-border-secondary py-28 text-center text-defaults-tertiary-text-tertiary pretendard-16Medium"
  >
    <span v-if="!!getQueryString().keyword">
      {{ getQueryString().keyword }}에 해당하는
    </span>
    그룹이 존재하지 않습니다.
  </p>
  <!-- 그룹 생성, 그룹 수정 모달 -->
  <SurveyListGroupModal
    v-if="modalType === 'create' || modalType === 'edit'"
    :modal-type="modalType"
    :group-info="modalGroupInfo"
    @close="closeModal"
    @delete="deleteGroup"
  />
  <!-- 그룹 삭제 불가 모달 -->
  <SurveyListGroupDeleteImpossibleModal
    v-else-if="modalType === 'deleteImpossible'"
    key="modal-deleteImpossible"
    @close="closeModal"
  />
  <!-- 그룹 삭제 모달 -->
  <SurveyListGroupDeleteModal
    v-else-if="modalType === 'delete'"
    key="modal-delete"
    :group-info="modalGroupInfo"
    @close="closeModal"
  />
</template>
