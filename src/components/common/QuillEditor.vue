<script setup>
  import { QuillEditor } from '@vueup/vue-quill';
  import { ref, watch } from 'vue';

  import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
  import { ACCEPTED_IMAGE_EXTENSIONS } from '@/constants/common.js';
  import usePostBoardFile from '@/lib/queries/board/usePostBoardFile.js';
  import CustomImageCompress from '@/lib/utils/customQuillModules/customImageCompress.js';
  import CustomImageResize from '@/lib/utils/customQuillModules/customImageResizeModule.js';
  import CustomImageUploader from '@/lib/utils/customQuillModules/customImageUploader.js';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';

  const props = defineProps({
    modelValue: {
      type: [Array, Object],
      default: () => ({ ops: [] }),
    },
    contentType: {
      type: String,
      default: 'delta',
      validator: (value) => ['delta', 'html'].includes(value),
    },
    editorDomain: {
      type: String,
      default: '',
      validator: (value) =>
        Object.values(BOARD_EDITOR_CONTENT_TYPE).includes(value),
    },
  });

  const emit = defineEmits(['update:modelValue', 'update:uploadedImages']);

  const { postBoardFileMutationAsync } = usePostBoardFile();

  const quillEditorRef = ref(null);
  const content = ref(props.modelValue);
  const uploadedImagesRef = ref([]);
  const initialContentBackupRef = ref(null);
  const isInitialized = ref(false);

  const toolbar = [
    [{ size: ['normal', 'large', 'huge'] }],
    [{ header: 1 }, { header: 2 }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote'],
    ['clean'],
    ['link', 'image'],
  ];

  const quillModules = [
    {
      name: 'imageResize',
      module: CustomImageResize,
      options: {
        modules: ['DisplaySize', 'Resize', 'Delete'],
        displayStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white',
        },
      },
    },
    {
      name: 'customImageCompress',
      module: CustomImageCompress,
      options: {
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        preserveFormat: true,
      },
    },
    {
      name: 'customImageUploader',
      module: CustomImageUploader,
      options: {
        // 여러 개 중 단일 파일 처리 로직
        upload: async (file) => {
          try {
            // editorDomain은 aptUuid 가 선택 안 됐을 때, 'APARTMENT_NOTICE' 로 임의 지정 됨.
            const response = await postBoardFileMutationAsync({
              editorDomain: props.editorDomain,
              file,
            });

            if (response.data.success) {
              const fullImageUrl = getFullImageUrl(response.data.success.url);
              const formatSuccess = {
                ...response.data.success,
                url: fullImageUrl,
              };

              uploadedImagesRef.value = [
                ...uploadedImagesRef.value,
                formatSuccess,
              ];

              return formatSuccess;
            }
            throw new Error('Unexpected response format');
          } catch (err) {
            throw new Error('Upload failed');
          }
        },
        addCustomButton: true,
        acceptedExtensions: ACCEPTED_IMAGE_EXTENSIONS,
      },
    },
  ];

  const editorOptions = {
    theme: 'snow',
    placeholder: '내용을 입력해주세요.',
    modules: {
      imageResize: {
        modules: ['DisplaySize', 'Resize', 'Delete'],
      },
      customImageCompress: {
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        preserveFormat: true,
      },
      customImageUploader: true,
    },
    debug: false,
    silent: true,
  };

  const restoreImages = (delta) => {
    if (delta && delta.ops) {
      delta.ops.forEach((op) => {
        if (op.insert && op.insert.customImage) {
          const { url, uuid } = op.insert.customImage;
          const existingImage = uploadedImagesRef.value.find(
            (img) => img.uuid === uuid,
          );
          if (!existingImage) {
            uploadedImagesRef.value.push({ url, uuid });
          }
        }
      });
    }
  };

  const onEditorReady = (quill) => {
    quill.root.style.fontSize = '14px';
    quill.root.style.fontFamily = 'Pretendard, Arial, sans-serif';
    quill.root.style.overflowY = 'auto';
    quill.root.style.minHeight = '300px';
    quill.root.style.maxHeight = '700px';
    quill.root.style.maxWidth = '1024px';

    const editorToolbar = quill.root.parentElement.previousElementSibling;
    editorToolbar.style.borderColor = '#e5e7eb';
    editorToolbar.style.borderTopLeftRadius = '0.5rem';
    editorToolbar.style.borderTopRightRadius = '0.5rem';
    editorToolbar.style.maxWidth = '1024px';
    quill.root.parentElement.style.borderColor = '#e5e7eb';
    quill.root.parentElement.style.borderBottomLeftRadius = '0.5rem';
    quill.root.parentElement.style.borderBottomRightRadius = '0.5rem';
    quill.root.parentElement.style.maxWidth = '1024px';

    quill.focus();
    if (quill?.editor?.delta?.ops?.length > 0) {
      initialContentBackupRef.value = quill.editor.delta;
      restoreImages(initialContentBackupRef.value);
    }
  };

  const onEditorChange = (delta) => {
    if (!isInitialized.value) {
      content.value = delta.oldContents;
      isInitialized.value = true;
    }
  };

  const onUpdateContent = (delta) => {
    if (isInitialized.value) {
      content.value = delta;
    }
  };

  watch(
    uploadedImagesRef,
    (newValue) => {
      emit('update:uploadedImages', newValue);
    },
    { deep: true },
  );

  watch(content, (newValue) => {
    if (isInitialized.value) {
      if (
        newValue === undefined ||
        (newValue === null && initialContentBackupRef.value?.ops?.length > 0)
      ) {
        emit('update:modelValue', initialContentBackupRef.value);
      } else {
        emit('update:modelValue', newValue);
      }
    }
  });
</script>

<template>
  <QuillEditor
    ref="quillEditorRef"
    v-model:content="content"
    :content-type="contentType"
    :options="editorOptions"
    :toolbar="toolbar"
    :modules="quillModules"
    @ready="onEditorReady"
    @editor-change="onEditorChange"
    @update:content="onUpdateContent"
  />
</template>
