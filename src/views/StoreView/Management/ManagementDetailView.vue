<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ButtonKebab from '@components/common/ButtonKebab.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';
  import ManagementExcelUploadModal from '@views/StoreView/Management/ManagementDetailDeletionModal.vue';
  import ManagementDetailInitPasswordModal from '@views/StoreView/Management/ManagementDetailInitPasswordModal.vue';
  import { ref } from 'vue';

  import {
    MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS_POSTPAID,
    MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS_PREPAID,
    SETTING_CHARGE_TYPE,
  } from '@/constants/store.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetStoreDetail from '@/lib/queries/store/useGetStoreDetail.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatMinutes from '@/lib/utils/formatMinutes.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const userInfoStore = useUserInfoStore();
  const { navigateTo } = useNavigate();

  const { storeDetail, isStoreDetailLoading } = useGetStoreDetail();

  const isStoreDeletionModalOpen = ref(false);
  const isInitPasswordModalOpen = ref(false);

  // 필드 값 렌더링
  const renderFieldValue = (key) => {
    if (!key || !storeDetail?.value) return '-';

    const value = storeDetail?.value[key];

    if (key === 'storeName') {
      return decodeUrl(value || '-');
    }

    if (key === 'freeParkingDiscountMinute') {
      return formatMinutes(value) || '0분';
    }

    if (key === 'chargedParkingDiscountMinute') {
      return formatMinutes(value) || '0분';
    }

    return value || '-';
  };

  // 상가 삭제 모달 open, close
  const openStoreDeletionModal = () => {
    isStoreDeletionModalOpen.value = true;
  };

  const closeStoreDeletionModal = () => {
    isStoreDeletionModalOpen.value = false;
  };

  // 비밀번호 초기화 모달 open, close
  const openInitPasswordModal = () => {
    isInitPasswordModalOpen.value = true;
  };

  const closeInitPasswordModal = () => {
    isInitPasswordModalOpen.value = false;
  };

  // 수정페이지로 이동
  const moveStoreEditPage = () => {
    navigateTo(`/store/management/edit/${storeDetail.value.uuid}`);
  };

  // 상가 삭제
  const deleteStore = () => {
    openStoreDeletionModal();
  };

  // 비밀번호 초기화
  const initPassword = () => {
    openInitPasswordModal();
  };

  const KEBAB_BUTTON_LIST = [
    { label: '퇴실 처리', color: 'text-destructive-100', handler: deleteStore },
  ];
</script>

<template>
  <div class="flex flex-col gap-7 p-10">
    <!-- 페이지 이름 및 버튼 -->
    <div class="flex justify-between">
      <PageTitleBase
        title="상가 상세"
        has-back-button
        back-url="/store/management"
      />
      <div class="flex h-fit justify-end gap-2">
        <!-- 수정하기 버튼 -->
        <ButtonBase
          type="button"
          color="primary"
          size="md"
          @click="moveStoreEditPage"
        >
          수정하기
        </ButtonBase>
        <!-- 더보기 버튼 -->
        <ButtonKebab :button-list="KEBAB_BUTTON_LIST" />
      </div>
    </div>
    <!-- 상가 기본 정보 테이블 -->
    <div>
      <h3 class="pb-3 pretendard-20SemiBold">상가 기본 정보</h3>
      <template v-if="isStoreDetailLoading">
        <SkeletonBase
          v-for="item in 4"
          :key="item"
          class="m-4 h-5 rounded-md"
        />
      </template>
      <TableInfoBaseNew
        v-else
        :table-headers="
          userInfoStore.userInfo.billingType === SETTING_CHARGE_TYPE.PREPAID
            ? MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS_PREPAID
            : MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS_POSTPAID
        "
        table-padding="px-4 py-2"
        table-head-class="w-44"
      >
        <template #cell="{ cell }">
          <div v-if="cell.key === 'storeId'" class="flex justify-between">
            {{ renderFieldValue(cell.key) }}
            <button
              type="button"
              class="ml-20 whitespace-nowrap rounded-[4px] border border-defaults-primary-border-primary px-2.5 py-1 text-defaults-secondary-text-secondary pretendard-14Regular"
              @click.stop="initPassword"
            >
              비밀번호 초기화
            </button>
          </div>
          <template v-else>{{ renderFieldValue(cell.key) }}</template>
        </template>
      </TableInfoBaseNew>
    </div>
  </div>
  <!-- 상가 퇴실 모달 -->
  <ManagementExcelUploadModal
    v-if="isStoreDeletionModalOpen"
    :store-name="storeDetail.storeName"
    @close="closeStoreDeletionModal"
  />
  <!-- 비밀번호 초기화 모달 -->
  <ManagementDetailInitPasswordModal
    v-if="isInitPasswordModalOpen"
    :store-id="storeDetail.storeId"
    @close="closeInitPasswordModal"
  />
</template>
