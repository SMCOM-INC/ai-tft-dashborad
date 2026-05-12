<script setup>
  import IconTrash from '@assets/icons/icon-trash-filled-black.svg';
  import IconUpload from '@assets/icons/icon-upload-line-black.svg';
  import ButtonBack from '@components/common/ButtonBack.vue';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import PageTitleBase from '@components/common/PageTitleBase.vue';
  import QuillEditor from '@components/common/QuillEditor.vue';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import _ from 'lodash';
  import { useField, useForm } from 'vee-validate';
  import { computed, ref, watch } from 'vue';


  import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
  import { useFileUpload } from '@/lib/composables/common/useFileUpload.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';
  import useUnsavedChangesGuard from '@/lib/composables/common/useUnsavedChangesGuard.js';
  import useGetNoticeCategoryList from '@/lib/queries/boardNotice/useGetNoticeCategoryList.js';
  import useGetNoticeDetail from '@/lib/queries/boardNotice/useGetNoticeDetail.js';
  import usePatchNoticePost from '@/lib/queries/boardNotice/usePatchNoticePost.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';
  import parseEditorContent from '@/lib/utils/parseEditorContent.js';
  import { noticeFormUpdateSchema } from '@/schemas/board.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { getParams, navigateTo } = useNavigate();

  const { userInfo } = useUserInfoStore();
  const { aptUuid } = userInfo;

  const noticeUuid = getParams().uuid;
  const editorContentsRef = ref(''); // QuillEditor용 별도 ref
  const uploadedImagesRef = ref([]);
  const isDataLoaded = ref(false);
  const deletedFileUuidsRef = ref([]); // 삭제된 기존 파일 UUID 추적

  // 파일 업로드 (유효성 검사 + 서버 업로드 포함, PDF만 허용)
  const {
    selectedFilesRef,
    existingFilesRef,
    uploadingFilesRef,
    canAddMoreFiles,
    allFileObjects,
    isBoardFilePending,
    handleFileChange,
    handleRemoveNewFile,
    handleDeleteExistingFile: baseHandleDeleteExistingFile,
    setExistingFiles,
  } = useFileUpload(5, ['pdf']);

  // 기존 파일 삭제 시 UUID 추적하는 래퍼 함수
  const handleDeleteExistingFile = (fileUuid) => {
    if (fileUuid) {
      deletedFileUuidsRef.value.push(fileUuid);
    }
    baseHandleDeleteExistingFile(fileUuid);
  };

  const { noticeDetail, isNoticeDetailLoading } = useGetNoticeDetail(
    aptUuid,
    noticeUuid,
  );

  const { aptNoticeCategoryList, isAptNoticeCategoryListLoading } =
    useGetNoticeCategoryList();

  const {
    updateNoticeMutationAsync,
    isUpdateNoticeLoading,
    isUpdateNoticeSuccess,
  } = usePatchNoticePost(aptUuid);

  const initialFormValuesRef = ref({
    noticeType: 'GENERAL',
    categoryUuid: '',
    title: '',
    content: null,
  });

  const { errors, handleSubmit, defineField, values, resetForm } = useForm({
    validationSchema: toTypedSchema(noticeFormUpdateSchema),
    initialValues: initialFormValuesRef.value,
  });

  const [noticeType] = defineField('noticeType');
  const [categoryUuid] = defineField('categoryUuid');
  const [title] = defineField('title');
  const { setValue: setContentValue, meta: contentMeta } = useField('content');

  // 에디터 내용 변경 시 현재 존재하는 이미지 UUID만 추출
  const extractImageUuidsFromEditor = (editorValue) => {
    if (!editorValue?.ops) return;

    uploadedImagesRef.value = editorValue.ops
      .flatMap((item) => item.insert)
      .filter((item) => item?.customImage)
      .map((item) => item.customImage.uuid);
  };

  // QuillEditor 값 변경 핸들러
  const updateEditorValue = (editorValue) => {
    setContentValue(editorValue);
    extractImageUuidsFromEditor(editorValue);
  };

  // 수정 성공 시 페이지 이동 처리
  watch(isUpdateNoticeSuccess, (isSuccess) => {
    if (isSuccess) {
      navigateTo('/board/notice');
    }
  });

  const onSubmit = handleSubmit((formValues) => {
    const processedData = {
      ...formValues,
      content: JSON.stringify(formValues.content),
    };

    // 새 파일이 있으면 추가
    if (allFileObjects.value.length > 0) {
      processedData.uploadFile = [...allFileObjects.value];
    }

    // 에디터 이미지가 있으면 추가
    if (uploadedImagesRef.value.length > 0) {
      processedData.imageFileUuidList = [...uploadedImagesRef.value];
    }

    // 삭제된 기존 파일이 있으면 추가
    if (deletedFileUuidsRef.value.length > 0) {
      processedData.deleteFileUuidList = [...deletedFileUuidsRef.value];
    }

    swalConfirmModal({
      text: '공지사항을 수정하시겠습니까?',
      callback: () =>
        updateNoticeMutationAsync({ noticeUuid, data: processedData }),
    });
  });

  const hasChanges = computed(() => {
    if (!isDataLoaded.value) return false;

    // const localSettingInitialValues = initialFormValuesRef.value;
    const currentFormValues = _.pick(
      values,
      _.keys(initialFormValuesRef.value),
    );

    // content 제외하고 비교
    const currentWithoutContent = _.omit(currentFormValues, 'content');
    const initialWithoutContent = _.omit(initialFormValuesRef.value, 'content');
    const hasFormChanges = !_.isEqual(
      currentWithoutContent,
      initialWithoutContent,
    );

    // content는 ops 배열만 비교 (형태 차이 무시)
    const currentOps = currentFormValues.content?.ops || [];
    const initialOps =
      initialFormValuesRef.value.content?.ops ||
      initialFormValuesRef.value.content ||
      [];
    const hasContentChanges = !_.isEqual(currentOps, initialOps);

    // 파일 변경 여부
    const hasFileChanges =
      selectedFilesRef.value.length > 0 || deletedFileUuidsRef.value.length > 0;

    return hasFormChanges || hasContentChanges || hasFileChanges;
  });

  const finalHasChanges = computed(() => {
    if (isUpdateNoticeSuccess.value) return false;
    return hasChanges.value;
  });

  // 기존 데이터 로드 시 폼 초기화
  watch(
    noticeDetail,
    (newNoticeDetail) => {
      if (!newNoticeDetail) return;

      // content 파싱 - QuillEditor용 별도 ref에 설정
      const parsedContent = parseEditorContent(newNoticeDetail.content);
      editorContentsRef.value = parsedContent;

      // 초기값 설정 (content는 QuillEditor에서 @update:model-value로 설정됨)
      const loadedValues = {
        title: decodeUrl(newNoticeDetail.title),
        noticeType: newNoticeDetail.noticeType || 'GENERAL',
        categoryUuid: newNoticeDetail.categoryUuid,
        content: parsedContent,
      };

      // initialFormValuesRef 업데이트 (변경 감지용)
      initialFormValuesRef.value = _.cloneDeep(loadedValues);

      // 폼 리셋
      resetForm({ values: loadedValues });

      // 기존 파일 설정
      if (newNoticeDetail.fileList) {
        const files = newNoticeDetail.fileList.map((file) => ({
          name: decodeUrl(file.fileName),
          fileUrl: file.fileUrl,
          fileUuid: file.fileUuid,
        }));
        setExistingFiles(files);
      }

      isDataLoaded.value = true;
    },
    { immediate: true },
  );

  useUnsavedChangesGuard([finalHasChanges]);
