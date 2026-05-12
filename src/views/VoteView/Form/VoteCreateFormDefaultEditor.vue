<script setup>
  import QuillEditor from '@components/common/QuillEditor.vue';
  import { useField } from 'vee-validate';
  import { ref, watch } from 'vue';

  import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
  import parseEditorContent from '@/lib/utils/parseEditorContent.js';

  const props = defineProps({
    content: {
      type: [String, Object],
      required: false,
      default: '',
    },
  });

  const { setValue } = useField('content');

  const uploadedImageList = ref([]);
  const editorContent = ref('');

  const updateValue = (editorValue) => {
    // 이미지 uuid 배열값 업데이트
    uploadedImageList.value = editorValue.ops
      .flatMap((item) => item.insert)
      .filter((item) => item?.customImage)
      .map((item) => item.customImage.uuid);

    setValue(editorValue);
  };

  watch(
    () => props.content,
    (newValue) => {
      if (!newValue) {
        return;
      }

      // useField 로 제어해보려고 했으나, error 해결 못하여 에디터 컴포넌트 내부에서는 로컬 ref 로 관리
      editorContent.value = parseEditorContent(newValue);
    },
    { immediate: true },
  );
</script>

<template>
  <div>
    <QuillEditor
      v-model="editorContent"
      content-type="delta"
      :editor-domain="BOARD_EDITOR_CONTENT_TYPE.VOTE"
      @update:model-value="updateValue"
    />
  </div>
</template>
