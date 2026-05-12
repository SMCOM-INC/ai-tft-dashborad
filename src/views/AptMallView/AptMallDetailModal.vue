<script setup>
  import IconArrowLeft from '@assets/icons/icon-arrow-left-solid.svg';
  import ChipBaseNew from '@components/common/ChipBaseNew.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';
  import AptMallDetailModalCancelButton from '@views/AptMallView/AptMallDetailModalCancelButton.vue';
  import { computed } from 'vue';

  import {
    APT_MALL_TYPE,
    DETAIL_TABLE_HEADERS,
    STATUS_LIST,
  } from '@/constants/aptMall.js';
  import useGetAptMallDetail from '@/lib/queries/aptMall/useGetAptMallDetail.js';
  import decodeUrlToParagraph from '@/lib/utils/decodeUriParagraph.js';

  const emits = defineEmits(['close']);

  const { aptMallDetail, isAptMallDetailLoading } = useGetAptMallDetail();

  const findDetailInfoStatus = computed(() =>
    STATUS_LIST.find(
      (item) => item.status === aptMallDetail.value?.aptMallOrderState,
    ),
  );

  const isCanceled = computed(
    () => findDetailInfoStatus.value?.status === 'CANCELED',
  );

  const convertDetailTableHeaders = computed(() => {
    if (isCanceled.value) {
      return DETAIL_TABLE_HEADERS;
    }

    const reservationHeaders = DETAIL_TABLE_HEADERS.map((row) =>
      row.filter((item) => !item.key.includes('cancel')),
    ).filter((row) => row.length > 0);

    return reservationHeaders;
  });

  const renderField = (key) => {
    if (aptMallDetail.value === undefined) {
      return '-';
    }

    if (aptMallDetail.value[key] === undefined && key !== 'menu') {
      return '-';
    }

    if (
      key === 'createdDate' ||
      key === 'orderDateTime' ||
      key === 'canceledDateTime'
    ) {
      return aptMallDetail.value[key]?.slice(0, 16);
    }

    if (key === 'personCount') {
      return `${aptMallDetail.value[key]}명`;
    }

    if (key === 'menu') {
      const menuList = aptMallDetail.value?.aptMallOrderMenuList.map(
        (menu) => `${menu.menuName} x ${menu.count}`,
      );
      return menuList.join(',');
    }

    if (key === 'orderPrice') {
      return `${Number(aptMallDetail.value[key])?.toLocaleString()}원`;
    }

    if (key === 'aptMallOrderType') {
      return APT_MALL_TYPE[aptMallDetail.value[key]];
    }

    if (key === 'aptMallOrderState') {
      return STATUS_LIST.find(
        (item) => item.status === aptMallDetail.value[key],
      );
    }

    return aptMallDetail.value[key];
  };

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <div
    :class="`fixed right-[0px] top-[0px] z-50 flex h-screen w-screen items-start justify-end bg-defaults-primary-background-dimmed`"
  >
    <div
      class="absolute flex h-full min-w-[400px] flex-col border bg-defaults-primary-background-primary"
      @click.stop
    >
      <!-- 제목 및 버튼 -->
      <div
        class="flex items-center justify-between rounded-tl-md rounded-tr-md border-b border-b-dark-100 bg-background-100 p-5"
      >
        <div class="flex items-center gap-1">
          <button type="button" @click="closeModal"><IconArrowLeft /></button>
          <h1 class="text-xl font-semibold leading-6">예약상세</h1>
        </div>
        <AptMallDetailModalCancelButton
          v-if="!isCanceled"
          :is-canceled="isCanceled"
        />
      </div>
      <!-- 예약 상세 -->
      <div class="flex h-[calc(100%-100px)] flex-col gap-3 overflow-y-auto p-7">
        <h2 class="pretendard-20SemiBold">예약 정보</h2>
        <template v-if="isAptMallDetailLoading">
          <SkeletonBase
            v-for="item in 5"
            :key="item"
            class="m-4 h-5 rounded-md"
          />
        </template>
        <TableInfoBaseNew
          v-else
          :table-headers="convertDetailTableHeaders"
          table-padding="px-4 py-2"
        >
          <template #cell="{ cell }">
            <template v-if="cell.key === 'aptMallOrderState'">
              <ChipBaseNew :color="renderField(cell.key)?.color">
                {{ renderField(cell.key).label }}
              </ChipBaseNew>
            </template>
            <p
              v-else-if="cell.key === 'orderNote'"
              v-dompurify-html="decodeUrlToParagraph(renderField(cell.key))"
            />
            <template v-else>{{ renderField(cell.key) }}</template>
          </template>
        </TableInfoBaseNew>
      </div>
    </div>
  </div>
</template>
