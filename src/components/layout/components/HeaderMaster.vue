<script setup>
  import IconErrorInfoRed from '@assets/icons/icon-errorInfo-red.svg';
  import CustomSelect from '@components/common/CustomSelect.vue';
  import HeaderBase from '@components/layout/components/HeaderBase.vue';
  import LNBHamburgerButton from '@components/layout/components/LNBHamburgerButton.vue';
  import ModalInOutHistoryResend from '@views/ParkingView/InOutHistory/ModalInOutHistoryResend.vue';
  import { computed, ref, watch } from 'vue';

  import { getMasterAptDetail } from '@/apis/apt.js';
  import { INIT_PAGE_PATH } from '@/constants/common.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetAptList from '@/lib/queries/apt/useGetAptList.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const userInfoStore = useUserInfoStore();
  const { resetToken } = useTokenStore();

  const { aptNameList, isAptNameListLoading } = useGetAptList();

  const isSettingMenuOpen = ref(false);
  const settingButtonContainer = ref(null);

  const selectedApt = ref({
    aptName: userInfoStore.userInfo.aptName,
    aptUuid: userInfoStore.userInfo.aptUuid,
  });

  const hasParking = computed(() =>
    userInfoStore.userInfo?.contentList?.some((item) =>
      item.name.includes('주차'),
    ),
  );

  const isAptManagementPage = computed(() => {
    const targetPaths = ['/master/apt-management', '/master/global-notice'];
    const currentPath = getCurrentRoutePath();
    return targetPaths.some((path) => currentPath.includes(path));
  });

  const selectApt = async (apt) => {
    try {
      const { data } = await getMasterAptDetail(apt.aptUuid);
      userInfoStore.setUserInfo(data.success);
    } catch (error) {
      userInfoStore.setUserInfo(apt);
    } finally {
      navigateTo(INIT_PAGE_PATH);
    }
  };

  const moveMasterAptManagement = () => {
    selectedApt.value = { aptName: '단지를 선택해주세요', aptUuid: null };
    userInfoStore.setUserInfo(selectedApt.value);
    navigateTo('/master/apt-management');
  };

  const clickSettingButton = () => {
    isSettingMenuOpen.value = !isSettingMenuOpen.value;
  };

  const blurSettingButton = (event) => {
    if (
      settingButtonContainer.value &&
      !settingButtonContainer.value.contains(event.relatedTarget)
    ) {
      isSettingMenuOpen.value = false;
    }
  };

  const handleLogoutButton = async () => {
    resetToken();
    userInfoStore.resetUserInfo();

    navigateTo('/login');
  };

  watch(
    () => userInfoStore.userInfo.aptUuid,
    (newValue) => {
      if (newValue) {
        selectedApt.value = {
          aptName: userInfoStore.userInfo.aptName,
          aptUuid: newValue,
        };
      } else {
        selectedApt.value = {
          aptName: '단지를 선택해주세요',
          aptUuid: null,
        };
      }
    },
    { immediate: true },
  );
</script>

<template>
  <HeaderBase>
    <div class="flex items-center gap-2">
      <LNBHamburgerButton />
      <CustomSelect
        v-model="selectedApt"
        placeholder="단지 선택"
        no-result-text="일치하는 단지가 없습니다."
        label="aptName"
        value-key="aptUuid"
        :options="aptNameList"
        :clearable="false"
        :loading="isAptNameListLoading"
        :disabled="userInfoStore.userInfo.aptUuid !== null"
        class="custom-select z-20 whitespace-nowrap pretendard-h5"
        @option:selected="selectApt"
      />
    </div>
    <div
      class="flex select-none items-center justify-between gap-1 rounded-lg border border-destructive-50 px-4 py-2"
    >
      <IconErrorInfoRed class="h-4 w-4" aria-hidden="true" />
      <span class="text-sm font-bold leading-[14px] text-destructive-100"
        >최고관리자로 접속중</span
      >
    </div>
    <div class="flex items-center gap-4">
      <ModalInOutHistoryResend
        v-if="userInfoStore.userInfo.aptUuid !== null && hasParking"
      />
      <button
        v-if="!isAptManagementPage"
        type="button"
        class="cursor-pointer rounded-md border px-4 py-3 font-medium leading-[14px]"
        @click="moveMasterAptManagement"
      >
        통합 단지관리 페이지로 이동
      </button>
      <div ref="settingButtonContainer" class="relative">
        <button
          class="rounded-full bg-muted-100 p-2 pretendard-p hover:bg-primary-10"
          type="button"
          @click="clickSettingButton"
          @blur="blurSettingButton"
        >
          설정
        </button>
        <div v-if="isSettingMenuOpen" class="absolute right-2 top-11">
          <button
            type="button"
            class="border-border-input w-36 rounded-[6px] border bg-background-100 px-3 py-[5.5px] text-left text-sm shadow-md"
            title="로그아웃"
            @click="handleLogoutButton"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </HeaderBase>
</template>

<style scoped>
  .custom-select.v-select {
    min-width: 250px;
    max-width: 100%;
  }

  .custom-select.v-select .vs__dropdown-toggle {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: lightblue;
  }

  .custom-select.v-select .vs__selected-options {
    display: flex;
    flex-wrap: nowrap;
    padding: 0;
  }

  .custom-select.v-select .vs__selected {
    margin: 0;
    padding: 0;
    border: none;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .custom-select.v-select .vs__actions {
    padding: 0;
  }

  .custom-select.v-select .vs__search {
    margin: 0;
    padding: 0;
    border: none;
    min-width: 0;
  }

  .custom-select.v-select .vs__dropdown-menu {
    min-width: 250px;
  }
</style>
