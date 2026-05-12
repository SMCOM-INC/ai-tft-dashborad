<script setup>
  import AptReplaceThumbnail from '@assets/apt-replcae-thumbnail.png';
  import IconClose from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import { ref, watch } from 'vue';


  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetLatestGlobalNoticeWithThumbnail from '@/lib/queries/boardGlobalNotice/useGetLatestGlobalNoticeWithThumbnail.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  const { navigateTo } = useNavigate();
  const { latestGlobalNotice } = useGetLatestGlobalNoticeWithThumbnail();

  const isModalOpen = ref(false);
  const isHideForToday = ref(false);

  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  // 쿠키 유틸리티
  const cookieUtils = {
    setCookie(name, value) {
      const date = new Date();
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999,
      );

      document.cookie = `${name}=${value};expires=${endOfDay.toUTCString()};path=/`;
    },

    getCookie(name) {
      const value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
      return value ? value[2] : null;
    },
  };

  // 오늘 하루 보지 않기 (해당 공지사항만)
  const handlePopupToday = () => {
    if (latestGlobalNotice.value?.uuid) {
      cookieUtils.setCookie(
        `hidePopup_${latestGlobalNotice.value.uuid}`,
        'true',
      );
    }
    closeModal();
  };

  // 공지사항이 3일 이내에 작성된 것인지 확인 (createdDate 기준)
  const isWithin3Days = (createdDate) => {
    if (!createdDate) return false;

    const created = new Date(createdDate);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);

    return diffDays <= 3;
  };

  // 공지사항 상세 페이지로 이동
  const moveToNoticeDetail = () => {
    if (latestGlobalNotice.value?.uuid) {
      navigateTo(
        `/board/global-notice/apt-admin-detail/${latestGlobalNotice.value.uuid}`,
      );
    }
    closeModal();
  };

  // 최신 공지사항이 있고 3일 이내에 작성된 경우만 모달 표시
  watch(
    latestGlobalNotice,
    (newValue) => {
      if (newValue && newValue.uuid && isWithin3Days(newValue.createdDate)) {
        // 해당 공지사항의 "오늘 하루 보지 않기" 상태 확인
        const hidePopup = cookieUtils.getCookie(`hidePopup_${newValue.uuid}`);
        isHideForToday.value = JSON.parse(hidePopup || 'false');

        // 해당 공지사항을 숨기지 않았다면 팝업 표시
        if (!isHideForToday.value) {
          openModal();
        }
      }
    },
    { immediate: true },
  );

  // onMounted에서 쿠키 확인은 제거 (watch에서 처리)
</script>

<template>
  <!-- 최신 공지사항이 있고, 오늘 하루 보지 않기를 선택하지 않은 경우 모달 표시 -->
  <ModalBaseNew v-if="isModalOpen && !isHideForToday && latestGlobalNotice">
    <div
      class="relative flex w-[500px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
    >
      <!-- 헤더 - 제목과 닫기 버튼 -->
      <div
        class="flex items-center justify-between border-b border-gray-200 bg-white p-5"
      >
        <h2
          class="text-xl font-semibold leading-6 text-gray-900 pretendard-20SemiBold"
        >
          전체 공지사항
        </h2>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          @click="closeModal"
        >
          <IconClose class="h-5 w-5" />
        </button>
      </div>

      <!-- 메인 컨텐츠 - 이미지 -->
      <div class="mb-4 bg-white">
        <!-- 썸네일 이미지를 그대로 표시 -->
        <div
          v-if="latestGlobalNotice.thumbnailFilePath"
          class="flex justify-center"
        >
          <img
            :src="getFullImageUrl(latestGlobalNotice.thumbnailFilePath)"
            :alt="latestGlobalNotice.title"
            class="max-w-full cursor-pointer rounded"
            @click="moveToNoticeDetail"
          />
        </div>

        <!-- 이미지가 없을 때 대체 컨텐츠 -->
        <div
          v-else
          id="no-thumbnail"
          class="cursor-pointer text-center"
          @click="moveToNoticeDetail"
        >
          <div class="mb-4 flex justify-center">
            <img :src="AptReplaceThumbnail" alt="아파트 기본 대체 썸네일" />
          </div>
          <p class="text-gray-500 pretendard-14Regular">
            자세한 내용을 확인하시려면 이미지를 클릭해주세요.
          </p>
        </div>
      </div>

      <!-- 하단 액션 영역 -->
      <div class="border-t border-gray-200 bg-white p-5">
        <div class="flex w-full gap-4">
          <ButtonBase
            type="button"
            color="secondary-fill"
            class="flex-1 rounded-md py-3 text-sm font-medium transition-colors pretendard-14Medium hover:bg-gray-200"
            @click="handlePopupToday"
          >
            오늘 하루 보지 않기
          </ButtonBase>
          <button
            type="button"
            class="flex-1 rounded-md bg-blue-600 py-3 text-sm font-medium text-white transition-colors pretendard-14Medium hover:bg-blue-700"
            @click="closeModal"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </ModalBaseNew>
</template>
