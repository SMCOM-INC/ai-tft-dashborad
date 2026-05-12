<script setup>
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import TabBarBase from '@components/common/TabBarBase.vue';
  import { ref } from 'vue';
  import { RouterView } from 'vue-router';

  import { BOARD_COMMUNITY_TAB_LIST } from '@/constants/board.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const { hasDetailPage } = useNavigate();

  const countData = ref({});
  countData.value = [{ key: 'reports', count: 5 }];
</script>

<template>
  <div class="flex flex-col">
    <div v-if="!hasDetailPage">
      <PageTitleBase
        title="소통공간"
        paragraph="회원의 소통공간 게시글을 관리합니다."
      />
      <TabBarBase :tab-list="BOARD_COMMUNITY_TAB_LIST" class="mb-8" />
    </div>
    <RouterView></RouterView>
  </div>
</template>
