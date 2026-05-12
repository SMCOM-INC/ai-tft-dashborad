import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 투표 등록 - 이미지
export const useVoteImageStore = defineStore('voteImage', () => {
  // 투표 기본 정보의 에디터에 등록된 이미지 UUID 리스트
  const editorContentUuidList = ref(undefined);

  const setEditorContentValues = (newEditorContent) => {
    const uploadedEditorImageUuidList = newEditorContent.ops
      ?.flatMap((item) => item.insert)
      .filter((item) => item?.customImage)
      ?.map((item) => item.customImage.uuid);

    editorContentUuidList.value = uploadedEditorImageUuidList;
  };

  return {
    editorContentUuidList,
    setEditorContentValues,
  };
});

// 투표 등록 - 제출
export const useVoteSubmitStore = defineStore('voteSubmit', () => {
  const questionFormDisabledStore = useQuestionFormDisabledStore();
  const { hasActiveQuestion } = storeToRefs(questionFormDisabledStore);

  const isDefaultCompleted = ref(undefined);
  const isExcelCompleted = ref(undefined);
  const isQuestionCompleted = computed(() => {
    return !hasActiveQuestion.value;
  });

  const isAllStepCompleted = computed(() => {
    return (
      isDefaultCompleted.value &&
      isExcelCompleted.value &&
      isQuestionCompleted.value
    );
  });

  const setDefaultInfo = (newIsEditing) => {
    isDefaultCompleted.value = newIsEditing === false;
  };

  const setExcelInfo = (newExcelInfo) => {
    isExcelCompleted.value = newExcelInfo?.length > 0;
  };

  return {
    isAllStepCompleted,
    isDefaultCompleted,
    isExcelCompleted,
    isQuestionCompleted,
    setDefaultInfo,
    setExcelInfo,
  };
});

// 투표 메세지
export const useVoteMessageStore = defineStore('voteMessage', () => {
  const voteUuid = ref('');
  const smsSendCount = ref(0);
  const smsSendLimit = ref(0);
  const voteDateTime = ref({ openTime: '', closeTime: '' });

  const setVoteMessageInfo = ({
    voteUuid: newVoteUuid,
    smsSendCount: newSmsSendCount,
    smsSendLimit: newSmsSendLimit,
    voteDateTime: newVoteDateTime,
  }) => {
    voteUuid.value = newVoteUuid;
    smsSendCount.value = newSmsSendCount;
    smsSendLimit.value = newSmsSendLimit;
    voteDateTime.value = newVoteDateTime;
  };

  return {
    voteUuid,
    smsSendCount,
    smsSendLimit,
    voteDateTime,
    setVoteMessageInfo,
  };
});
