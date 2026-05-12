<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';

  import useGetSurveyDetailDefaultSubjectiveList from '@/lib/queries/survey/useGetSurveyDetailDefaultSubjectiveList.js';

  const props = defineProps({
    questionUuid: {
      type: String,
      required: true,
      default: '',
    },
  });

  const emits = defineEmits(['close']);

  const {
    surveyDetailDefaultSubjectiveList,
    isSurveyDetailDefaultSubjectiveListLoading,
  } = useGetSurveyDetailDefaultSubjectiveList({
    questionUuid: props.questionUuid,
  });

  const closeModal = () => {
    emits('close');
  };
</script>

<template>
  <ModalBaseNew>
    <div
      class="h-auto max-h-[70vh] min-h-[40vh] w-auto min-w-[40vw] max-w-[40vw] overflow-auto"
    >
      <div
        class="flex items-center justify-between gap-6 border-b border-defaults-primary-border-primary p-4"
      >
        <div class="pretendard-18SemiBold">서술형 응답 전체보기</div>
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          @click="closeModal"
        >
          닫기
        </ButtonBase>
      </div>
      <div
        class="flex h-[calc(100%-106px)] w-full flex-col gap-2 overflow-auto p-3"
      >
        <template v-if="isSurveyDetailDefaultSubjectiveListLoading">
          <SkeletonBase v-for="item in 5" :key="item" class="h-12 rounded-md" />
        </template>
        <template v-else>
          <span class="p-2 text-brand-default-text-brand pretendard-14SemiBold">
            응답 {{ surveyDetailDefaultSubjectiveList?.length || 0 }}개
          </span>
          <ul class="flex w-full flex-col gap-2">
            <li
              v-for="(
                response, responseIndex
              ) in surveyDetailDefaultSubjectiveList"
              :key="responseIndex"
              class="w-full break-words border-b border-dashed bg-white p-2 hover:bg-gray-50"
            >
              {{ response }}
            </li>
          </ul>
          <div
            v-if="
              !surveyDetailDefaultSubjectiveList ||
              surveyDetailDefaultSubjectiveList.length === 0
            "
            class="flex h-full items-center justify-center text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            응답이 없습니다.
          </div>
        </template>
      </div>
    </div>
  </ModalBaseNew>
</template>
