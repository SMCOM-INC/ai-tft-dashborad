<script setup>
  import ButtonBack from '@components/common/ButtonBack.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import GlobalNoticeForm from '@views/BoardView/GlobalNotice/components/GlobalNoticeForm.vue';
  import { watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useGetGlobalNoticeDetail from '@/lib/queries/boardGlobalNotice/useGetGlobalNoticeDetail.js';
  import usePatchGlobalNoticePost from '@/lib/queries/boardGlobalNotice/usePatchGlobalNoticePost.js';

  const { getParams, navigateBack, navigateTo } = useNavigate();

  const globalNoticeUuid = getParams().uuid;

  const { globalNoticeDetail, isGlobalNoticeDetailLoading } =
    useGetGlobalNoticeDetail(globalNoticeUuid);

  const {
    patchGlobalNoticeAsync,
    isPatchGlobalNoticeLoading,
    isPatchGlobalNoticeSuccess,
  } = usePatchGlobalNoticePost();

  const handleFormSubmit = async (formData) => {
    await patchGlobalNoticeAsync({
      globalNoticeUuid,
      formData,
    });
  };

  const handleFormCancel = () => {
    navigateBack();
  };

  // 수정 성공 시 페이지 이동 처리
  watch(isPatchGlobalNoticeSuccess, (isSuccess) => {
    if (isSuccess) {
      navigateTo('/master/global-notice');
    }
  });
</script>

<template>
  <div class="h-full w-full p-8">
    <ButtonBack />
    <div class="flex justify-between">
      <PageTitleBase title="전체 공지사항 상세" />
    </div>
    <section>
      <GlobalNoticeForm
        mode="edit"
        :initial-data="globalNoticeDetail"
        :loading="isPatchGlobalNoticeLoading || isGlobalNoticeDetailLoading"
        :is-patch-global-notice-success="isPatchGlobalNoticeSuccess"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </section>
  </div>
</template>
