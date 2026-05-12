<script setup>
  import IconCloseBlack from '@assets/icons/icon-close-black.svg';
  import IconImagePlus from '@assets/icons/icon-imagePlus-line-blue.svg';
  import InputBase from '@components/common/InputBase.vue';
  import ModalImage from '@components/common/ModalImage.vue';
  import ModalParagraph from '@components/common/ModalParagraph.vue';
  import { ref } from 'vue';


  import { useCommentImageUpload } from '@/lib/composables/useCommentImageUpload.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';
  import { validateCommentContent } from '@/lib/utils/validateCommentContent.js';

  const props = defineProps({
    queryStates: {
      type: Object,
      default: () => ({ isPending: false, isError: false, error: '' }),
    },
    editorDomain: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['submit']);
  const comment = ref('');
  const submitModalRef = ref(null);
  const fileInputRef = ref(null);
  const isModalOpen = ref(false);

  const { uploadedImage, isUploading, handleFileChange, removeImage } =
    useCommentImageUpload(props.editorDomain);

  const handleImageClick = () => {
    fileInputRef.value.click();
  };

  const openModal = () => {
    if (uploadedImage.value) {
      isModalOpen.value = true;
    }
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const handleSubmit = () => {
    // 검증
    if (
      !validateCommentContent({
        content: comment.value,
        uploadedImage: uploadedImage.value,
        type: 'comment',
      })
    ) {
      return;
    }

    emit('submit', {
      content: comment.value,
      imageFileUuid: uploadedImage.value?.fileUuid || null,
    });

    comment.value = '';
    removeImage();
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      submitModalRef.value.handleOpenModal();
    }
  };
</script>

<template>
  <div class="flex gap-2 p-3">
    <!-- 댓글 입력 영역 (이미지 + textarea) -->
    <div class="flex-1 rounded border border-gray-300 shadow-sm">
      <!-- 이미지 미리보기 (textarea 위에) -->
      <div v-if="uploadedImage" class="relative m-2 inline-block">
        <img
          :src="getFullImageUrl(uploadedImage.url)"
          :alt="uploadedImage.fileName"
          class="h-20 w-20 cursor-pointer object-cover"
          @click="openModal"
        />
        <button
          type="button"
          class="absolute -right-1 -top-1 flex items-center justify-center rounded-full border border-defaults-tertiary-border-tertiary bg-defaults-primary-background-primary p-0.5"
          @click="removeImage"
        >
          <IconCloseBlack />
        </button>
      </div>

      <!-- Textarea -->
      <InputBase
        v-model="comment"
        type="textarea"
        placeholder="댓글 내용을 입력해주세요. (Ctrl + Enter로 등록)"
        :max-length="500"
        class="w-full border-0 p-0 focus:ring-0"
        @keydown="handleKeyDown"
      />
    </div>

    <!-- 버튼 영역 -->
    <div class="flex flex-col gap-2">
      <!-- 이미지 업로드 버튼 -->
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="isUploading"
        @click="handleImageClick"
      >
        <IconImagePlus class="h-6 w-6" />
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />

      <!-- 등록 버튼 -->
      <ModalParagraph
        ref="submitModalRef"
        trigger-button-name="등록"
        title="댓글 등록"
        paragraph="댓글을 등록하시겠습니까?"
        close-button-name="등록"
        :outlined="true"
        :disabled="comment.length === 0 && !uploadedImage"
        :color="comment.length > 0 || uploadedImage ? 'deepBlue' : 'lightGray'"
        :is-loading="queryStates.isPending"
        :is-error="queryStates.isError"
        :error="queryStates.error"
        :close-button-handler="handleSubmit"
      />
    </div>

    <!-- 이미지 확대 모달 -->
    <ModalImage
      :is-open="isModalOpen"
      :images="uploadedImage ? [{ fileUrl: uploadedImage.url }] : []"
      :image-index="0"
      @close="closeModal"
    />
  </div>
</template>
