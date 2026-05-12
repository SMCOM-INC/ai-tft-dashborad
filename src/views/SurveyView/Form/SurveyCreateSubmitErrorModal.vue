<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import { computed } from 'vue';

  import { useSurveySubmitStore } from '@/stores/survey.js';

  const props = defineProps({
    errorType: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const surveyStore = useSurveySubmitStore();

  const errors = computed(() => {
    const result = [];
    if (!surveyStore.isDefaultCompleted) result.push('기본정보');
    if (!surveyStore.isExcelCompleted) result.push('참여자 업로드');
    if (!surveyStore.isQuestionCompleted) result.push('질문 항목');
    return result;
  });

  const mainMessage = computed(() => {
    if (props.errorType === 'requiredQuestionMissing') {
      return '최소 1개 이상의 질문은 필수로 설정되어야 합니다.';
    }
    if (props.errorType === 'incompleteSteps') {
      return `${errors.value.join(', ')}를(을) 완료해주세요.`;
    }
    return '';
  });

  const subMessage = computed(() => {
    if (props.errorType === 'requiredQuestionMissing') {
      return '질문 항목에서 필수 여부를 설정해주세요.';
    }
    if (props.errorType === 'incompleteSteps') {
      return '작성중인 내용이 있어 완성이 불가합니다.';
    }
    return '';
  });

  const closeGroupModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div class="min-w-[512px] p-6">
      <div class="mb-4 flex flex-col gap-2">
        <p class="pretendard-18Medium">
          {{ mainMessage }}
        </p>
        <p class="text-defaults-secondary-text-secondary pretendard-14Regular">
          {{ subMessage }}
        </p>
      </div>
      <div class="flex justify-end">
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="md"
          class="items-end"
          @click="closeGroupModal"
        >
          확인
        </ButtonBase>
      </div>
    </div>
  </ModalBaseNew>
</template>
