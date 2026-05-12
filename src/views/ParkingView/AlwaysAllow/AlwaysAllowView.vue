<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import TableView from '@components/common/TableView.vue';
  import AlwaysAllowCreateModal from '@views/ParkingView/AlwaysAllow/AlwaysAllowCreateModal.vue';
  import AlwaysAllowDeleteModal from '@views/ParkingView/AlwaysAllow/AlwaysAllowDeleteModal.vue';
  import { ref } from 'vue';

  import {
    ADMIN_PARKING_ALWAYS_ALLOW_SEARCH_INPUT_LIST,
    ADMIN_PARKING_ALWAYS_ALLOW_TABLE_COLUMNS_LIST,
  } from '@/constants/parking.js';
  import useGetAlwaysAllowList from '@/lib/queries/parkingAlwaysAllow/useGetAlwaysAllowList.js';

  const {
    alwaysAllowList,
    isAlwaysAllowListLoading,
    isError: isAlwaysAllowError,
    error: alwaysAllowError,
  } = useGetAlwaysAllowList();

  const SearchBarRef = ref(null);
  const selectedTableRowRef = ref([]);
  const isCreateModalOpenRef = ref(false);
  const isDeleteModalOpenRef = ref(false);

  // 항상허용 등록모달 열기
  const openAlwaysAllowCreateModal = () => {
    isCreateModalOpenRef.value = true;
  };

  // 항상허용 등록모달 닫기
  const closeAlwaysAllowCreateModal = () => {
    isCreateModalOpenRef.value = false;
  };

  // 항상허용 삭제버튼 클릭
  const handleDeletionButton = (selectedItems) => {
    selectedTableRowRef.value = selectedItems;
    isDeleteModalOpenRef.value = true;
  };

  // 항상허용 삭제모달 닫기
  const closeAlwaysAllowDeleteModal = () => {
    isDeleteModalOpenRef.value = false;
  };

  const handleAlwaysAllowSuccess = () => {
    SearchBarRef.value.exposeOnReset();
  };
</script>

<template>
  <div class="flex items-center justify-between">
    <PageTitleBase
      title="항상허용"
      paragraph="세대별 항상허용 차량을 관리합니다."
    />
    <ButtonBase
      type="button"
      color="primary"
      @click="openAlwaysAllowCreateModal"
    >
      항상허용 등록
    </ButtonBase>
  </div>
  <SearchBar
    ref="SearchBarRef"
    :search-input="ADMIN_PARKING_ALWAYS_ALLOW_SEARCH_INPUT_LIST"
    has-reset
    class="mb-5"
    :is-search-loading="isAlwaysAllowListLoading"
  />
  <TableView
    :column-data="ADMIN_PARKING_ALWAYS_ALLOW_TABLE_COLUMNS_LIST"
    :page-data="alwaysAllowList"
    selectable
    :bulk-action-flag="true"
    :bulk-action-buttons="[
      {
        text: '선택 삭제',
        color: 'red',
        disabled: false,
        action: 'delete',
      },
    ]"
    :is-loading="isAlwaysAllowListLoading"
    :is-error="isAlwaysAllowError"
    :error="alwaysAllowError"
    @bulk-action="handleDeletionButton"
  />
  <!-- 항상허용 등록 모달 -->
  <AlwaysAllowCreateModal
    v-if="isCreateModalOpenRef"
    @success="handleAlwaysAllowSuccess"
    @close="closeAlwaysAllowCreateModal"
  />
  <!-- 항상허용 삭제 모달 -->
  <AlwaysAllowDeleteModal
    v-if="isDeleteModalOpenRef"
    :data="selectedTableRowRef"
    @close="closeAlwaysAllowDeleteModal"
  />
</template>
