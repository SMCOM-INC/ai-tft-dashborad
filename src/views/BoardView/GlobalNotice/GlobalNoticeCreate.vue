<script setup>
  import ButtonBack from '@components/common/ButtonBack.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import GlobalNoticeForm from '@views/BoardView/GlobalNotice/components/GlobalNoticeForm.vue';
  import { watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import usePostGlobalNoticePost from '@/lib/queries/boardGlobalNotice/usePostGlobalNoticePost.js';

  const { navigateTo } = useNavigate();

  const {
    postGlobalNoticeAsync,
    isPostGlobalNoticeLoading,
    isPostGlobalNoticeSuccess,
  } = usePostGlobalNoticePost();

  const handleFormSubmit = async (formData) => {
    await postGlobalNoticeAsync(formData);
  };

  const handleFormCancel = () => {
    navigateTo('/master/global-notice');
  };

  // 등록 성공 시 페이지 이동 처리
  watch(isPostGlobalNoticeSuccess, (isSuccess) => {
    if (isSuccess) {
      navigateTo('/master/global-notice');
    }
  });
</script>

<template>
  <div id="GlobalNoticeCreate" class="w-full">
    <ButtonBack />
    <div class="flex justify-between">
      <PageTitleBase title="전체 공지사항 등록하기" />
    </div>
    <!-- GlobalNoticeForm 내에서 useGlobalNoticeForm 을 통해 상태가 관리된다. -->
    <section>
      <GlobalNoticeForm
        mode="create"
        :loading="isPostGlobalNoticeLoading"
        :is-post-global-notice-success="isPostGlobalNoticeSuccess"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </section>
  </div>
</template>
