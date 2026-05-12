<script setup>
  import IconCloseBlack from '@assets/icons/icon-close-black.svg';
  import IconImagePlusGray from '@assets/icons/icon-imagePlus-line-gray.svg';
  import ModalImage from '@components/common/ModalImage.vue';
  import TextError from '@components/common/TextError.vue';
  import { useField } from 'vee-validate';
  import { computed, ref } from 'vue';


  import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
  import usePostBoardFile from '@/lib/queries/board/usePostBoardFile.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';
  import validatorFiles from '@/lib/utils/validatorFiles.js';

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxSize: {
      type: Number,
      default: 1.5 * 1024 * 1024, // 1.5MB
    },
    errors: {
      type: Object,
      required: true,
    },
  });

  const { value, setValue, errorMessage: fieldError } = useField(props.name);
  const { postBoardFileMutationAsync } = usePostBoardFile();

  const isModalOpen = ref(false);
  const uploadError = ref(''); // 업로드 과정의 오류만 처리

  const hasImage = computed(() => !!value.value);

  // 최종 오류 메시지 (스키마 오류 + 업로드 오류)
  const errorMessage = computed(() => {
    // props로 받은 오류가 있으면 우선 표시
    if (props.errors[props.name]) {
      return props.errors[props.name];
    }

    // 필드 자체 오류 (vee-validate)
    if (fieldError.value) {
      return fieldError.value;
    }

    // 업로드 과정 오류
    return uploadError.value;
  });

  // 이미지 업로드 처리
  const uploadImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    const validatedFiles = validatorFiles({
      inputFiles: [file],
      currentFiles: value.value ? [value.value] : [],
      config: {
        maxCount: 1,
        maxSize: props.maxSize,
        allowedTypes: ['image/'],
      },
    });

    if (validatedFiles.validFiles.length === 0) {
      errorMessage.value = '유효하지 않은 파일입니다.';
      return;
    }

    try {
      errorMessage.value = '';
      const response = await postBoardFileMutationAsync({
        editorDomain: BOARD_EDITOR_CONTENT_TYPE.APARTMENT_NOTICE,
        file,
      });

      setValue({
        name: response.data.success.fileName,
        url: response.data.success.url,
        uuid: response.data.success.uuid,
        fileSize: response.data.success.fileSize,
        file,
      });
    } catch (error) {
      errorMessage.value = '이미지 업로드에 실패했습니다.';
    }

    event.target.value = '';
  };
  // 이미지 삭제 처리
  const handleImageDelete = () => {
    setValue(null);
  };
  // 모달 열기/닫기
  const openModal = () => {
    if (hasImage.value) {
      isModalOpen.value = true;
    }
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- 이미지 첨부 버튼 -->
    <label
      v-if="!hasImage"
      :class="`flex h-fit w-fit items-center gap-2 rounded-md border border-defaults-primary-border-primary px-3 py-2 text-defaults-secondary-text-secondary pretendard-14Medium ${disabled ? 'cursor-not-allowed bg-slate-50' : 'cursor-pointer'}`"
    >
      <input
        type="file"
        accept="image/*"
        :disabled="disabled"
        class="hidden"
        @change="uploadImage"
      />
      <IconImagePlusGray />
      썸네일 업로드
    </label>

    <!-- 이미지 미리보기 -->
    <div v-if="hasImage" class="relative">
      <img
        :src="getFullImageUrl(value.url)"
        :alt="value.name"
        class="h-20 w-20 cursor-pointer object-cover"
        @click="openModal"
      />
      <button
        v-if="!disabled"
        type="button"
        class="absolute -right-1 -top-1 flex items-center justify-center rounded-full border border-defaults-tertiary-border-tertiary bg-defaults-primary-background-primary p-0.5"
        @click="handleImageDelete"
      >
        <IconCloseBlack />
      </button>
    </div>

    <!-- 이미지 업로드 실패: 에러 메시지 -->
    <TextError v-if="errorMessage" class="-mt-2">{{ errorMessage }}</TextError>

    <!-- 이미지 확대 모달 -->
    <ModalImage
      :is-open="isModalOpen"
      :images="hasImage ? [{ fileUrl: value.url }] : []"
      :image-index="0"
      @close="closeModal"
    />
  </div>
</template>
