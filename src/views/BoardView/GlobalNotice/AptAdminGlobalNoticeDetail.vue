<script setup>
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ChipBase from '@components/common/ChipBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import QuillContentContainer from '@components/common/QuillContentContainer.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import { ref, watch } from 'vue';

  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import convertDeltaToHtml from '@/lib/delta/convertDeltaToHtml.js';
  import useGetAptAdminGlobalNoticeDetail from '@/lib/queries/boardGlobalNotice/useGetAptAdminGlobalNoticeDetail.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  const { getParams } = useNavigate();

  const apartmantNoticeUuid = getParams().uuid;
  const htmlContent = ref('');

  const { aptAdminGlobalNoticeDetail, isAptAdminGlobalNoticeDetailLoading } =
    useGetAptAdminGlobalNoticeDetail(apartmantNoticeUuid);

  watch(
    aptAdminGlobalNoticeDetail,
    (newDetail) => {
      if (newDetail) {
        // 서버에서 받은 content를 파싱
        htmlContent.value = convertDeltaToHtml(newDetail.content);
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div class="h-full w-full p-8">
    <ButtonBack />
    <div class="flex items-center justify-between">
      <PageTitleBase title="전체 공지사항" />
    </div>
    <section class="flex flex-col gap-5">
      <div class="flex flex-col gap-[10px]">
        <h3 class="text-base font-semibold text-muted-foreground-100">
          전체 공지사항 정보
        </h3>
        <SkeletonBar
          v-if="isAptAdminGlobalNoticeDetailLoading"
          key="skeleton-bar-1"
        />
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
                    {{ decodeUrl(aptAdminGlobalNoticeDetail?.title) || '-' }}
                  </h1>
                </td>
                <th
                  class="w-[250px] bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
                >
                  등록일시
                </th>
                <td class="px-6 py-4">
                  <span>{{
                    formatDate(
                      aptAdminGlobalNoticeDetail?.createdDate,
                    ).full() || '-'
                  }}</span>
                </td>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-100 bg-white">
              <tr>
                <th
                  class="w-[250px] bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
                >
                  카테고리
                </th>
                <td class="px-6 py-4" colspan="3">
                  <ChipBase
                    v-if="aptAdminGlobalNoticeDetail?.categoryName"
                    color="blue-100"
                    variant="outline"
                    class="w-fit"
                  >
                    {{ aptAdminGlobalNoticeDetail?.categoryName }}
                  </ChipBase>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex flex-col gap-[10px]">
        <h3 class="text-base font-semibold text-muted-foreground-100">내용</h3>
        <SkeletonBar v-if="isAptAdminGlobalNoticeDetailLoading" />
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
        v-if="aptAdminGlobalNoticeDetail?.uploadFilePathList?.length > 0"
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
                    v-for="(
                      filePath, index
                    ) in aptAdminGlobalNoticeDetail?.uploadFilePathList"
                    :key="index"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center justify-start">
                      <span class="whitespace-nowrap text-muted-foreground-100"
                        >첨부파일 {{ index + 1 }}</span
                      >
                      <a
                        :href="getFullImageUrl(filePath)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mx-4 cursor-pointer pretendard-link hover:underline"
                        >{{ decodeUrl(filePath.split('/').pop()) }}</a
                      >
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
          </thead>
        </table>
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
