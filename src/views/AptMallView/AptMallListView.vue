<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import TableView from '@components/common/TableView.vue';
  import AptMallDetailModal from '@views/AptMallView/AptMallDetailModal.vue';
  import { computed } from 'vue';

  import {
    APT_MALL_LIST_TABLE_COLUMNS_LIST,
    APT_MALL_TYPE,
    STATUS_LIST,
  } from '@/constants/aptMall.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetAptMallList from '@/lib/queries/aptMall/useGetAptMallList.js';

  const { getParams, navigateTo, getQueryString } = useNavigate();

  const params = computed(() => getParams());
  const queryString = computed(() => getQueryString());

  const { aptMallList, isAptMallListLoading } = useGetAptMallList();

  const renderField = (key, value) => {
    if (value === undefined) {
      return '-';
    }

    if (key === 'createdDate' || key === 'orderDateTime') {
      return value.slice(0, 16);
    }

    if (key === 'personCount') {
      return `${value}명`;
    }

    if (key === 'orderPrice') {
      return `${Number(value).toLocaleString()}원`;
    }

    if (key === 'aptMallOrderType') {
      return APT_MALL_TYPE[value];
    }

    if (key === 'aptMallOrderState') {
      return STATUS_LIST.find((item) => item.status === value)?.label;
    }

    return value;
  };

  // 상세 모달 열기
  const openDetailModal = (row) => {
    navigateTo({
      path: `/aptMall/list/${row.aptMallOrderUuid}`,
      query: {
        ...queryString.value,
      },
    });
  };

  // 상세 모달 닫기
  const closeDetailModal = () => {
    navigateTo({
      path: '/aptMall/list',
      query: {
        ...queryString.value,
      },
    });
  };
</script>

<template>
  <div class="flex items-start justify-between">
    <PageTitleBase
      title="예약 관리"
      paragraph="예약 정보를 관리합니다."
      class="mb-0"
    />
  </div>
  <TableView
    :column-data="APT_MALL_LIST_TABLE_COLUMNS_LIST"
    :page-data="aptMallList"
    pageable
    show-count
  >
    <template #default="{ row, column }">
      <template v-if="isAptMallListLoading">
        <SkeletonBase class="h-5 rounded-md" />
      </template>
      <template v-else>
        <div v-if="column.key === 'detail'">
          <button
            type="button"
            class="rounded-[4px] border border-defaults-primary-border-primary px-2.5 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
            @click="openDetailModal(row)"
          >
            상세보기
          </button>
        </div>
        <div v-else>{{ renderField(column.key, row[column.key]) }}</div>
      </template>
    </template>
  </TableView>
  <AptMallDetailModal v-if="!!params.aptMallUuid" @close="closeDetailModal" />
</template>
