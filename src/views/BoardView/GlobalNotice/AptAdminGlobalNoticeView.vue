<script setup>
  import ChipBase from '@components/common/ChipBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import { computed, ref, watch } from 'vue';

  import {
    APT_BOARD_GLOBAL_NOTICE_TABLE_COLUMNS_LIST,
    BOARD_GLOBAL_NOTICE_ADMIN_SEARCH_INPUT_LIST,
  } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetAptAdminGlobalNoticeList from '@/lib/queries/boardGlobalNotice/useGetAptAdminGlobalNoticeList.js';

  const { getQueryString, navigateTo } = useNavigate();

  // 단지관리자는 선택/삭제 기능 비활성화
  const tableOptions = computed(() => ({
    selectable: false,
    bulkActionFlag: false,
    bulkActionButtons: [],
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
    aptAdminGlobalNoticeList,
    isAptAdminGlobalNoticeListLoading,
    isError: isAptAdminGlobalNoticeListError,
    error: aptAdminGlobalNoticeListError,
    refetch,
  } = useGetAptAdminGlobalNoticeList(fetchParams);

  const handleRowClick = (row) => {
    // 단지관리자용 상세 페이지 경로
    navigateTo(`/board/global-notice/apt-admin-detail/${row.uuid}`);
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
  <div class="flex items-end justify-between">
    <PageTitleBase
      title="전체 공지사항"
      paragraph="전체 공지사항을 조회합니다."
    />
  </div>
  <SearchBar
    :search-input="BOARD_GLOBAL_NOTICE_ADMIN_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isAptAdminGlobalNoticeListLoading"
    class="mb-5"
  />
  <TableView
    show-count
    :column-data="APT_BOARD_GLOBAL_NOTICE_TABLE_COLUMNS_LIST"
    :page-data="aptAdminGlobalNoticeList"
    :selectable="tableOptions.selectable"
    :bulk-action-flag="tableOptions.bulkActionFlag"
    :row-function="handleRowClick"
    :bulk-action-buttons="tableOptions.bulkActionButtons"
    :is-loading="isAptAdminGlobalNoticeListLoading"
    :is-error="isAptAdminGlobalNoticeListError"
    :error="aptAdminGlobalNoticeListError"
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
