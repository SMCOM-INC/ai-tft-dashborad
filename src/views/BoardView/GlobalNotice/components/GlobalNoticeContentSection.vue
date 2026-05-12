<script setup>
  import QuillEditor from '@components/common/QuillEditor.vue';
  import TextError from '@components/common/TextError.vue';
  import _ from 'lodash';
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
    errors: {
      type: Object,
      required: true,
    },
  });

  const emits = defineEmits(['update:uploaded-images']);

  const { setValue, meta } = useField('content');

  const uploadedImageList = ref([]); // 에디터에 업로드된 이미지 UUID 목록
  const editorContents = ref('');

  watch(
    () => props.content,
    (newContent) => {
      if (!newContent) {
        return;
      }

      // 문자열이면 파싱해서 직접 할당
      editorContents.value = parseEditorContent(newContent);
    },
    { immediate: true },
  );

  // 에디터에서 이미지 UUID 추출
  const extractImageUuids = (editorValue) => {
    if (!editorValue?.ops) return [];

    return _(editorValue.ops)
      .flatMap('insert')
      .filter(_.property('customImage'))
      .map('customImage.uuid')
      .value();
  };

  // 에디터에서 값이 변경될 때 호출되는 핸들러
  const updateValue = (editorValue) => {
    // 이미지 UUID 추출 및 업데이트
    uploadedImageList.value = extractImageUuids(editorValue);
    setValue(editorValue);

    // 상위 컴포넌트로 현재 이미지 목록 전달
    emits('update:uploaded-images', uploadedImageList.value);
  };
</script>

<template>
  <div>
    <span
      class="block select-none whitespace-nowrap pb-4 text-sm font-medium leading-none"
    >
      공지사항 본문 *
    </span>
    <QuillEditor
      v-model="editorContents"
      content-type="delta"
      :editor-domain="BOARD_EDITOR_CONTENT_TYPE.APARTMENT_NOTICE"
      @update:model-value="updateValue"
    />
    <TextError v-if="meta.touched && errors.content">
      {{ errors.content }}
    </TextError>
  </div>
</template>
