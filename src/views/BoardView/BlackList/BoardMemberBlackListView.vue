<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TableView from '@components/common/TableView.vue';
  import BoardMemberBlackListDeleteModal from '@views/BoardView/BlackList/BoardMemberBlackListDeleteModal.vue';
  import { computed, ref, watch } from 'vue';

  import { BOARD_MEMBER_MANAGEMENT_BLACKLIST_TABLE_COLUMNS_LIST } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetMemberBlackList from '@/lib/queries/boardBlacklist/useGetMemberBlackList.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { getQueryString, navigateTo, hasDetailPage } = useNavigate();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const queryParams = computed(() => getQueryString());
  const isDeleteBlackListModalRef = ref(false);

  const selectedRows = ref([]);

  // 삭제 모달 닫기
  const closeDeleteBlackListModal = () => {
    isDeleteBlackListModalRef.value = false;
  };

  const fetchParams = computed(() => {
    return {
      pageable: {
        page: parseInt(queryParams.value.page, 10) || 0,
        size: parseInt(queryParams.value.size, 10) || 10,
        sort: queryParams.value.sort || 'createTime',
      },
      // 검색 파라미터가 필요하다면 추가
    };
  });

  const {
    memberBlackLists,
    isBlackListsLoading,
    isError: isBlacklistCarListError,
    error: blacklistCarListError,
    refetch,
  } = useGetMemberBlackList(aptUuid, fetchParams);

  watch(
    queryParams,
    () => {
      refetch();
    },
    { immediate: true, deep: true },
  );

  // 삭제 버튼 클릭 처리
  const handleDeletionButton = (selectedItems) => {
    selectedRows.value = selectedItems.selectedRows;

    // 삭제 모달 열기
    isDeleteBlackListModalRef.value = true;
  };

  // 차단한 게시글 보기 클릭 처리
  const handleViewBlockedPost = (row) => {
    if (row.communityUuid) {
      navigateTo(`/board/community/posts/detail/${row.communityUuid}`);
    }
  };
</script>

<template>
  <div class="flex h-full flex-col">
    <PageTitleBase
      v-if="!hasDetailPage"
      title="게시판 블랙리스트"
      paragraph="게시판 사용자 블랙리스트를 관리합니다."
    />
    <TableView
      :column-data="BOARD_MEMBER_MANAGEMENT_BLACKLIST_TABLE_COLUMNS_LIST"
      :page-data="memberBlackLists"
      selectable
      show-count
      :is-loading="isBlackListsLoading"
      :is-error="isBlacklistCarListError"
      :error="blacklistCarListError"
      bulk-action-flag
      :bulk-action-buttons="[
        {
          text: '선택 삭제',
          color: 'red',
          disabled: false,
          action: 'delete',
        },
      ]"
      @bulk-action="handleDeletionButton"
    >
      <template #default="slotProps">
        <div v-if="slotProps?.column?.key === 'button'">
          <ButtonBase
            type="button"
            color="secondary-fill"
            size="md"
            class="rounded-[4px] px-2 py-2 pretendard-14Regular"
            @click="handleViewBlockedPost(slotProps.row)"
          >
            <div class="text-black">차단한 게시글 보기</div>
          </ButtonBase>
        </div>
      </template>
    </TableView>
    <BoardMemberBlackListDeleteModal
      v-if="isDeleteBlackListModalRef"
      :selected-rows="selectedRows"
      @close="closeDeleteBlackListModal"
    />
  </div>
</template>
