import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { useQuestionFormDisabledStore } from '@/stores/questionForm.js';

// 설문 등록 - 이미지
export const useSurveyImageStore = defineStore('surveyImage', () => {
  // 기본 정보의 에디터에 등록된 이미지 UUID 리스트
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

// 설문 등록 - 제출
export const useSurveySubmitStore = defineStore('surveySubmit', () => {
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

// 설문 메세지
export const useSurveyMessageStore = defineStore('surveyMessage', () => {
  const surveyUuid = ref('');
  const smsSendCount = ref(0);
  const smsSendLimit = ref(0);
  const surveyDateTime = ref({ openTime: '', closeTime: '' });

  const setSurveyMessageInfo = ({
    surveyUuid: newSurveyUuid,
    smsSendCount: newSmsSendCount,
    smsSendLimit: newSmsSendLimit,
    surveyDateTime: newSurveyDateTime,
  }) => {
    surveyUuid.value = newSurveyUuid;
    smsSendCount.value = newSmsSendCount;
    smsSendLimit.value = newSmsSendLimit;
    surveyDateTime.value = newSurveyDateTime;
  };

  return {
    surveyUuid,
    smsSendCount,
    smsSendLimit,
    surveyDateTime,
    setSurveyMessageInfo,
  };
});
