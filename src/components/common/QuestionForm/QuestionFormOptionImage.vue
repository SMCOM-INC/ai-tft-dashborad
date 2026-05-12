<script setup>
  import IconCloseBlack from '@assets/icons/icon-close-black.svg';
  import IconImagePlusGray from '@assets/icons/icon-imagePlus-line-gray.svg';
  import { useIsMutating } from '@tanstack/vue-query';
  import { useFieldArray } from 'vee-validate';
  import { computed, ref } from 'vue';


  import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
  import {
    ACCEPTED_IMAGE_EXTENSIONS,
    ACCEPTED_IMAGE_TYPES,
  } from '@/constants/common.js';
  import usePostBoardFile from '@/lib/queries/board/usePostBoardFile.js';
  import formatFileSize from '@/lib/utils/formatFileSize.js';
  import validatorFiles from '@/lib/utils/validatorFiles.js';
  import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

  const props = defineProps({
    questionIndex: {
      type: Number,
      required: true,
    },
    optionIndex: {
      type: Number,
      required: true,
    },
  });

  const { getIsQuestionDisabled } = useQuestionFormDisabledStore();

  const { fields: questionFields } = useFieldArray(`questionForm`);

  const isMutating = useIsMutating();

  const { postBoardFileMutationAsync } = usePostBoardFile();

  const {
    fields: fileFields,
    push: filePush,
    remove: fileRemove,
  } = useFieldArray(
    `questionForm.${props.questionIndex}.options.${props.optionIndex}.fileList`,
  );

  const errorMessage = ref('');

  const isQuestionDisabled = computed(() => {
    return getIsQuestionDisabled(
      questionFields.value[props.questionIndex].value.id,
    );
  });

  const uploadImage = (event) => {
    const validatedFiles = validatorFiles({
      inputFiles: event.target.files,
      currentFiles: fileFields.value,
      config: {
        maxCount: 5,
        maxSize: 1.5 * 1024 * 1024, // 1.5 MB
        allowedTypes: ACCEPTED_IMAGE_TYPES,
      },
    });

    validatedFiles.validFiles.forEach(async (file) => {
      const response = await postBoardFileMutationAsync({
        editorDomain: BOARD_EDITOR_CONTENT_TYPE.VOTE,
        file,
      });

      filePush({
        name: file.name,
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size),
        file,
        uuid: response.data.success.uuid,
      });
    });

    event.target.value = '';
  };

  const handleOptionImageDeleteButton = (index) => {
    fileRemove(index);
  };
</script>

<template>
  <div class="flex gap-2">
    <!-- 이미지 첨부 버튼 -->
    <label
      v-if="!isQuestionDisabled"
      :class="`flex h-fit w-fit  items-center gap-2 rounded-md border border-defaults-primary-border-primary px-3 py-2 text-defaults-secondary-text-secondary pretendard-14Medium ${isMutating > 0 ? 'cursor-not-allowed bg-slate-50' : 'cursor-pointer'}`"
    >
      <input
        type="file"
        :accept="ACCEPTED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`).join(',')"
        multiple
        :disabled="isMutating > 0"
        @change="uploadImage"
      />
      <IconImagePlusGray />
      이미지첨부
    </label>

    <!-- 이미지 미리보기 -->
    <ol v-if="fileFields.length > 0" class="flex gap-2">
      <li v-for="(file, index) in fileFields" :key="file?.id" class="relative">
        <img
          :src="file.value.url"
          :alt="file.value.name"
          class="h-20 w-20 object-cover"
        />
        <span
          class="absolute bottom-[0px] left-[0px] flex h-5 w-5 items-center justify-center bg-defaults-primary-background-primary-inverse text-center text-defaults-primary-text-primary-inverse"
          >{{ index + 1 }}</span
        >
        <button
          v-if="!isQuestionDisabled && isMutating === 0"
          type="button"
          class="absolute -right-1 -top-1 flex items-center justify-center rounded-full border border-defaults-tertiary-border-tertiary bg-defaults-primary-background-primary p-0.5"
          @click="handleOptionImageDeleteButton(index, file)"
        >
          <IconCloseBlack />
        </button>
      </li>
    </ol>

    <p>{{ errorMessage }}</p>
  </div>
</template>
