<script setup>
  import ErrorIcon from '@assets/icons/icon-errorInfo-red.svg';
  import ChipBase from '@components/common/ChipBase.vue';
  import FilterCheckboxGroup from '@components/common/FilterCheckboxGroup.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SearchBar from '@components/common/SearchBar.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import TableView from '@components/common/TableView.vue';
  import AptModal from '@views/AptManagementView/AptModal.vue';
  import { onMounted, ref, watch } from 'vue';

  import {
    MASTER_APT_SEARCH_INPUT_LIST,
    MASTER_APT_TABLE_COLUMNS_LIST,
  } from '@/constants/apt.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetAptContentList from '@/lib/queries/apt/useGetAptContentList.js';
  import useGetMasterAptList from '@/lib/queries/apt/useGetMasterAptList.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { navigateTo } = useNavigate();
  const { setUserInfo } = useUserInfoStore();

  const { aptTableList, isAptListLoading, isAptListError, aptListError } =
    useGetMasterAptList();

  const { contentList, isContentListLoading } = useGetAptContentList();

  const filterContent = ref({});

  const handleRowClick = (row) => {
    navigateTo(`/master/apt-management/detail/${row.uuid}`);
  };

  const hasInvalidCounts = (row) => {
    const counts = [
      'houseHoldBuildingCount',
      'houseHoldHouseCount',
      'storeBuildingCount',
      'storeHouseCount',
    ];

    return counts.some((count) => row?.[count] === 0);
  };

  watch(
    contentList,
    (newValue) => {
      if (!newValue) {
        return;
      }

      filterContent.value = {
        filterName: '사용 서비스',
        filterKey: 'contentUuidList',
        list: newValue?.map((item) => ({
          key: item?.uuid,
          label: item?.name,
        })),
      };
    },
    { immediate: true },
  );

  onMounted(async () => {
    setUserInfo({ aptName: '단지를 선택해주세요', aptUuid: null });
  });
</script>

<template>
  <div class="flex items-end justify-between">
    <PageTitleBase
      title="단지 관리"
      paragraph="아파트먼트 사용 단지를 관리합니다."
    />
    <AptModal mode="create" />
  </div>
  <SearchBar
    :search-input="MASTER_APT_SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isAptListLoading"
    class="mb-7"
  >
    <div v-if="isContentListLoading" class="flex items-center">
      <SpinnerCircle color="blue" />
    </div>
    <FilterCheckboxGroup v-else :filter="filterContent" />
  </SearchBar>
  <TableView
    :column-data="MASTER_APT_TABLE_COLUMNS_LIST"
    :page-data="aptTableList"
    :selectable="false"
    :show-count="true"
    :row-function="handleRowClick"
    :is-loading="isAptListLoading"
    :is-error="isAptListError"
    :error="aptListError"
  >
    <template #default="{ row, column }">
      <div
        v-if="column?.key === 'contentList'"
        class="flex h-full items-center gap-1"
      >
        <ChipBase
          v-for="list in row?.contentList?.slice(0, 3)"
          :key="list"
          color="gray-20"
          variant="fill"
          >{{ list }}</ChipBase
        >
        <ChipBase
          v-if="row?.contentList?.length > 3"
          color="gray-20"
          variant="outline"
          >+{{ row?.contentList?.length - 3 }}</ChipBase
        >
      </div>
      <template v-else-if="column?.key === 'name'">
        <span
          v-if="hasInvalidCounts(row)"
          class="flex gap-5 text-destructive-100"
        >
          {{ row?.name }}
          <ErrorIcon class="h-4" aria-hidden="true" />
        </span>
        <span v-else>{{ row?.name }}</span>
      </template>
    </template>
  </TableView>
</template>
