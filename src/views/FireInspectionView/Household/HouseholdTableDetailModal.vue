<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import HouseholdTemplateDeleteModal from '@views/FireInspectionView/Household/InspectionTemplate/HouseholdTemplateDeleteModal.vue';
  import InspectionTemplateInfo from '@views/FireInspectionView/Household/InspectionTemplate/InspectionTemplateInfo.vue';
  import InspectionTemplateTable from '@views/FireInspectionView/Household/InspectionTemplate/InspectionTemplateTable.vue';
  import { computed, ref, watch } from 'vue';

  import { useFireInspectionTemplate } from '@/lib/composables/fireInspection/useFireInspectionTemplate.js';
  import useGetFireInspectionHouseholdDetail from '@/lib/queries/fireInspection/useGetFireInspectionHouseholdDetail.js';

  const props = defineProps({
    fireInspectionUuid: {
      type: String,
      required: true,
    },
    householdInfo: {
      type: Object,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const {
    submissionType,
    inspector,
    inspectorPhone,
    submissionDateTime,
    inspectionQuestions,

    setValues,
  } = useFireInspectionTemplate();

  // 세대 점검 상세 조회
  const fireInspectionUuidComputed = computed(() => props.fireInspectionUuid);
  const householdFireInspectionUuidComputed = computed(
    () => props.householdInfo.householdFireInspectionUuid,
  );

  const {
    fireInspectionHouseholdDetail,
    isFireInspectionHouseholdDetailLoading,
    fireInspectionHouseholdDetailError,
  } = useGetFireInspectionHouseholdDetail({
    fireInspectionUuid: fireInspectionUuidComputed,
    householdFireInspectionUuid: householdFireInspectionUuidComputed,
  });

  const modalType = ref(null);

  const closeModal = () => {
    emits('close');
  };

  const openDeleteConfirmModal = () => {
    modalType.value = 'deleteConfirm';
  };

  const closeDeleteConfirmModal = () => {
    modalType.value = null;
  };

  // 상세 데이터를 setValues로 설정
  watch(
    fireInspectionHouseholdDetail,
    (data) => {
      if (data) {
        const questionsMap = Object.fromEntries(
          data.questionAnswerList.map(({ questionId, answer }) => [
            questionId,
            answer,
          ]),
        );

        setValues({
          submissionType: data.submissionType,
          inspector: data.inspector,
          inspectorPhone: data.inspectorPhone,
          submissionDateTime: data.submissionDateTime.slice(0, 10),
          inspectionQuestions: questionsMap,
        });
      }
    },
    { immediate: true },
  );
</script>

<template>
  <ModalBaseNew>
    <div class="flex h-[840px] w-full min-w-[800px] flex-col">
      <header
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-18SemiBold">점검항목 상세보기</h1>
        <button type="button" @click="closeModal">
          <CloseIcon class="h-5 w-5" />
        </button>
      </header>

      <!-- 로딩 상태 -->
      <div
        v-if="isFireInspectionHouseholdDetailLoading"
        class="flex flex-1 flex-col space-y-6 overflow-y-auto px-6 py-6"
      >
        <div
          class="space-y-4 rounded border border-defaults-primary-border-primary p-6"
        >
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <SkeletonBase class="h-5 w-20 rounded" />
              <SkeletonBase class="h-10 w-full rounded" />
            </div>
            <div class="space-y-2">
              <SkeletonBase class="h-5 w-20 rounded" />
              <SkeletonBase class="h-10 w-full rounded" />
            </div>
            <div class="space-y-2">
              <SkeletonBase class="h-5 w-20 rounded" />
              <SkeletonBase class="h-10 w-full rounded" />
            </div>
            <div class="space-y-2">
              <SkeletonBase class="h-5 w-20 rounded" />
              <SkeletonBase class="h-10 w-full rounded" />
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <SkeletonBase class="h-7 w-24 rounded" />
          <div class="space-y-2">
            <SkeletonBase class="h-12 w-full rounded" />
            <SkeletonBase class="h-12 w-full rounded" />
            <SkeletonBase class="h-12 w-full rounded" />
            <SkeletonBase class="h-12 w-full rounded" />
            <SkeletonBase class="h-12 w-full rounded" />
          </div>
        </div>
      </div>

      <!-- 에러 상태 -->
      <div
        v-else-if="fireInspectionHouseholdDetailError"
        class="flex flex-1 flex-col items-center justify-center px-6 py-6"
      >
        <p
          class="mb-4 text-center text-defaults-secondary-text-secondary pretendard-16Regular"
        >
          점검 상세 정보를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>

      <!-- 데이터 로드 완료 -->
      <div
        v-else
        class="flex flex-1 flex-col space-y-6 overflow-y-auto px-6 py-6"
      >
        <InspectionTemplateInfo
          v-model:submission-type="submissionType"
          v-model:inspector="inspector"
          v-model:inspector-phone="inspectorPhone"
          v-model:submission-date-time="submissionDateTime"
          :household-info="householdInfo"
          :disabled="true"
        />

        <div class="space-y-3">
          <div class="flex items-end justify-between">
            <div>
              <h2 class="pretendard-18SemiBold">점검항목</h2>
            </div>
            <ButtonBase
              type="button"
              color="destructive"
              size="md"
              @click="openDeleteConfirmModal"
            >
              세대 항목 초기화
            </ButtonBase>
          </div>

          <InspectionTemplateTable
            v-model:inspection-questions="inspectionQuestions"
            :disabled="true"
          />
        </div>
      </div>

      <footer
        class="flex justify-end gap-2 px-6 py-4 shadow-[0_-2px_3px_0px_rgba(0,0,0,0.1)]"
      >
        <ButtonBase
          type="button"
          color="secondary"
          size="md"
          class="w-24"
          @click="closeModal"
        >
          닫기
        </ButtonBase>
      </footer>
    </div>
  </ModalBaseNew>

  <HouseholdTemplateDeleteModal
    v-if="modalType === 'deleteConfirm'"
    :fire-inspection-uuid="fireInspectionUuid"
    :household-fire-inspection-uuid="householdFireInspectionUuidComputed"
    @close="closeDeleteConfirmModal"
    @deleted="closeModal"
  />
</template>
