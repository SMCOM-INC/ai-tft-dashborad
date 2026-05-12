<script setup>
  import IconPlusLineWhite from '@assets/icons/icon-plus-line-white.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import VoteListGroup from '@views/VoteView/List/VoteListGroup.vue';
  import VoteListGroupDeleteImpossibleModal from '@views/VoteView/List/VoteListGroupDeleteImpossibleModal.vue';
  import VoteListGroupDeleteModal from '@views/VoteView/List/VoteListGroupDeleteModal.vue';
  import VoteListGroupModal from '@views/VoteView/List/VoteListGroupModal.vue';
  import VotePriceInfo from '@views/VoteView/VotePriceInfo.vue';
  import { ref } from 'vue';

  import { LIST_SEARCH_INPUT_LIST } from '@/constants/vote.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetVoteList from '@/lib/queries/vote/useGetVoteList.js';

  const { getQueryString } = useNavigate();

  const { voteList, isVoteListLoading } = useGetVoteList();

  const modalType = ref(null);
  const modalGroupInfo = ref({});
  const toggleOpenedGroupUuid = ref(null);

  const openGroupModal = (type, value) => {
    modalType.value = type;
    modalGroupInfo.value = value;
  };

  const closeModal = () => {
    modalType.value = null;
  };

  const deleteGroup = (info) => {
    if (info?.voteList?.length > 0) {
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
    <PageTitleBase title="전자투표" class="mb-0" />
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
  <VotePriceInfo class="mb-4" />
  <SearchBar
    :search-input="LIST_SEARCH_INPUT_LIST"
    class="mb-6"
    has-reset
    :is-search-loading="isVoteListLoading"
  />
  <template v-if="isVoteListLoading">
    <SkeletonBase v-for="item in 5" :key="item" class="m-5 h-7 rounded-md" />
  </template>
  <ul v-else-if="voteList?.length > 0" class="flex flex-col gap-4">
    <VoteListGroup
      v-for="group in voteList"
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
  <VoteListGroupModal
    v-if="modalType === 'create' || modalType === 'edit'"
    :modal-type="modalType"
    :group-info="modalGroupInfo"
    @close="closeModal"
    @delete="deleteGroup"
  />
  <!-- 그룹 삭제 불가 모달 -->
  <VoteListGroupDeleteImpossibleModal
    v-else-if="modalType === 'deleteImpossible'"
    key="modal-deleteImpossible"
    @close="closeModal"
  />
  <!-- 그룹 삭제 모달 -->
  <VoteListGroupDeleteModal
    v-else-if="modalType === 'delete'"
    key="modal-delete"
    :group-info="modalGroupInfo"
    @close="closeModal"
  />
</template>
