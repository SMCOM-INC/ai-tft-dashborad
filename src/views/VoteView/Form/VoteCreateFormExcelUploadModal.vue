<script setup>

  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import IconErrorInfoRed from '@assets/icons/icon-errorInfo-red.svg';
  import TrashIcon from '@assets/icons/icon-trash-line-black.svg';
  import UploadIcon from '@assets/icons/icon-upload-line-gray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import useExcelUploader from '@/lib/composables/common/useExcelUploader.js';
  import useGetVoteFormSampleExcel from '@/lib/queries/vote/useGetVoteFormSampleExcel.js';
  import usePostVoteFormExcel from '@/lib/queries/vote/usePostVoteFormExcel.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatFileSize from '@/lib/utils/formatFileSize.js';

  const emits = defineEmits(['close']);

  const { isVoteFormSampleExcelLoading, refetchVoteFormSampleExcel } =
    useGetVoteFormSampleExcel();

  const {
    postVoteFormExcelMutationAsync,
    postVoteFormExcelData,
    isPostVoteFormExcelPending,
    isPostVoteFormExcelSuccess,
    voteFormExcelProgressPercent,
    isPostVoteFormExcelError,
    postVoteFormExcelError,
  } = usePostVoteFormExcel();

  const {
    loadedFile,
    errorText,
    errorData,
    successCount,
    isBefore,
    isError,
    isUploading,
    isSuccess,
    handleFile,
    deleteFile,
  } = useExcelUploader({
    mutationAsyncFunction: postVoteFormExcelMutationAsync,
    mutationData: postVoteFormExcelData,
    isMutationPending: isPostVoteFormExcelPending,
    isMutationSuccess: isPostVoteFormExcelSuccess,
    isMutationError: isPostVoteFormExcelError,
    mutationError: postVoteFormExcelError,
  });

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="w-[512px] space-y-6 p-6">
      <!-- 제목 -->
      <div class="flex justify-between gap-2">
        <h1 class="pretendard-18Medium">참여자 EXCEL 파일 업로드하기</h1>
        <button
          type="button"
          :disabled="isPostVoteFormExcelPending"
          @click="closeModal"
        >
          <CloseIcon class="h-5 w-5" />
        </button>
      </div>
      <div class="space-y-2">
        <!-- 1.업로드 전 -->
        <template v-if="isBefore">
          <div class="flex justify-end">
            <button
              type="button"
              class="flex gap-3 underline underline-offset-2"
              @click="refetchVoteFormSampleExcel"
            >
              샘플 엑셀파일 다운로드
              <SpinnerCircle
                v-if="isVoteFormSampleExcelLoading"
                color="blue"
                class="flex"
              />
            </button>
          </div>
          <label
            for="excelFile"
            class="flex cursor-pointer items-center justify-center gap-1 rounded-md border border-defaults-secondary-border-secondary bg-defaults-primary-background-primary px-3 py-6"
          >
            <UploadIcon />
            <p
              class="text-center text-defaults-secondary-text-secondary pretendard-14Regular"
            >
              파일을 선택해주세요.
            </p>
            <input
              id="excelFile"
              accept=".xls, .xlsx, .xlsm, .xlsb"
              type="file"
              hidden
              @change="handleFile"
            />
          </label>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            최대 5MB까지 업로드 가능합니다.
          </p>
        </template>

        <!-- 2.업로드 중 또는 에러났을 때 -->
        <template v-else-if="isError || isUploading">
          <div
            :class="`flex items-center justify-between gap-10 rounded-md bg-defaults-primary-background-primary  ${isError ? 'border border-defaults-secondary-border-secondary px-3 py-5' : undefined}`"
          >
            <div class="flex gap-2">
              <span
                class="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap pretendard-14Medium"
                >{{ decodeUrl(loadedFile?.name) }}</span
              >
              <span
                class="text-defaults-secondary-text-secondary pretendard-14Regular"
              >
                {{ formatFileSize(loadedFile?.size) }}</span
              >
            </div>
            <button v-if="isError" type="button" @click="deleteFile">
              <TrashIcon />
            </button>
          </div>
          <!-- 진행중 -->
          <div v-if="isUploading" class="flex flex-col items-end gap-1">
            <span
              class="text-defaults-secondary-text-secondary pretendard-14Regular"
            >
              {{ voteFormExcelProgressPercent }}%
            </span>
            <div
              class="flex h-1 w-full overflow-hidden rounded-full bg-defaults-secondary-background-secondary"
            >
              <div
                class="h-full bg-brand-default-background-brand transition-all duration-300"
                :style="{ width: `${voteFormExcelProgressPercent}%` }"
              />
            </div>
          </div>
          <!-- 에러 문구 -->
          <div v-if="isError" class="flex gap-2">
            <IconErrorInfoRed class="h-5 w-5" />
            <p class="text-red-700">{{ errorText }}</p>
          </div>
          <div
            v-if="errorData"
            class="max-h-32 overflow-y-auto rounded-lg bg-red-50 p-3 font-medium text-red-800"
          >
            {{ errorData }}
          </div>
        </template>

        <!-- 3.업로드 완료 -->
        <div v-else-if="isSuccess" class="space-y-4">
          <p>
            <span class="text-brand-default-text-brand pretendard-20Bold">{{
              successCount
            }}</span>
            <span class="pretendard-14Regular">명 등록에 성공하였습니다.</span>
          </p>
          <div :class="`flex flex-col gap-2 rounded-lg bg-blue-s-info-25 p-4 `">
            <span
              class="text-defaults-secondary-text-secondary pretendard-14SemiBold"
              >예상 부과금액 (※익월 후불 청구, VAT 별도)</span
            >
            <div>
              <span
                >유효 선거인
                <span
                  class="text-brand-default-text-brand pretendard-14SemiBold"
                  >{{ successCount }}</span
                >명 * 130원 =
              </span>
              <span class="text-brand-default-text-brand pretendard-14SemiBold">
                {{ successCount * 130 }} </span
              >원
            </div>
          </div>
          <ButtonBase
            type="button"
            color="primary"
            class="w-full"
            :disabled="!isSuccess"
            @click="closeModal"
          >
            확인
          </ButtonBase>
        </div>
      </div>
      <!-- 모달 로딩 -->
      <div
        v-if="
          loadedFile !== undefined &&
          errorText === undefined &&
          !isPostVoteFormExcelPending &&
          !isPostVoteFormExcelSuccess
        "
        class="flex w-full justify-center py-10"
      >
        <SpinnerCircle color="blue" />
      </div>
    </div>
  </ModalBaseNew>
</template>
