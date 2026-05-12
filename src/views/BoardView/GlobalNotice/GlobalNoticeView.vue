<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import GlobalNoticeDeleteModal from '@views/BoardView/GlobalNotice/GlobalNoticeDeleteModal.vue';
  import { computed, ref, watch } from 'vue';

  import {
    BOARD_GLOBAL_NOTICE_ADMIN_SEARCH_INPUT_LIST,
    BOARD_GLOBAL_NOTICE_ADMIN_TABLE_COLUMNS_LIST,
  } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetGlobalNoticeList from '@/lib/queries/boardGlobalNotice/useGetGlobalNoticeList.js';

  const { getQueryString, navigateTo } = useNavigate();

  // 권한별 기본 경로 계산
  const isAptAdmin = computed(() =>
    window.location.pathname.startsWith('/board'),
  );

  // 최고관리자만 등록 가능
  const canCreate = computed(() => !isAptAdmin.value);

  const baseCreatePath = computed(() => '/master/global-notice/create');

  const isDeleteModalOpen = ref(false);
  const selectedItemsRef = ref([]);
  const bulkActionButtonRef = ref([
    {
      text: '선택 삭제',
      color: 'red',
      disabled: false,
      action: 'delete',
    },
  ]);

  // 권한별 TableView 옵션
  const tableOptions = computed(() => ({
    selectable: canCreate.value, // 최고관리자만 선택 가능
    bulkActionFlag: canCreate.value, // 최고관리자만 일괄 작업 가능
    bulkActionButtons: canCreate.value ? bulkActionButtonRef.value : [], // 최고관리자만 삭제 버튼 표시
  }));

  const queryParams = computed(() => getQueryString());
  const fetchParams = computed(() => ({
    pageable: {
      page: parseInt(queryParams.value.page, 10) || 0,
      size: parseInt(queryParams.value.size, 10) || 10,
      sort: queryParams.value.sort || '',
    },
    searchParams: {
      keyword: queryParams.value.keyword,
    },
  }));

  const fetchParamsRef = ref(null);

  const {
    globalNoticeList,
    isGlobalNoticeListLoading,
    isError: isGlobalNoticeListError,
    error: globalNoticeListError,
    refetch,
  } = useGetGlobalNoticeList(fetchParams);

  const handleRowClick = (row) => {
    // 권한에 따라 상세 페이지 경로 결정
    const baseDetailPath = isAptAdmin.value
      ? '/board/global-notice/detail'
      : '/master/global-notice/detail';

    navigateTo(`${baseDetailPath}/${row.uuid}`);
  };

  const handleBulkAction = (selectedItems) => {
    selectedItemsRef.value = selectedItems.selectedRows;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
  };

  // 공지 타입을 한글로 변환하는 함수
  const getNoticeTypeLabel = (type) => {
    const typeLabels = {
      RESIDENT_ALL_NOTICE: '입주민 전체 공지',
      RESIDENT_INDIVIDUAL_NOTICE: '입주민 개별 공지',
      APT_ADMIN_ALL_NOTICE: '관리자 전체 공지',
      APT_ADMIN_INDIVIDUAL_NOTICE: '관리자 개별 공지',
    };
    return typeLabels[type] || type;
  };

  // 공지 타입별 색상을 반환하는 함수
  const getNoticeTypeColor = (type) => {
    const typeColors = {
      RESIDENT_ALL_NOTICE: 'blue-100', // 입주민 전체
      RESIDENT_INDIVIDUAL_NOTICE: 'gray-200', // 입주민 개별
      APT_ADMIN_ALL_NOTICE: 'red-100', // 관리자 전체
      APT_ADMIN_INDIVIDUAL_NOTICE: 'orange-10', // 관리자 개별
    };
    return typeColors[type] || 'gray-100';
  };

  watch(
    queryParams,
    () => {
      fetchParamsRef.value = fetchParams.value;
      refetch();
    },
    { immediate: true, deep: true },
  );
</script>

<template>
  <GlobalNoticeDeleteModal
    v-if="isDeleteModalOpen"
    :selected-rows="selectedItemsRef"
    @close="closeDeleteModal"
  />
  <div class="flex items-end justify-between">
    <PageTitleBase
      title="전체 공지사항"
      paragraph="모든 아파트먼트 단지들에게 전달할 전체 공지사항을 관리합니다."
    />
    <ButtonBase
      v-if="canCreate"
      type="button"
      color="primary"
      custom-class="mb-8"
      @click="navigateTo(baseCreatePath)"
    >
      전체 공지사항 등록
    </ButtonBase>
  </div>
  <SearchBar
    :search-input="BOARD_GLOBAL_NOTICE_ADMIN_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isGlobalNoticeListLoading"
    class="mb-5"
  />
  <TableView
    :column-data="BOARD_GLOBAL_NOTICE_ADMIN_TABLE_COLUMNS_LIST"
    :page-data="globalNoticeList"
    :selectable="tableOptions.selectable"
    :bulk-action-flag="tableOptions.bulkActionFlag"
    :row-function="handleRowClick"
    :bulk-action-buttons="tableOptions.bulkActionButtons"
    :is-loading="isGlobalNoticeListLoading"
    :is-error="isGlobalNoticeListError"
    :error="globalNoticeListError"
    @bulk-action="handleBulkAction"
  >
    <template #default="{ row, column }">
      <ChipBase
        v-if="column?.key === 'type'"
        variant="fill"
        :color="getNoticeTypeColor(row.type)"
      >
        {{ getNoticeTypeLabel(row.type) }}
      </ChipBase>
    </template>
  </TableView>
</template>