</script>

<template>
  <div class="h-full w-full">
    <ButtonBack />
    <div class="flex justify-between">
      <PageTitleBase title="공지사항 수정하기" />
    </div>
    <section>
      <div v-if="isNoticeDetailLoading">
        <SkeletonBar v-for="i in 4" :key="i" />
      </div>
      <form v-else id="form" class="flex flex-col gap-5" @submit="onSubmit">
        <div>
          <LabelBase
            label-for="state"
            label-text="중요 여부"
            class="gap-4"
            asterisk
          >
            <ul class="flex gap-4">
              <li class="flex gap-2 rounded-md border p-3">
                <input
                  id="general"
                  v-model="noticeType"
                  name="noticeType"
                  type="radio"
                  value="GENERAL"
                />
                <LabelBase label-for="general" label-text="일반" />
              </li>
              <li class="flex gap-2 rounded-md border p-3">
                <input
                  id="required"
                  v-model="noticeType"
                  name="noticeType"
                  type="radio"
                  value="IMPORTANT"
                />
                <LabelBase
                  label-for="required"
                  label-text="필독"
                  title="상단 고정"
                />
              </li>
            </ul>
          </LabelBase>
          <TextError v-if="errors.noticeType">{{
            errors.noticeType
          }}</TextError>
        </div>
        <div>
          <LabelBase
            label-for="categoryUuid"
            label-text="카테고리"
            class="gap-4"
            asterisk
          >
            <span v-if="isAptNoticeCategoryListLoading" class="w-64">
              <SkeletonBar />
            </span>
            <select
              v-else
              id="categoryUuid"
              v-model="categoryUuid"
              class="icon-chevron-down select-background-position-custom z-10 h-10 w-64 cursor-pointer rounded-md border bg-right bg-no-repeat py-2 pl-3 pr-[38px]"
              :class="
                errors?.categoryUuid && categoryUuid === ''
                  ? 'border-red-500'
                  : 'border-dark-100'
              "
            >
              <option value="">
                {{
                  !aptNoticeCategoryList
                    ? '등록된 카테고리가 없습니다.'
                    : '카테고리를 선택해주세요.'
                }}
              </option>
              <option
                v-for="option in aptNoticeCategoryList"
                :key="option.uuid"
                :value="option.uuid"
              >
                {{ option.category }}
              </option>
            </select>
          </LabelBase>
          <TextError v-if="errors.categoryUuid && categoryUuid === ''">
            {{ errors.categoryUuid }}
          </TextError>
        </div>
        <div>
          <LabelBase
            label-for="title"
            label-text="공지사항 제목"
            asterisk
            class="gap-4"
          >
            <input
              id="title"
              v-model="title"
              type="text"
              name="title"
              placeholder="제목을 입력해주세요."
              class="w-full rounded-md border px-3 py-2 xl:max-w-[1024px]"
            />
          </LabelBase>
          <TextError v-if="errors.title">{{ errors.title }}</TextError>
        </div>
        <div>
          <span
            class="block select-none whitespace-nowrap pb-4 text-sm font-medium leading-none"
            >공지사항 본문 *</span
          >
          <QuillEditor
            v-model="editorContentsRef"
            content-type="delta"
            :editor-domain="BOARD_EDITOR_CONTENT_TYPE.NOTICE"
            @update:model-value="updateEditorValue"
          />
          <TextError v-if="contentMeta.touched && errors.content">{{
            errors.content
          }}</TextError>
        </div>
        <div>
          <LabelBase
            label-for="uploadFile"
            label-text="첨부파일 (선택)"
            class="gap-4"
          >
            <input
              id="uploadFile"
              type="file"
              name="uploadFile"
              accept=".pdf"
              multiple
              class="hidden"
              :disabled="!canAddMoreFiles || isBoardFilePending"
              @change="handleFileChange"
            />
            <label
              for="uploadFile"
              class="flex h-16 w-1/2 cursor-pointer items-center justify-center gap-1 rounded-md border px-3 py-2 text-muted-foreground-100"
            >
              <IconUpload class="h-5 w-5" />
              파일을 선택해주세요.
            </label>
            <p class="text-xs leading-5 text-muted-foreground-100">
              파일당 최대 10MB까지의 PDF 파일만 업로드 가능합니다 (최대 5개).
            </p>
          </LabelBase>
          <TextError v-if="errors.uploadFile" class="mt-1">{{
            errors.uploadFile
          }}</TextError>
          <!-- 기존 파일 목록 -->
          <ul v-if="existingFilesRef.length > 0" class="my-4 w-1/2 space-y-2">
            <li
              v-for="(file, index) in existingFilesRef"
              :key="file.fileUuid || index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center justify-start">
                <span class="whitespace-nowrap text-muted-foreground-100"
                  >기존 첨부파일 {{ index + 1 }}</span
                >
                <a
                  :href="file.fileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mx-4 cursor-pointer pretendard-link hover:underline"
                  >{{ file.name }}</a
                >
              </div>
              <button
                type="button"
                class="text-red-500"
                @click="handleDeleteExistingFile(file.fileUuid)"
              >
                <IconTrash class="h-5 w-5" />
              </button>
            </li>
          </ul>
          <!-- 업로드 중인 파일 표시 -->
          <ul v-if="uploadingFilesRef.length > 0" class="my-4 w-1/2 space-y-2">
            <li
              v-for="fileName in uploadingFilesRef"
              :key="fileName"
              class="flex items-center justify-between text-muted-foreground-100"
            >
              <div class="flex items-center gap-2">
                <SpinnerWhiteView class="h-4 w-4" />
                <span>{{ fileName }} 업로드 중...</span>
              </div>
            </li>
          </ul>
          <!-- 업로드 완료된 신규 파일 목록 -->
          <ul v-if="selectedFilesRef.length > 0" class="my-4 w-1/2 space-y-2">
            <li
              v-for="(file, index) in selectedFilesRef"
              :key="file.uuid || index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center justify-start">
                <span class="whitespace-nowrap text-muted-foreground-100"
                  >신규 첨부파일 {{ index + 1 }}</span
                >
                <span class="mx-4">{{ file.name }} ({{ file.size }})</span>
              </div>
              <button
                type="button"
                class="text-red-500"
                @click="handleRemoveNewFile(index)"
              >
                <IconTrash class="h-5 w-5" />
              </button>
            </li>
          </ul>
        </div>
        <div class="flex justify-end">
          <ButtonBase
            form="form"
            type="submit"
            color="primary"
            custom-class="px-3 py-2"
            :disabled="isUpdateNoticeLoading"
          >
            <div v-if="isUpdateNoticeLoading" class="flex items-center gap-2">
              <span>수정중..</span>
              <SpinnerWhiteView />
            </div>
            <div v-else class="w-full" title="수정하기">수정하기</div>
          </ButtonBase>
        </div>
      </form>
    </section>
  </div>
</template>
