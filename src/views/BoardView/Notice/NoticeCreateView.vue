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
  import usePostNoticePost from '@/lib/queries/boardNotice/usePostNoticePost.js';
  import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
  import { noticeFormCreationSchema } from '@/schemas/board.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { navigateTo } = useNavigate();
  const editorContentTypeRef = ref('delta');
  const uploadedImagesRef = ref([]);

  // 파일 업로드 (유효성 검사 + 서버 업로드 포함, PDF만 허용)
  const {
    selectedFilesRef,
    uploadingFilesRef,
    canAddMoreFiles,
    allFileObjects,
    isBoardFilePending,
    handleFileChange,
    handleRemoveNewFile,
  } = useFileUpload(5, ['pdf']);

  const initialFormValues = {
    noticeType: 'GENERAL',
    categoryUuid: '',
    pushFlag: true,
    title: '',
    content: null,
  };

  const { errors, handleSubmit, defineField, values } = useForm({
    validationSchema: toTypedSchema(noticeFormCreationSchema),
    initialValues: initialFormValues,
  });

  const [noticeType] = defineField('noticeType');
  const [categoryUuid] = defineField('categoryUuid');
  const [pushFlag] = defineField('pushFlag');
  const [title] = defineField('title');
  const { value: content, meta: contentMeta } = useField('content');

  const { aptNoticeCategoryList, isAptNoticeCategoryListLoading } =
    useGetNoticeCategoryList();

  const {
    createNoticeMutationAsync,
    isCreateNoticeLoading,
    isCreateNoticeSuccess,
  } = usePostNoticePost(userInfo.aptUuid);

  // 등록 성공 시 페이지 이동 처리
  watch(isCreateNoticeSuccess, (isSuccess) => {
    if (isSuccess) {
      navigateTo('/board/notice');
    }
  });

  const onSubmit = handleSubmit((formValues) => {
    const processedData = {
      ...formValues,
      uploadFile: [...allFileObjects.value],
      imageFileUuidList: [...uploadedImagesRef.value],
      content:
        editorContentTypeRef.value === 'delta'
          ? JSON.stringify(formValues.content)
          : formValues.content,
    };

    swalConfirmModal({
      text: '공지사항을 등록하시겠습니까?',
      callback: () => createNoticeMutationAsync(processedData),
    });
  });

  // 에디터 내용 변경 시 현재 존재하는 이미지 UUID만 추출
  const extractImageUuidsFromEditor = (editorValue) => {
    if (!editorValue?.ops) return;

    uploadedImagesRef.value = editorValue.ops
      .flatMap((item) => item.insert)
      .filter((item) => item?.customImage)
      .map((item) => item.customImage.uuid);
  };

  // QuillEditor 빈 content 체크 (null 또는 { ops: [{ insert: '\n' }] })
  const isEmptyContent = (contentVal) => {
    if (contentVal === null || contentVal === undefined) return true;
    if (contentVal?.ops?.length === 1 && contentVal.ops[0]?.insert === '\n')
      return true;
    return false;
  };

  const hasChanges = computed(() => {
    const currentFormValues = _.pick(values, _.keys(initialFormValues));

    // content 제외하고 비교
    const currentWithoutContent = _.omit(currentFormValues, 'content');
    const initialWithoutContent = _.omit(initialFormValues, 'content');
    const hasFormChanges = !_.isEqual(
      currentWithoutContent,
      initialWithoutContent,
    );

    // content는 별도로 비교 (빈 상태 체크)
    const hasContentChanges = !isEmptyContent(currentFormValues.content);

    const hasFileChanges = selectedFilesRef.value.length > 0;
    const hasImageChanges = uploadedImagesRef.value.length > 0;

    return (
      hasFormChanges || hasContentChanges || hasFileChanges || hasImageChanges
    );
  });

  const finalHasChanges = computed(() => {
    if (isCreateNoticeSuccess.value) return false;
    return hasChanges.value;
  });

  // 작성 취소 시 업로드 된 이미지 전체 삭제
  useUnsavedChangesGuard([finalHasChanges]);
</script>

<template>
  <div class="h-full w-full">
    <ButtonBack />
    <div class="flex justify-between">
      <PageTitleBase title="공지사항 등록하기" />
    </div>
    <section>
      <form id="form" class="flex flex-col gap-5" @submit="onSubmit">
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
            v-model="content"
            :content-type="editorContentTypeRef"
            :editor-domain="BOARD_EDITOR_CONTENT_TYPE.NOTICE"
            @update:model-value="extractImageUuidsFromEditor"
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
          <!-- 업로드 완료된 파일 목록 -->
          <ul v-if="selectedFilesRef.length > 0" class="my-4 w-1/2 space-y-2">
            <li
              v-for="(file, index) in selectedFilesRef"
              :key="file.uuid || index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center justify-start">
                <span class="whitespace-nowrap text-muted-foreground-100"
                  >첨부파일 {{ index + 1 }}</span
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
        <div>
          <LabelBase
            label-for="pushFlag"
            label-text="푸시 알림 전송 여부"
            class="gap-4"
            asterisk
          >
            <ul class="flex gap-4">
              <li class="flex gap-2 rounded-md border p-3">
                <input
                  id="pushFlagY"
                  v-model="pushFlag"
                  name="pushFlag"
                  type="radio"
                  :value="true"
                />
                <LabelBase label-for="pushFlagY" label-text="푸시 알림 전송" />
              </li>
              <li class="flex gap-2 rounded-md border p-3">
                <input
                  id="pushFlagN"
                  v-model="pushFlag"
                  name="pushFlag"
                  type="radio"
                  :value="false"
                />
                <LabelBase
                  label-for="pushFlagN"
                  label-text="푸시 알림 미전송"
                />
              </li>
            </ul>
          </LabelBase>
          <TextError v-if="errors.pushFlag">{{ errors.pushFlag }}</TextError>
        </div>

        <div class="flex justify-end">
          <ButtonBase
            form="form"
            type="submit"
            color="primary"
            custom-class="px-3 py-2"
            :disabled="isCreateNoticeLoading"
          >
            <div v-if="isCreateNoticeLoading" class="flex items-center gap-2">
              <span>등록중..</span>
              <SpinnerWhiteView />
            </div>
            <div v-else class="w-full" title="등록하기">등록하기</div>
          </ButtonBase>
        </div>
      </form>
    </section>
  </div>
</template>
