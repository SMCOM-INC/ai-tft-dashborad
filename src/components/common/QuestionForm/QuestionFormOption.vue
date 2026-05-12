<script setup>
  import IconChevron from '@assets/icons/icon-chevron-left-gray.svg';
  import IconCloseRed from '@assets/icons/icon-close-red.svg';
  import IconPlusGray from '@assets/icons/icon-plus-line-gray.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import QuestionFormOptionImage from '@components/common/QuestionForm/QuestionFormOptionImage.vue';
  import { useIsMutating } from '@tanstack/vue-query';
  import { useFieldArray } from 'vee-validate';
  import { computed } from 'vue';


  import { QUESTION_TYPE } from '@/constants/common.js';
  import useQuestionForm from '@/lib/composables/common/useQuestionForm.js';
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

  const { fields: questionFields } = useFieldArray(`questionForm`);

  const questionIndexRef = computed(() => props.questionIndex);

  const {
    optionsFields,
    hasQuestionEtc,
    changeOrder,
    deleteOption,
    addOption,
    addEtcOption,
    checkDownButtonDisabled,
    pushOption,
  } = useQuestionForm(questionIndexRef);

  const isQuestionDisabled = computed(() => {
    return questionFormDisabledStore.getIsQuestionDisabled(
      questionFields.value[props.questionIndex].value.id,
    );
  });
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(option, optionIndex) in optionsFields"
      :key="option.id"
      class="flex items-start gap-8"
    >
      <!-- 옵션 번호 -->
      <span
        class="whitespace-nowrap pt-2 text-defaults-secondary-text-secondary pretendard-16SemiBold"
      >
        {{ optionIndex + 1 }}번
      </span>
      <div class="flex w-full flex-col gap-3">
        <!-- 옵션 입력 필드 -->
        <input
          v-if="option.value.etcFlag"
          v-model="option.value.content"
          :name="`questionForm[${questionIndex}].value.options[${optionIndex}].content`"
          type="text"
          autocomplete="off"
          :class="`w-full rounded-md border border-defaults-primary-border-primary px-4 py-3 pretendard-16Regular`"
          disabled
        />
        <input
          v-else
          v-model="option.value.content"
          :name="`questionForm[${questionIndex}].value.options[${optionIndex}].content`"
          type="text"
          placeholder="옵션을 입력해주세요"
          autocomplete="off"
          :class="`w-full rounded-md border px-4 py-3 pretendard-16Regular ${errors[`questionForm[${questionIndex}].options[${optionIndex}].content`] ? 'border-destructive-100' : 'border-defaults-primary-border-primary'}`"
          :disabled="isQuestionDisabled"
        />

        <QuestionFormOptionImage
          v-if="questionFormStore.hasImage"
          :question-index="questionIndex"
          :option-index="optionIndex"
        />
      </div>

      <!-- 순서변경 및 삭제 버튼 -->
      <div
        v-if="
          questionFormStore.canMultiple &&
          !isQuestionDisabled &&
          questionFields[questionIndex].value.questionType !==
            QUESTION_TYPE.SUBJECTIVE
        "
        class="flex flex-col gap-1.5"
      >
        <ButtonBase
          v-if="!option.value.etcFlag"
          type="button"
          color="secondary-fill"
          size="sm"
          :disabled="optionIndex === 0"
          class="flex h-fit items-center justify-between gap-2"
          @click="changeOrder(optionIndex, 'up')"
        >
          <span class="w-8">위로</span>
          <IconChevron class="h-3 w-3 rotate-90" />
        </ButtonBase>
        <ButtonBase
          v-if="!option.value.etcFlag"
          type="button"
          color="secondary-fill"
          size="sm"
          :disabled="checkDownButtonDisabled(optionIndex)"
          class="flex h-fit items-center justify-between gap-2"
          @click="changeOrder(optionIndex, 'down')"
        >
          <span class="w-8">아래로</span>
          <IconChevron class="h-3 w-3 -rotate-90" />
        </ButtonBase>
        <ButtonBase
          type="button"
          color="destructive-outlined"
          size="sm"
          class="flex h-fit items-center justify-between gap-2"
          :disabled="optionsFields.length <= 2 || isMutating > 0"
          @click="deleteOption(optionIndex)"
        >
          <span class="w-8">삭제</span>
          <IconCloseRed class="h-3 w-3" />
        </ButtonBase>
      </div>
    </div>
    <!-- 옵션 추가 버튼 -->
    <div
      v-if="
        questionFormStore.canMultiple &&
        !isQuestionDisabled &&
        questionFields[questionIndex].value.questionType !==
          QUESTION_TYPE.SUBJECTIVE
      "
      class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2"
    >
      <button type="button" class="flex items-center gap-2" @click="addOption">
        <IconPlusGray />
        <span class="text-defaults-secondary-text-secondary">옵션 추가</span>
      </button>
      <template v-if="questionFormStore.hasEtcOption && !hasQuestionEtc">
        또는
        <button
          type="button"
          class="flex gap-2 text-brand-default-text-brand underline underline-offset-1"
          @click="pushOption(addEtcOption())"
        >
          '기타' 추가
        </button>
      </template>
    </div>
  </div>
</template>
