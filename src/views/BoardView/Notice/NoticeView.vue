<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import NoticeFilters from '@views/BoardView/Notice/NoticeFilters.vue';
  import { ref } from 'vue';

  import {
    BOARD_NOTICE_SEARCH_INPUT_LIST,
    BOARD_NOTICE_TABLE_COLUMNS_LIST,
  } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteNoticePost from '@/lib/queries/boardNotice/useDeleteNoticePost.js';
  import useGetNoticeList from '@/lib/queries/boardNotice/useGetNoticeList.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { findNoticeType } from '@/lib/utils/formatBoard.js';
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
    noticeList,
    isNoticeListLoading,
    isNoticeListError,
    noticeListError,
  } = useGetNoticeList();

  const {
    deleteNoticePostMutation,
    isDeleteNoticePostLoading,
    isDeleteNoticePostError,
    deleteNoticePostError,
  } = useDeleteNoticePost();

  const renderFieldValue = (key, value) => {
    if (key === 'viewCount') {
      return value || 0;
    }

    if (!value) return '-';

    if (key === 'title') {
      return decodeUrl(value);
    }

    if (key === 'noticeType') {
      return findNoticeType(value) || value;
    }

    if (key === 'createdDate') {
      return formatDate(value).full();
    }

    return value || '-';
  };

  const clickRow = (row) => {
    navigateTo(`/board/notice/detail/${row.uuid}`);
  };

  const handleBulkAction = (selectedItems) => {
    selectedItemsRef.value = selectedItems;
    modalParagraphRef.value.handleOpenModal();
  };

  const deleteNotice = () => {
    if (selectedItemsRef.value.selectedRows.length <= 0) {
      return;
    }

    const noticeUuidList = selectedItemsRef.value.selectedRows.map(
      (item) => item.uuid,
    );
    deleteNoticePostMutation({ noticeUuidList });
  };
</script>

<template>
  <div class="flex items-end justify-between">
    <PageTitleBase
      title="공지사항"
      paragraph="아파트 회원들에게 전달할 공지사항을 관리합니다."
    />
    <ButtonBase
      type="button"
      color="primary"
      custom-class="mb-8"
      @click="navigateTo('/board/notice/create')"
    >
      공지사항 등록
    </ButtonBase>
  </div>
  <SearchBar
    :search-input="BOARD_NOTICE_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isNoticeListLoading"
    class="mb-7"
  >
    <NoticeFilters />
  </SearchBar>
  <TableView
    :column-data="BOARD_NOTICE_TABLE_COLUMNS_LIST"
    :page-data="noticeList"
    selectable
    show-count
    bulk-action-flag
    :row-function="clickRow"
    :bulk-action-buttons="bulkActionButtonRef"
    :is-loading="isNoticeListLoading"
    :is-error="isNoticeListError"
    :error="noticeListError"
    @bulk-action="handleBulkAction"
  >
    <template #default="{ row, column }">
      <ChipBase
        v-if="column?.key === 'categoryName'"
        key="chipBaseCategoryName"
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
    trigger-button-name="공지사항 삭제"
    title="선택한 공지사항을 삭제 하시겠습니까?"
    paragraph="삭제 이후에는 복구할 수 없습니다."
    color="red"
    close-button-name="삭제 처리"
    hide-button
    :is-loading="isDeleteNoticePostLoading"
    :is-error="isDeleteNoticePostError"
    :error="deleteNoticePostError"
    @confirm="deleteNotice"
  />
</template>
