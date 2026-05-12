<script setup>
  import IconDownload from '@assets/icons/icon-download-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalImage from '@components/common/ModalImage.vue';
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';
  import JSZip from 'jszip';
  import { ref } from 'vue';

  import { REPAIR_DETAIL_CONTENTS_CELL_COLUMN } from '@/constants/repair.js';
  import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
  import decodeUrlToParagraph from '@/lib/utils/decodeUriParagraph.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  defineProps({
    repairDetail: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  });

  const isImageModalOpen = ref(false);
  const selectedImageIndex = ref(0);

  const openImageModal = (index) => {
    selectedImageIndex.value = index;
    isImageModalOpen.value = true;
  };

  // 모달 닫기
  const closeImageModal = () => {
    isImageModalOpen.value = false;
  };

  // 사진 일괄 다운로드 하기
  const downloadImageBundle = async (repairDetail) => {
    if (!repairDetail?.fileList || repairDetail.fileList.length <= 0) {
      return swalErrorModal({
        text: '다운로드 가능한 사진이 존재하지 않습니다.',
      });
    }

    const zip = new JSZip();

    // S3 링크 직접 다운로드 방식 (개발 환경 Allow CORS 플러그인 사용)
    try {
      const imagePromises = repairDetail.fileList.map(async (image) => {
        const fullUrl = getFullImageUrl(image?.fileUrl);
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        const fileName =
          image.fileUrl.split('/').pop() || `${image.fileUuid}.jpg`;

        return zip.file(fileName, blob);
      });

      await Promise.all(imagePromises);

      // ZIP 파일 생성 및 다운로드
      const content = await zip.generateAsync({ type: 'blob' });

      // 다운로드 실행
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      const zipFileName = `하자보수_사진_${repairDetail.receiptNum}_${repairDetail.dongHo}_${repairDetail.residentName}.zip`;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      swalErrorModal({ text: '사진 다운로드 중 오류가 발생했습니다.' });
    }
  };
</script>

<template>
  <section class="relative flex flex-col gap-2 pt-5">
    <h2
      class="select-none text-[15px] font-semibold leading-5 text-muted-foreground-100"
    >
      접수내용
    </h2>
    <TableInfoBaseNew
      :table-headers="REPAIR_DETAIL_CONTENTS_CELL_COLUMN"
      table-padding="px-6 py-4"
      table-head-class="w-40"
    >
      <template #cell="{ cell }">
        <template v-if="cell.key === 'content'">
          <!-- 접수내용 텍스트 -->
          <div
            v-dompurify-html="decodeUrlToParagraph(repairDetail[cell.key])"
            :class="`${repairDetail?.fileList?.length > 0 && 'mb-4'}`"
          >
            {{ repairDetail[cell.key] }}
          </div>
          <!-- 접수내용 이미지 리스트 -->
          <div v-if="repairDetail?.fileList?.length > 0">
            <ul class="mb-4 flex gap-2">
              <li
                v-for="(image, index) in repairDetail?.fileList"
                :key="image?.fileUuid"
                class="flex justify-center"
              >
                <button type="button" @click="openImageModal(index)">
                  <img
                    class="border-gray-20 h-20 w-20 rounded-md border object-cover object-center"
                    :src="getFullImageUrl(image?.fileUrl)"
                    :alt="`이미지 ${image.fileUrl.split('/')[4]}`"
                  />
                </button>
              </li>
            </ul>
            <ButtonBase
              type="button"
              color="secondary-fill"
              size="md"
              class="flex items-center justify-between gap-2"
              @click="downloadImageBundle(repairDetail)"
            >
              사진 일괄 다운로드
              <IconDownload />
            </ButtonBase>
          </div>
        </template>
        <div
          v-else
          v-dompurify-html="decodeUrlToParagraph(repairDetail[cell.key]) || '-'"
        />
      </template>
    </TableInfoBaseNew>
  </section>
  <ModalImage
    :is-open="isImageModalOpen"
    :images="repairDetail?.fileList"
    :image-index="selectedImageIndex"
    @close="closeImageModal"
  />
</template>
