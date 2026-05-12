<script setup>
  import HeaderBase from '@components/layout/components/HeaderBase.vue';
  import LNBHamburgerButton from '@components/layout/components/LNBHamburgerButton.vue';
  import ModalInOutHistoryResend from '@views/ParkingView/InOutHistory/ModalInOutHistoryResend.vue';
  import { computed, ref } from 'vue';

  import { INIT_PAGE_PATH } from '@/constants/common.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import { useTokenStore, useUserInfoStore } from '@/stores/auth.js';

  const userInfoStore = useUserInfoStore();
  const { token, resetToken } = useTokenStore();

  const { navigateTo } = useNavigate();

  const isMenuOpen = ref(false);
  const menuContainer = ref(null);

  const hasParking = computed(() =>
    userInfoStore.userInfo?.contentList?.some((item) =>
      item.name.includes('주차'),
    ),
  );

  const isStoreAdmin = computed(() => {
    return token.userRole === 'store_admin';
  });

  const handleButtonClick = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const handleButtonBlur = (event) => {
    if (
      menuContainer.value &&
      !menuContainer.value.contains(event.relatedTarget)
    ) {
      isMenuOpen.value = false;
    }
  };

  const handleLogoutButton = async () => {
    resetToken();
    userInfoStore.resetUserInfo();

    navigateTo('/login');
  };

  const profileIconChars = computed(() => {
    const { aptName } = userInfoStore.userInfo;

    if (!aptName) {
      return '설정';
    }

    const result = /^[A-Za-z]{2}/.test(aptName)
      ? aptName.slice(0, 2).toUpperCase()
      : aptName.slice(0, 1).toUpperCase();

    return result;
  });
</script>

<template>
  <HeaderBase>
    <div class="flex items-center gap-2">
      <LNBHamburgerButton />
      <span
        class="flex h-7 w-7 items-center justify-center rounded-full bg-primary-10"
      >
        {{ profileIconChars }}
      </span>
      <h1 class="pretendard-h4">
        <button type="button" @click="navigateTo(INIT_PAGE_PATH)">
          {{ userInfoStore.userInfo.aptName }}
        </button>
      </h1>
    </div>
    <div class="flex gap-4">
      <button
        v-if="!isStoreAdmin"
        type="button"
        class="h-10 rounded-md border border-blue-500 bg-blue-500 p-2 text-sm font-medium text-white transition-colors hover:border-blue-600 hover:bg-blue-600"
        @click="navigateTo('/board/global-notice')"
      >
        전체 공지사항
      </button>

      <ModalInOutHistoryResend
        v-if="
          userInfoStore.userInfo.aptUuid !== null &&
          hasParking &&
          token.userRole !== 'store_admin'
        "
      />
      <div ref="menuContainer" class="relative">
        <button
          class="rounded-full bg-muted-100 p-2 pretendard-p hover:bg-primary-10"
          type="button"
          aria-label="설정 버튼 클릭 후, 로그아웃 버튼 표시"
          @click="handleButtonClick"
          @blur="handleButtonBlur"
        >
          설정
        </button>
        <div v-if="isMenuOpen" class="absolute right-2 top-11">
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
