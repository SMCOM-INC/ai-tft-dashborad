<script setup>
  import IconChevronLeftGray from '@assets/icons/icon-chevron-left-gray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import SurveyCreateFormExcelPreviewModal from '@views/SurveyView/Form/SurveyCreateFormExcelPreviewModal.vue';
  import SurveyCreateFormExcelUploadModal from '@views/SurveyView/Form/SurveyCreateFormExcelUploadModal.vue';
  import { ref, watch } from 'vue';

  import { useSurveySubmitStore } from '@/stores/survey.js';

  const props = defineProps({
    detailInfo: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isDetailInfoLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const { setExcelInfo } = useSurveySubmitStore();

  const excelFile = ref(undefined);
  const modalType = ref(null);

  const closeModal = () => {
    modalType.value = null;
  };

  const openUploadExcelFileModal = () => {
    modalType.value = 'fileUpload';
  };

  const openPreviewExcelFileModal = () => {
    modalType.value = 'filePreview';
  };

  watch(
    () => props.detailInfo,
    (newValue) => {
      if (!newValue) {
        return;
      }

      excelFile.value = newValue.respondentList;
    },
    { immediate: true },
  );

  watch(
    excelFile,
    (newValue) => {
      if (!newValue) {
        return;
      }

      setExcelInfo(newValue);
    },
    { immediate: true },
  );
</script>

<template>
  <div>
    <div class="space-y-4">
      <div :class="`flex flex-col gap-2 rounded-lg bg-blue-s-info-25 p-4`">
        <div
          class="text-defaults-secondary-text-secondary pretendard-14SemiBold"
        >
          참여자 업로드 안내
        </div>
        <div
          class="flex flex-col gap-1 text-defaults-secondary-text-secondary pretendard-14Regular"
        >
          <div>
            · 참여자 명부는
            <span class="text-destructive-100">엑셀</span> 형태의 파일
            <span class="text-destructive-100">1개만</span> 업로드만 가능합니다.
          </div>
          <div>
            · 업로드된 명부의 내용은
            <span class="text-destructive-100">개별 수정이 불가</span>합니다.
            파일 수정 후,
            <span class="text-destructive-100">엑셀 파일 다시 업로드하기</span
            >를 눌러주시기 바랍니다.
          </div>
        </div>
      </div>
      <div v-if="isDetailInfoLoading" class="flex justify-center py-3">
        <SpinnerCircle color="blue" />
      </div>
      <div v-else class="flex justify-between gap-4">
        <div>
          <p
            v-if="excelFile?.length <= 0"
            class="text-alerts-error-text-error pretendard-14Regular"
          >
            파일을 업로드해주세요.
          </p>
        </div>
        <div class="flex gap-3">
          <ButtonBase
            v-if="excelFile?.length > 0"
            type="reset"
            color="secondary"
            class="flex items-center gap-2"
            @click="openPreviewExcelFileModal"
          >
            설문 대상자 확인하기
            <IconChevronLeftGray class="h-3 w-3 rotate-180" />
          </ButtonBase>
          <ButtonBase
            type="reset"
            color="outlined"
            @click="openUploadExcelFileModal"
          >
            {{
              excelFile?.length > 0
                ? '엑셀 파일 다시 업로드하기'
                : '엑셀 파일 업로드하기'
            }}
          </ButtonBase>
        </div>
      </div>
    </div>
    <SurveyCreateFormExcelUploadModal
      v-if="modalType === 'fileUpload'"
      @close="closeModal"
    />
    <SurveyCreateFormExcelPreviewModal
      v-if="excelFile?.length > 0 && modalType === 'filePreview'"
      :participant-list="excelFile"
      @close="closeModal"
    />
  </div>
</template>
