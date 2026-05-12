<script setup>
  import ChipBase from '@components/common/ChipBase.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import CommunityFilters from '@views/BoardView/Community/CommunityFilters.vue';
  import { ref } from 'vue';

  import {
    BOARD_COMMUNITY_REPORTS_TABLE_COLUMNS_LIST,
    BOARD_COMMUNITY_SEARCH_INPUT_LIST,
  } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteCommunityPost from '@/lib/queries/boardCommunity/useDeleteCommunityPost.js';
  import useGetCommunityReportList from '@/lib/queries/boardCommunity/useGetCommunityReportList.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { formatDate } from '@/lib/utils/formatDate.js';

  const { navigateTo } = useNavigate();

  const modalParagraphRef = ref(null);
  const selectedItemsRef = ref([]);

  const bulkActionButtonRef = ref([
    {
      text: '선택 삭제',
      color: 'red',
      disabled: false,
      action: 'delete',
    },
  ]);

  const {
    communityReportList,
    isCommunityReportListLoading,
    isCommunityReportListError,
    communityReportListError,
  } = useGetCommunityReportList();

  const {
    deleteCommunityPostMutation,
    isDeleteCommunityPostPending,
    isDeleteCommunityPostError,
    deleteCommunityPostError,
  } = useDeleteCommunityPost();

  const renderFieldValue = (key, value) => {
    if (key === 'reportCount') {
      return value || 0;
    }

    if (!value) return '-';

    if (key === 'title') {
      return decodeUrl(value);
    }

    if (key === 'authorText') {
      return value.replace(',', '');
    }

    if (key === 'createdDate') {
      return formatDate(value).full();
    }

    return value || '-';
  };

  const clickRow = (row) => {
    navigateTo(`/board/community/reports/detail/${row.uuid}`);
  };

  const handleBulkAction = (selectedItems) => {
    selectedItemsRef.value = selectedItems.selectedRows;
    modalParagraphRef.value.handleOpenModal();
  };

  const deleteCommunity = () => {
    if (selectedItemsRef.value.length <= 0) {
      return;
    }

    const communityUuidList = selectedItemsRef.value.map((item) => item.uuid);

    deleteCommunityPostMutation({ communityUuidList });
  };
</script>

<template>
  <SearchBar
    :search-input="BOARD_COMMUNITY_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isCommunityReportListLoading"
    class="mb-7"
  >
    <CommunityFilters />
  </SearchBar>
  <TableView
    :column-data="BOARD_COMMUNITY_REPORTS_TABLE_COLUMNS_LIST"
    :page-data="communityReportList"
    show-count
    selectable
    :row-function="clickRow"
    :is-loading="isCommunityReportListLoading"
    :is-error="isCommunityReportListError"
    :error="communityReportListError"
    :bulk-action-buttons="bulkActionButtonRef"
    :bulk-action-flag="true"
    @bulk-action="handleBulkAction"
  >
    <template #default="{ row, column }">
      <ChipBase
        v-if="column?.key === 'categoryName'"
        color="blue-100"
        variant="outline"
        >{{ renderFieldValue(column.key, row[column.key]) }}</ChipBase
      >
      <template v-else>
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </template>
  </TableView>
  <ModalParagraph
    ref="modalParagraphRef"
    trigger-button-name="게시글 삭제"
    title="선택한 게시글을 삭제 하시겠습니까?"
    paragraph="삭제 이후에는 복구할 수 없습니다."
    color="red"
    close-button-name="삭제 처리"
    hide-button
    :is-loading="isDeleteCommunityPostPending"
    :is-error="isDeleteCommunityPostError"
    :error="deleteCommunityPostError"
    @confirm="deleteCommunity"
  />
</template>
