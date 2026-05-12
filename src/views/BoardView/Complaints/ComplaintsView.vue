<script setup>
  import IconLock from '@assets/icons/icon-lock-red.svg';
  import ChipBase from '@components/common/ChipBase.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import ComplaintsFilters from '@views/BoardView/Complaints/ComplaintsFilters.vue';
  import { ref } from 'vue';


  import {
    BOARD_COMPLAINTS_SEARCH_INPUT_LIST,
    BOARD_COMPLAINTS_TABLE_COLUMNS_LIST,
  } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useDeleteComplaintPost from '@/lib/queries/boardComplaints/useDeleteComplaintPost.js';
  import useGetComplaintList from '@/lib/queries/boardComplaints/useGetComplaintList.js';
  import usePatchComplaintStateBundle from '@/lib/queries/boardComplaints/usePatchComplaintStateBundle.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import findComplaintStatus from '@/lib/utils/findComplaintStatus.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { navigateTo } = useNavigate();
  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const {
    complaintPostList,
    isComplaintPostListLoading,
    isComplaintPostListError,
    complaintPostListError,
  } = useGetComplaintList();

  const {
    deleteComplaintPostMutation,
    isDeleteComplaintPostPending,
    isDeleteComplaintPostError,
    deleteComplaintPostError,
  } = useDeleteComplaintPost();

  const {
    bulkReceivedMutation,
    bulkInProgressMutation,
    bulkCompletedMutation,
    isBulkInProgressLoading,
    isBulkCompletedLoading,
    isBulkInProgressError,
    isBulkCompletedError,
    bulkInProgressError,
    bulkCompletedError,
  } = usePatchComplaintStateBundle(aptUuid);

  const deleteComplaintPostModalRef = ref(null);
  const inProgressComplaintModalRef = ref(null);
  const completedComplaintModalRef = ref(null);
  const selectedItemsRef = ref([]);
  const bulkActionButtonRef = ref([
    {
      text: '선택 삭제',
      color: 'red',
      disabled: false,
      action: 'delete',
    },
    {
      text: '처리중으로 변경',
      color: 'lightGray',
      disabled: false,
      action: 'inProgress',
    },
    {
      text: '처리완료로 변경',
      color: 'deepBlue',
      disabled: false,
      action: 'completed',
    },
  ]);

  const renderFieldValue = (key, value) => {
    if (key === 'viewCount' || key === 'commentCount' || key === 'likeCount') {
      return value || 0;
    }

    if (!value) return '-';

    if (key === 'title') {
      return decodeUrl(value);
    }

    if (key === 'authorText') {
      return value.replace(',', '');
    }

    if (key === 'status') {
      const status = findComplaintStatus(value);
      return status.label || value;
    }

    if (key === 'createdDate') {
      return formatDate(value).full();
    }

    return value || '-';
  };

  // 테이블 행 클릭 핸들러
  const handleRowClick = (row) => {
    navigateTo(`/board/complaints/detail/${row.uuid}`);
  };

  // 일괄 액션 핸들러
  const handleBulkAction = (actionData) => {
    selectedItemsRef.value = actionData.selectedRows;

    switch (actionData.action) {
      case 'delete':
        deleteComplaintPostModalRef.value.handleOpenModal();
        break;
      case 'inProgress':
        inProgressComplaintModalRef.value.handleOpenModal();
        break;
      case 'completed':
        completedComplaintModalRef.value.handleOpenModal();
        break;
      default:
    }
  };

  const deleteComplaints = () => {
    if (selectedItemsRef.value.length <= 0) {
      return;
    }

    const complaintUuidList = selectedItemsRef.value.map((item) => item.uuid);

    deleteComplaintPostMutation({ complaintUuidList });
  };

  // 민원 상태 일괄 변경 핸들러
  const handleBulkStatusChangeAction = async (status) => {
    if (selectedItemsRef.value.length <= 0) {
      return;
    }

    const mutationMap = {
      RECEIVED: bulkReceivedMutation,
      IN_PROGRESS: bulkInProgressMutation,
      COMPLETED: bulkCompletedMutation,
    };

    const complaintUuidList = selectedItemsRef.value.map((item) => item.uuid);
    await mutationMap[status](complaintUuidList);
  };
</script>

<template>
  <PageTitleBase
    title="민원공간"
    paragraph="입주민의 민원공간 게시글을 관리하고 처리합니다."
  />
  <SearchBar
    :search-input="BOARD_COMPLAINTS_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isComplaintPostListLoading"
    class="mb-7"
  >
    <ComplaintsFilters />
  </SearchBar>
  <TableView
    :column-data="BOARD_COMPLAINTS_TABLE_COLUMNS_LIST"
    :page-data="complaintPostList"
    show-count
    selectable
    :row-function="handleRowClick"
    :is-loading="isComplaintPostListLoading"
    :is-error="isComplaintPostListError"
    :error="complaintPostListError"
    :bulk-action-buttons="bulkActionButtonRef"
    :bulk-action-flag="true"
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
      <ChipBase
        v-else-if="column?.key === 'privateFlag'"
        key="chipBasePrivateFlag"
        :variant="row?.privateFlag ? 'outline' : 'fill'"
        :color="row?.privateFlag ? 'red-100' : 'blue-100'"
      >
        <IconLock v-if="row?.privateFlag" class="mr-1 h-3 w-3" />
        {{ row[column.key] ? '비밀글' : '공개글' }}
      </ChipBase>
      <ChipBase
        v-else-if="column?.key === 'status'"
        key="chipBaseStatus"
        variant="fill"
        :color="findComplaintStatus(row[column.key]).color"
      >
        {{ renderFieldValue(column.key, row[column.key]) }}
      </ChipBase>
      <template v-else>
        {{ renderFieldValue(column.key, row[column.key]) }}
      </template>
    </template>
  </TableView>
  <ModalParagraph
    ref="deleteComplaintPostModalRef"
    trigger-button-name="민원 삭제"
    title="선택한 민원을 삭제 하시겠습니까?"
    paragraph="삭제 이후에는 복구할 수 없습니다."
    color="red"
    close-button-name="삭제 처리"
    hide-button
    :is-loading="isDeleteComplaintPostPending"
    :is-error="isDeleteComplaintPostError"
    :error="deleteComplaintPostError"
    @confirm="deleteComplaints"
  />
  <ModalParagraph
    ref="inProgressComplaintModalRef"
    trigger-button-name="처리중으로 변경"
    title="선택한 민원을 처리중으로 변경 하시겠습니까?"
    paragraph="처리중으로 변경 이후에는 복구할 수 없습니다."
    color="lightGray"
    close-button-name="처리중으로 변경"
    hide-button
    :is-loading="isBulkInProgressLoading"
    :is-error="isBulkInProgressError"
    :error="bulkInProgressError"
    @confirm="handleBulkStatusChangeAction('IN_PROGRESS')"
  />
  <ModalParagraph
    ref="completedComplaintModalRef"
    trigger-button-name="처리완료로 변경"
    title="선택한 민원을 처리완료로 변경 하시겠습니까?"
    paragraph="처리완료로 변경 이후에는 복구할 수 없습니다."
    color="deepBlue"
    close-button-name="처리완료로 변경"
    hide-button
    :is-loading="isBulkCompletedLoading"
    :is-error="isBulkCompletedError"
    :error="bulkCompletedError"
    @confirm="handleBulkStatusChangeAction('COMPLETED')"
  />
</template>
