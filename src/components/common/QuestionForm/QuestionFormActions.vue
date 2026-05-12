<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import { useIsMutating } from '@tanstack/vue-query';
  import { useFieldArray } from 'vee-validate';
  import { computed } from 'vue';

  import {
    useQuestionFormDisabledStore,
    useQuestionFormStore,
  } from '@/stores/questionForm.js';

  const props = defineProps({
    questionIndex: {
      type: Number,
      required: true,
    },
    errors: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const questionFormStore = useQuestionFormStore();
  const questionFormDisabledStore = useQuestionFormDisabledStore();

  const isMutating = useIsMutating();

  const { remove, fields } = useFieldArray('questionForm');

  // 질문 아이디
  const questionId = computed(() => {
    return fields.value[props.questionIndex].value.id;
  });

  // 질문 disabled 여부
  const isQuestionDisabled = computed(() => {
    return questionFormDisabledStore.getIsQuestionDisabled(questionId.value);
  });

  const currentQuestionHasErrors = computed(() => {
    const currentPrefix = `questionForm[${props.questionIndex}]`;
    return Object.keys(props.errors).some((key) =>
      key.startsWith(currentPrefix),
    );
  });

  // 질문 저장
  const saveQuestion = () => {
    if (currentQuestionHasErrors.value) {
      return;
    }

    questionFormStore.formActions.saveQuestion({
      questionData: fields.value[props.questionIndex].value,
    });
  };

  // 작성 취소
  const cancelQuestion = async () => {
    questionFormDisabledStore.clearActiveQuestion();

    remove(props.questionIndex);
  };

  // 질문 수정
  const editQuestion = () => {
    questionFormDisabledStore.setActiveQuestion(questionId.value);
  };

  // 수정 완료
  const completedEdit = () => {
    if (currentQuestionHasErrors.value) {
      return;
    }

    questionFormStore.formActions.editQuestion({
      questionData: fields.value[props.questionIndex].value,
    });
  };

  // 질문삭제
  const deleteQuestion = async (questionIndex) => {
    if (typeof questionId.value === 'string') {
      questionFormStore.formActions.deleteQuestion({
        questionUuid: questionId.value,
      });
    }

    // 질문 아이템 삭제
    remove(questionIndex);
  };
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- 신규 질문인 경우 -->
    <template v-if="typeof questionId === 'number'">
      <ButtonBase
        key="save-question"
        type="button"
        color="primary"
        class="h-fit"
        :disabled="isMutating > 0"
        @click="saveQuestion"
      >
        질문 저장
      </ButtonBase>
      <ButtonBase
        v-if="fields.length > 1"
        key="cancel-question"
        type="button"
        color="secondary-fill"
        class="h-fit"
        :disabled="isMutating > 0"
        @click="cancelQuestion(questionIndex)"
      >
        작성 취소
      </ButtonBase>
    </template>
    <!-- 기존 질문인 경우 -->
    <template v-else>
      <ButtonBase
        v-if="!isQuestionDisabled"
        key="edit-complete"
        type="button"
        color="primary"
        class="h-fit"
        :disabled="isMutating > 0"
        @click="completedEdit"
      >
        수정 완료
      </ButtonBase>
      <ButtonBase
        v-else-if="!questionFormDisabledStore.hasActiveQuestion"
        key="edit-question"
        type="button"
        color="primary"
        class="h-fit"
        :disabled="questionFormDisabledStore.hasActiveQuestion"
        @click="editQuestion"
      >
        질문 수정
      </ButtonBase>
      <div v-else class="w-[82px]"></div>
      <ButtonBase
        v-if="fields.length > 1 && !questionFormDisabledStore.hasActiveQuestion"
        key="delete-question"
        type="button"
        color="destructive-100"
        :disabled="
          fields.length <= 1 ||
          questionFormDisabledStore.hasActiveQuestion ||
          isMutating > 0
        "
        class="h-fit"
        @click="deleteQuestion(questionIndex)"
      >
        질문 삭제
      </ButtonBase>
    </template>
  </div>
</template>
