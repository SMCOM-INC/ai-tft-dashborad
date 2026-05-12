<script setup>
  import SettingLineBlackIcon from '@assets/icons/icon-setting-line-black.svg';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import LNBBase from '@components/layout/components/LNBBase.vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useLNBAptDetail from '@/lib/composables/lnb/useLNBAptDetail.js';
  import useLNBMenuList from '@/lib/composables/lnb/useLNBMenuList.js';

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const { aptDetail, isAptDetailLoading } = useLNBAptDetail();
  const { filteredLNBList, shouldShowSetting } = useLNBMenuList(aptDetail);

  const moveSettingPage = (id) => {
    navigateTo(`/${id}/settings`);
  };

  const moveMenu = (path) => {
    navigateTo(path);
  };

  const getMenuItemClass = (path) => {
    const isActive = getCurrentRoutePath().includes(path);

    return `block w-full px-4 py-2 text-left pretendard-16Regular hover:bg-primary-20 ${isActive ? 'bg-accent-100' : ''}`;
  };
</script>
<template>
  <LNBBase class="flex flex-col justify-between">
    <!-- 로딩 -->
    <div v-if="isAptDetailLoading" class="py-4">
      <SkeletonBar v-for="i in 10" :key="i" />
    </div>

    <!-- 메뉴 -->
    <div v-else>
      <ul
        v-for="section in filteredLNBList"
        :key="section.title"
        class="px-3 py-1"
      >
        <!-- 섹션 이름, 설정 버튼 -->
        <li
          class="flex w-full items-center justify-between gap-2 px-1 py-2 pretendard-16SemiBold"
        >
          <span>{{ section.title }}</span>
          <button
            v-if="shouldShowSetting(section)"
            type="button"
            class="px-3"
            @click="moveSettingPage(section.id)"
          >
            <SettingLineBlackIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </li>
        <!-- 섹션 메뉴 리스트 -->
        <ul class="flex flex-col gap-1">
          <li v-for="item in section.list" :key="item.id">
            <button
              type="button"
              :class="getMenuItemClass(item.path)"
              @click="moveMenu(item.path)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </ul>
    </div>
    <div class="flex w-full justify-center bg-background-100 pb-4">
      <img
        src="/logo-full.png"
        alt="아파트먼트 로고 이미지"
        class="w-[108px]"
      />
    </div>
  </LNBBase>
</template>
