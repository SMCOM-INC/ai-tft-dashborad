<script setup>
  import IconTrash from '@assets/icons/icon-trash-filled-black.svg';
  import IconUpload from '@assets/icons/icon-upload-line-black.svg';
  import LabelBase from '@components/common/LabelBase.vue';
  import TextError from '@components/common/TextError.vue';
  import { Field } from 'vee-validate';


  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import formatFileSize from '@/lib/utils/formatFileSize.js';

  const props = defineProps({
    mode: {
      type: String,
      required: true,
      validator: (value) => ['create', 'edit', 'view'].includes(value),
    },
    selectedFiles: {
      type: Array,
      required: true,
    },
    existingFiles: {
      type: Array,
      required: true,
    },
    uploadingFiles: {
      type: Array,
      default: () => [],
    },
    isUploadLoading: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([
    'fileChange',
    'removeNewFile',
    'deleteExistingFile',
  ]);

  const handleFileChange = (event) => {
    emit('fileChange', event);
  };

  const handleRemoveNewFile = (index) => {
    emit('removeNewFile', index);
  };

  const handleDeleteExistingFile = (fileUuid) => {
    emit('deleteExistingFile', fileUuid);
  };
</script>

<template>
  <div>
    <LabelBase
      label-for="uploadFile"
      label-text="첨부파일 (선택)"
      class="gap-4"
    >
      <Field
        id="uploadFile"
        type="file"
        name="uploadFile"
        accept=".pdf"
        multiple
        :disabled="
          props.disabled || selectedFiles.length >= 5 || isUploadLoading
        "
        @change="handleFileChange"
      />
      <label
        v-if="!props.disabled"
        for="uploadFile"
        :class="[
          'flex h-16 w-1/2 cursor-pointer items-center justify-center gap-1 rounded-md border px-3 py-2 text-muted-foreground-100',
          { 'cursor-not-allowed opacity-50': isUploadLoading },
        ]"
      >
        <div v-if="isUploadLoading" class="flex items-center gap-2">
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
          ></div>
          <span>업로드 중...</span>
        </div>
        <div v-else class="flex items-center gap-1">
          <IconUpload class="h-5 w-5" />
          <span>파일을 선택해주세요.</span>
        </div>
      </label>
      <p
        v-if="!props.disabled"
        class="text-xs leading-5 text-muted-foreground-100"
      >
        파일당 최대 20MB까지의 PDF 파일만 업로드 가능합니다 (최대 5개).
      </p>
    </LabelBase>
    <TextError v-if="errors.uploadFile" class="mt-1">
      {{ errors.uploadFile }}
    </TextError>

    <!-- Existing Files (Edit mode) -->
    <ul v-if="existingFiles.length > 0" class="my-4 w-1/2 space-y-2">
      <li
        v-for="(file, index) in existingFiles"
        :key="index"
        class="flex items-center justify-between"
      >
        <div class="flex items-center justify-start">
          <span class="whitespace-nowrap text-muted-foreground-100">
            기존 첨부파일 {{ index + 1 }}
          </span>
          <a
            :href="file.fileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mx-4 cursor-pointer pretendard-link hover:underline"
          >
            {{ decodeUrl(file.name) }}
            <span v-if="file.fileSize">
              ({{ formatFileSize(file.fileSize) }})
            </span>
          </a>
        </div>
        <button
          v-if="!props.disabled"
          type="button"
          class="text-red-500"
          @click="handleDeleteExistingFile(file.fileUuid)"
        >
          <IconTrash class="h-5 w-5" />
        </button>
      </li>
    </ul>

    <!-- Uploading Files -->
    <ul v-if="uploadingFiles.length > 0" class="my-4 w-1/2 space-y-2">
      <li
        v-for="(fileName, index) in uploadingFiles"
        :key="`uploading-${index}`"
        class="flex items-center justify-between opacity-75"
      >
        <div class="flex items-center justify-start">
          <span class="whitespace-nowrap text-muted-foreground-100">
            업로드 중인 파일 {{ index + 1 }}
          </span>
          <span class="mx-4 flex items-center gap-2">
            <div
              class="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
            ></div>
            {{ fileName }}
          </span>
        </div>
      </li>
    </ul>

    <!-- New Files -->
    <ul v-if="selectedFiles.length > 0" class="my-4 w-1/2 space-y-2">
      <li
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="flex items-center justify-between"
      >
        <div class="flex items-center justify-start">
          <span class="whitespace-nowrap text-muted-foreground-100">
            {{ mode === 'edit' ? '신규 ' : '' }}첨부파일 {{ index + 1 }}
          </span>
          <span class="mx-4">{{ file.name }} ({{ file.size }})</span>
        </div>
        <button
          v-if="!props.disabled"
          type="button"
          class="text-red-500"
          @click="handleRemoveNewFile(index)"
        >
          <IconTrash class="h-5 w-5" />
        </button>
      </li>
    </ul>
  </div>
</template>
