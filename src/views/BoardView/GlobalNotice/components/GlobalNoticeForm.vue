<script setup>
  import LabelBase from '@components/common/LabelBase.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import GlobalNoticeApartmentSection from '@views/BoardView/GlobalNotice/components/GlobalNoticeApartmentSection.vue';
  import GlobalNoticeBasicSection from '@views/BoardView/GlobalNotice/components/GlobalNoticeBasicSection.vue';
  import GlobalNoticeContentSection from '@views/BoardView/GlobalNotice/components/GlobalNoticeContentSection.vue';
  import GlobalNoticeFileSection from '@views/BoardView/GlobalNotice/components/GlobalNoticeFileSection.vue';
  import GlobalNoticeFormActions from '@views/BoardView/GlobalNotice/components/GlobalNoticeFormActions.vue';
  import ThumbnailImageUpload from '@views/BoardView/GlobalNotice/components/ThumbnailImageUpload.vue';
  import { computed } from 'vue';

  import { useGlobalNoticeForm } from '@/lib/composables/boardGlobalNotice/useGlobalNoticeForm.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';

  const props = defineProps({
    mode: {
      type: String,
      required: true,
      validator: (value) => ['create', 'edit'].includes(value),
    },
    // eslint-disable-next-line vue/no-unused-properties
    initialData: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isPatchGlobalNoticeSuccess: {
      type: Boolean,
      default: false,
    },
    isPostGlobalNoticeSuccess: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['submit', 'cancel']);

  const {
    formValuesReactive,
    selectedFilesRef,
    existingFilesRef,
    uploadingFilesRef,
    isBoardFilePending,
    errors,
    handleFileChange,
    handleRemoveNewFile,
    handleDeleteExistingFile,
    handleUploadedImages,
    onSubmit,
    hasChanges,
  } = useGlobalNoticeForm(props, emit);

  const finalHasChanges = computed(() => {
    // 수정 모드: 수정 성공 시 false
    if (props.mode === 'edit' && props.isPatchGlobalNoticeSuccess) {
      return false;
    }
    // 등록 모드: 등록 성공 시 false
    if (props.mode === 'create' && props.isPostGlobalNoticeSuccess) {
      return false;
    }
    return hasChanges.value;
  });

  useUnsavedChangesGuard([finalHasChanges]);
</script>

<template>
  <!-- 수정 모드일 때 로딩 스켈레톤 표시 -->
  <div v-if="loading && mode === 'edit'">
    <SkeletonBar v-for="i in 6" :key="i" class="mb-4" />
  </div>
  <form
    v-else
    id="globalNoticeForm"
    class="flex flex-col gap-5"
    @submit="onSubmit"
  >
    <!-- 기본 섹션: 중요 여부 + 제목 -->
    <GlobalNoticeBasicSection :errors="errors" />

    <!-- 내용 섹션: 에디터 -->
    <GlobalNoticeContentSection
      :content="formValuesReactive?.content"
      :errors="errors"
      @update:uploaded-images="handleUploadedImages"
    />

    <!-- 아파트 단지 선택 섹선  -->
    <GlobalNoticeApartmentSection :errors="errors" />

    <!-- 썸네일 이미지 섹션 - 입주민 공지가 아닐 때만 표시 -->
    <LabelBase
      v-if="!formValuesReactive?.apartmantNoticeType?.includes('RESIDENT')"
      label-text="썸네일 이미지 (선택)"
      label-for=""
      class="gap-4"
    >
      <div
        class="rounded-lg border border-defaults-primary-border-primary bg-defaults-primary-background-mono p-5 xl:max-w-[1024px]"
      >
        <h3
          class="mb-4 text-defaults-secondary-text-secondary pretendard-16Medium"
        >
          썸네일 이미지
        </h3>
        <!-- formValuesReactive.thumbnailImage -->
        <ThumbnailImageUpload
          name="thumbnailImage"
          :disabled="loading"
          :errors="errors"
        />
      </div>
    </LabelBase>

    <!-- 파일 섹션: 파일 업로드 -->
    <GlobalNoticeFileSection
      :mode="mode"
      :selected-files="selectedFilesRef"
      :existing-files="existingFilesRef"
      :uploading-files="uploadingFilesRef"
      :is-upload-loading="isBoardFilePending"
      :errors="errors"
      :disabled="loading"
      @file-change="handleFileChange"
      @remove-new-file="handleRemoveNewFile"
      @delete-existing-file="handleDeleteExistingFile"
    />

    <!-- 폼 액션: 제출/취소 버튼 -->
    <GlobalNoticeFormActions :mode="mode" :loading="loading" />
  </form>
</template>
