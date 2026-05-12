<script setup>
  import IconEditLineBlack from '@assets/icons/icon-edit-line-black.svg';
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import QuillContentContainer from '@components/common/QuillContentContainer.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import { ref, watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import convertDeltaToHtml from '@/lib/delta/convertDeltaToHtml.js';
  import useDeleteNoticePost from '@/lib/queries/boardNotice/useDeleteNoticePost.js';
  import useGetNoticeDetail from '@/lib/queries/boardNotice/useGetNoticeDetail.js';
  import usePostNoticePushAlarmResend from '@/lib/queries/boardNotice/usePostNoticePushAlarmResend.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { findNoticeType } from '@/lib/utils/formatBoard.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { getParams, navigateTo } = useNavigate();

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;
  const noticeUuid = getParams().uuid;
  const modalDeleteNoticePostModalRef = ref(null);
  const modalResendNoticePushModalRef = ref(null);
  const htmlContent = ref('');
  const sendPushDisabled = ref(false);

  const { noticeDetail, isNoticeDetailLoading } = useGetNoticeDetail(
    aptUuid,
    noticeUuid,
  );

  const {
    deleteNoticePostMutation,
    isDeleteNoticePostPending,
    isDeleteNoticePostError,
    deleteNoticePostError,
  } = useDeleteNoticePost();

  const {
    resendNoticePushMutation,
    isResendNoticePushPending,
    isResendNoticePushSuccess,
  } = usePostNoticePushAlarmResend(aptUuid);

  const deleteNotice = () => {
    deleteNoticePostMutation({
      noticeUuidList: [noticeUuid],
    });
  };

  const handleResendNoticePushAction = () => {
    resendNoticePushMutation(noticeUuid);
  };

  // 푸시알림 재발송 성공 시 버튼 비활성화
  watch(isResendNoticePushSuccess, (success, prevSuccess) => {
    if (success && !prevSuccess) {
      sendPushDisabled.value = true;
    }
  });

  watch(
    noticeDetail,
    (newNoticeDetail) => {
      if (newNoticeDetail) {
        htmlContent.value = convertDeltaToHtml(newNoticeDetail.content);
      }
    },
    { immediate: true },
  );

  const handleEditNotice = () => {
    navigateTo(`/board/notice/edit/${noticeUuid}`);
  };
</script>

<template>
  <div class="h-full w-full p-8">
    <ButtonBack />
    <div class="flex items-center justify-between">
      <PageTitleBase title="공지사항 상세" />
      <div class="flex flex-nowrap gap-[10px]">
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2"
          @click="handleEditNotice"
        >
          <IconEditLineBlack class="h-4 w-4" />
          <span>수정</span>
        </button>
        <ModalParagraph
          ref="modalDeleteNoticePostModalRef"
          trigger-button-name="푸시알림 재발송"
          title="푸시알림 발송"
          paragraph="푸시알림을 발송하시겠습니까?"
          :color="sendPushDisabled ? 'lightGray' : 'deepBlue'"
          close-button-name="알림 발송"
          :is-loading="isResendNoticePushPending"
          :disabled="sendPushDisabled"
          @confirm="handleResendNoticePushAction"
        />
      </div>
    </div>
    <section class="flex flex-col gap-5">
      <div class="flex flex-col gap-[10px]">
        <h3 class="text-base font-semibold text-muted-foreground-100">
          공지사항 정보
        </h3>
        <SkeletonBar v-if="isNoticeDetailLoading" key="skeleton-bar-1" />
        <div
          v-else
          class="mb-5 max-h-[610px] w-full overflow-auto rounded-md border"
        >
          <table class="w-full divide-y divide-dark-100 text-sm">
            <thead>
              <tr>
                <th
                  class="w-[250px] bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
                >
                  제목
                </th>
                <td class="px-6 py-4">
                  <h1 class="text-muted-foreground-100">
                    <div class="flex flex-nowrap items-center gap-2">
                      <ChipBase
                        v-if="noticeDetail?.categoryName"
                        :color="
                          noticeDetail?.noticeType === 'GENERAL'
                            ? 'blue-100'
                            : 'red-100'
                        "
                        variant="outline"
                        class="w-fit"
                      >
                        {{ findNoticeType(noticeDetail?.noticeType) }}
                      </ChipBase>
                      {{ decodeUrl(noticeDetail?.title) || '-' }}
                    </div>
                  </h1>
                </td>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-100 bg-white">
              <tr>
                <th
                  class="w-[250px] bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
                >
                  주제
                </th>
                <td class="px-6 py-4">
                  <ChipBase
                    v-if="noticeDetail?.categoryName"
                    color="blue-100"
                    variant="outline"
                    class="w-fit"
                  >
                    {{ noticeDetail?.categoryName }}
                  </ChipBase>
                  <span v-else>-</span>
                </td>
                <th
                  class="w-[250px] bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
                >
                  등록일시
                </th>
                <td class="px-6 py-4">
                  <span>{{
                    formatDate(noticeDetail?.createdDate).full() || '-'
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex flex-col gap-[10px]">
        <h3 class="text-base font-semibold text-muted-foreground-100">내용</h3>
        <SkeletonBar v-if="isNoticeDetailLoading" />
        <div
          v-else
          class="max-h-[610px] min-h-[337px] w-full overflow-auto rounded-md border px-4 py-3"
        >
          <QuillContentContainer>
            <span v-dompurify-html="htmlContent" />
          </QuillContentContainer>
        </div>
      </div>
      <div
        v-if="noticeDetail?.fileList?.length > 0"
        class="mb-5 max-h-[610px] w-full overflow-auto rounded-md border"
      >
        <table class="w-full divide-y divide-dark-100 text-sm">
          <thead>
            <tr>
              <th
                class="w-1/4 bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                첨부파일
              </th>
              <td class="px-6 py-3">
                <ul class="my-2 w-full space-y-2">
                  <li
                    v-for="(file, index) in noticeDetail?.fileList"
                    :key="index"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center justify-start">
                      <span class="whitespace-nowrap text-muted-foreground-100"
                        >첨부파일 {{ index + 1 }}</span
                      >
                      <a
                        :href="getFullImageUrl(file?.fileUrl)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mx-4 cursor-pointer pretendard-link hover:underline"
                        >{{ decodeUrl(file?.fileName) }}</a
                      >
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
          </thead>
        </table>
      </div>
      <div class="flex flex-nowrap gap-[10px]">
        <ModalParagraph
          ref="modalResendNoticePushModalRef"
          trigger-button-name="공지사항 삭제"
          title="공지사항을 삭제하시겠습니까?"
          paragraph="삭제된 공지사항은 복구할 수 없습니다."
          color="red"
          close-button-name="공지사항 삭제"
          icon="trash"
          :is-loading="isDeleteNoticePostPending"
          :is-error="isDeleteNoticePostError"
          :error="deleteNoticePostError"
          @confirm="deleteNotice"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
  @import '@vueup/vue-quill/dist/vue-quill.snow.css';

  .quill-content :deep(.ql-editor) {
    min-height: 100px;
  }
</style>
