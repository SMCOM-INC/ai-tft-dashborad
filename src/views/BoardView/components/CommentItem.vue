<script setup>
  import IconArrowCornerDownRightGray from '@assets/icons/icon-arrowCorner-downRight-gray.svg';
  import IconClose from '@assets/icons/icon-close-black.svg';
  import IconImagePlus from '@assets/icons/icon-imagePlus-line-blue.svg';
  import WarningIcon from '@assets/icons/icon-warning-filled-red.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputBase from '@components/common/InputBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalImage from '@components/common/ModalImage.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import dayjs from 'dayjs';
  import 'dayjs/locale/ko';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { nextTick, ref, watch } from 'vue';

  import { useCommentImageUpload } from '@/lib/composables/useCommentImageUpload.js';
  import decodeUrlToParagraph from '@/lib/utils/decodeUriParagraph.js';
  import { formatDate } from '@/lib/utils/formatDate.js';
  import getFullImageUrl from '@/lib/utils/getFullImageUrl.js';
  import { validateCommentContent } from '@/lib/utils/validateCommentContent.js';

  const props = defineProps({
    comment: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    isParent: {
      type: Boolean,
      required: true,
    },
    queryStates: {
      type: Object,
      default: () => ({
        edit: { isPending: false, isError: false, error: '' },
        delete: { isPending: false, isError: false, error: '' },
        reply: { isPending: false, isError: false, error: '' },
      }),
    },
    editorDomain: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['reply', 'edit', 'delete']);

  dayjs.locale('ko');
  dayjs.extend(relativeTime);

  const editInputRef = ref(null); // 수정 모드 textarea ref
  const editFileInputRef = ref(null); // 수정 모드 파일 input ref
  const replyFileInputRef = ref(null); // 답글 모드 파일 input ref

  // 모드 상태
  const isEditing = ref(false); // 댓글 수정 모드 활성화 여부
  const isReplying = ref(false); // 답글 작성 모드 활성화 여부

  // 입력 내용
  const editedContent = ref(props.comment.content); // 수정 중인 댓글 내용
  const replyContent = ref(''); // 작성 중인 답글 내용

  // 이미지 모달 상태
  const isEditModalOpen = ref(false); // 수정 모드 이미지 확대 모달
  const isReplyModalOpen = ref(false); // 답글 모드 이미지 확대 모달
  const isCommentImageModalOpen = ref(false); // 댓글 이미지 확대 모달

  // 확인 모달 상태
  const showEditConfirmModal = ref(false); // 댓글 수정 확인 모달
  const showReplyConfirmModal = ref(false); // 답글 등록 확인 모달
  const showDeleteConfirmModal = ref(false); // 댓글 삭제 확인 모달

  // 수정 모드용 이미지 업로드
  const {
    uploadedImage: editUploadedImage,
    isUploading: isEditImageUploading,
    handleFileChange: handleEditFileChange,
    removeImage: removeEditImage,
    setImage: setEditImage,
  } = useCommentImageUpload(props.editorDomain);

  // 답글 모드용 이미지 업로드
  const {
    uploadedImage: replyUploadedImage,
    isUploading: isReplyImageUploading,
    handleFileChange: handleReplyFileChange,
    removeImage: removeReplyImage,
  } = useCommentImageUpload(props.editorDomain);

  // 작성 시간 표시 (1일 이내: 상대시간, 그 이상: 절대시간)
  const displayTime = (createdDate) => {
    const now = dayjs();
    const created = dayjs(createdDate);
    const diffInDays = now.diff(created, 'day');

    return diffInDays <= 1 ? created.fromNow() : formatDate(createdDate).full();
  };

  // 댓글 수정 모드 토글 및 초기화
  const handleEdit = () => {
    isEditing.value = !isEditing.value;
    if (isEditing.value) {
      editedContent.value = props.comment.content;
      // 기존 이미지 로드
      if (props.comment.fileUuid && props.comment.filePath) {
        setEditImage({
          fileUuid: props.comment.fileUuid,
          url: props.comment.filePath,
          fileName: '',
        });
      }
      nextTick(() => {
        editInputRef.value?.focus();
      });
    } else {
      // 수정 취소 시 정리
      removeEditImage();
    }
  };

  // 수정 모드 이미지 업로드 버튼 클릭
  const handleEditImageClick = () => {
    editFileInputRef.value?.click();
  };

  // 수정 모드 이미지 확대 모달 열기
  const openEditImageModal = () => {
    if (editUploadedImage.value) {
      isEditModalOpen.value = true;
    }
  };

  // 수정 모드 이미지 확대 모달 닫기
  const closeEditImageModal = () => {
    isEditModalOpen.value = false;
  };

  // 댓글 이미지 확대 모달 열기
  const openCommentImageModal = () => {
    if (props.comment.filePath) {
      isCommentImageModalOpen.value = true;
    }
  };

  // 댓글 이미지 확대 모달 닫기
  const closeCommentImageModal = () => {
    isCommentImageModalOpen.value = false;
  };

  // 답글 이미지 확대 모달 열기
  const openReplyImageModal = () => {
    if (replyUploadedImage.value) {
      isReplyModalOpen.value = true;
    }
  };

  // 답글 이미지 확대 모달 닫기
  const closeReplyImageModal = () => {
    isReplyModalOpen.value = false;
  };

  // 댓글 수정 저장 버튼 클릭 (검증 후 확인 모달 표시)
  const handleSaveClick = () => {
    // 검증
    if (
      !validateCommentContent({
        content: editedContent.value,
        uploadedImage: editUploadedImage.value,
        type: 'comment',
      })
    ) {
      return;
    }
    showEditConfirmModal.value = true;
  };

  // 댓글 수정 확인 모달 닫기
  const closeEditConfirmModal = () => {
    showEditConfirmModal.value = false;
  };

  // 댓글 수정 확인 후 부모 컴포넌트로 이벤트 전달
  const handleSaveConfirmed = () => {
    emit('edit', {
      commentUuid: props.comment.commentUuid,
      content: editedContent.value,
      imageFileUuid: editUploadedImage.value?.fileUuid || null,
    });
  };

  // 답글 모드 토글 및 초기화
  const handleReplyClick = () => {
    isReplying.value = !isReplying.value;
    replyContent.value = '';
    removeReplyImage();
  };

  // 답글 모드 이미지 업로드 버튼 클릭
  const handleReplyImageClick = () => {
    replyFileInputRef.value?.click();
  };

  // 답글 등록 버튼 클릭 (검증 후 확인 모달 표시)
  const handleReplySubmitClick = () => {
    // 검증
    if (
      !validateCommentContent({
        content: replyContent.value,
        uploadedImage: replyUploadedImage.value,
        type: 'reply',
      })
    ) {
      return;
    }
    showReplyConfirmModal.value = true;
  };

  // 답글 등록 확인 모달 닫기
  const closeReplyConfirmModal = () => {
    showReplyConfirmModal.value = false;
  };

  // 답글 등록 확인 후 부모 컴포넌트로 이벤트 전달
  const handleReplyConfirmed = () => {
    emit('reply', {
      parentUuid: props.comment.commentUuid,
      content: replyContent.value,
      imageFileUuid: replyUploadedImage.value?.fileUuid || null,
    });
  };

  // 댓글 삭제 버튼 클릭 (확인 모달 표시)
  const handleDeleteClick = () => {
    showDeleteConfirmModal.value = true;
  };

  // 댓글 삭제 확인 모달 닫기
  const closeDeleteConfirmModal = () => {
    showDeleteConfirmModal.value = false;
  };

  // 댓글 삭제 확인 후 부모 컴포넌트로 이벤트 전달
  const handleDeleteConfirmed = () => {
    emit('delete', props.comment.commentUuid);
  };

  // 수정 모드에서 Ctrl/Cmd + Enter로 저장 모달 열기
  const handleOpenEditModalByKey = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSaveClick();
    }
  };

  // 답글 모드에서 Ctrl/Cmd + Enter로 등록 모달 열기
  const handleOpenReplyModalByKey = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleReplySubmitClick();
    }
  };

  // 댓글 수정 완료 시 모달 닫기 및 수정 모드 종료
  watch(
    () => props.queryStates.edit.isPending,
    (isPending) => {
      if (!isPending && !props.queryStates.edit.isError && isEditing.value) {
        closeEditConfirmModal();
        isEditing.value = false;
      }
    },
  );

  // 답글 등록 완료 시 모달 닫기 및 답글 모드 종료
  watch(
    () => props.queryStates.reply.isPending,
    (isPending) => {
      if (!isPending && !props.queryStates.reply.isError && isReplying.value) {
        closeReplyConfirmModal();
        replyContent.value = '';
        removeReplyImage();
        isReplying.value = false;
      }
    },
  );

  // 댓글 삭제 완료 시 모달 닫기
  watch(
    () => props.queryStates.delete.isPending,
    (isPending) => {
      if (!isPending && !props.queryStates.delete.isError) {
        closeDeleteConfirmModal();
      }
    },
  );
</script>

<template>
  <li
    :class="[
      'flex',
      isParent ? 'flex-col gap-[6px]' : 'items-start gap-2',
      'rounded-md px-3 py-2 hover:bg-gray-50',
    ]"
  >
    <IconArrowCornerDownRightGray
      v-if="!isParent"
      class="w-4"
      alt="아래쪽 화살표 아이콘"
    />
    <div :class="[!isParent && 'w-full']">
      <!-- 댓글 헤더 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="font-bold">{{
            comment.authorText?.replaceAll(',', '')
          }}</span>
          <div
            v-if="comment.state === 'RESIDENT_DELETE'"
            class="group relative"
          >
            <WarningIcon />
            <div
              class="invisible absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform select-none whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white group-hover:visible"
            >
              탈퇴된 회원입니다.
              <div
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-gray-800"
              ></div>
            </div>
          </div>
          <span
            v-if="comment.state === 'ADMIN'"
            class="select-none rounded-md bg-dark-100 px-1 font-semibold text-muted-foreground-100"
            >관리자</span
          >
          <span
            class="cursor-default text-muted-foreground-100"
            :title="formatDate(comment.createdDate).time()"
          >
            {{ displayTime(comment.createdDate) }}
          </span>
        </div>
        <div class="flex flex-nowrap items-center gap-1">
          <button
            v-if="isParent && editable && !isEditing"
            type="button"
            class="px-3 py-2 font-medium"
            @click="handleReplyClick"
          >
            {{ isReplying ? '취소' : '↪ 답글' }}
          </button>
          <button
            v-if="comment.state === 'ADMIN'"
            type="button"
            class="px-3 py-2 font-medium"
            @click="handleEdit"
          >
            <span v-if="!isEditing" class="text-primary-100">수정</span>
            <span v-else>취소</span>
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="px-3 py-2 font-medium text-primary-100"
            @click="handleSaveClick"
          >
            등록
          </button>
          <button
            v-if="!isEditing && comment.state !== 'DELETE'"
            type="button"
            class="px-3 py-2 font-medium text-destructive-100"
            @click="handleDeleteClick"
          >
            삭제
          </button>
        </div>
      </div>

      <!-- 댓글 수정 모드 -->
      <div v-if="isEditing" class="mt-2 flex gap-2">
        <!-- 댓글 입력 영역 (이미지 + textarea) -->
        <div class="flex-1 rounded border border-gray-300 p-2 shadow-sm">
          <!-- 이미지 미리보기 (textarea 위에) -->
          <div v-if="editUploadedImage" class="relative inline-block">
            <img
              :src="getFullImageUrl(editUploadedImage.url)"
              :alt="editUploadedImage.fileName"
              class="h-20 w-20 cursor-pointer rounded border border-gray-300 object-cover"
              @click="openEditImageModal"
            />
            <button
              type="button"
              class="absolute -right-1 -top-1 flex items-center justify-center rounded-full border border-defaults-tertiary-border-tertiary bg-defaults-primary-background-primary p-0.5"
              @click="removeEditImage"
            >
              <IconClose />
            </button>
          </div>

          <!-- Textarea -->
          <InputBase
            ref="editInputRef"
            v-model="editedContent"
            type="textarea"
            placeholder="댓글을 입력해주세요. (Ctrl + Enter로 등록)"
            :max-length="500"
            class="w-full p-0"
            @keyup.escape="isEditing = false"
            @keydown="handleOpenEditModalByKey"
          />
        </div>

        <!-- 이미지 업로드 버튼 -->
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isEditImageUploading"
          @click="handleEditImageClick"
        >
          <IconImagePlus class="h-6 w-6" />
        </button>
        <input
          ref="editFileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleEditFileChange"
        />
      </div>

      <!-- 댓글 내용 표시 -->
      <div v-if="comment.state !== 'DELETE' && !isEditing">
        <!-- 이미지가 있으면 표시 -->
        <img
          v-if="comment?.filePath"
          :src="getFullImageUrl(comment.filePath)"
          alt="댓글 이미지"
          class="mb-2 h-20 w-20 cursor-pointer rounded border border-gray-300 object-cover"
          @click="openCommentImageModal"
        />
        <p
          v-if="comment.content"
          v-dompurify-html="decodeUrlToParagraph(comment.content)"
          class="w-full text-base leading-7"
        />
      </div>
      <p v-else-if="comment.state === 'DELETE'" class="italic leading-7">
        삭제된 댓글입니다.
      </p>
      <!-- 답글 입력 창 -->
      <div v-if="isReplying" class="mt-2 flex gap-2">
        <!-- 답글 입력 영역 (이미지 + textarea) -->
        <div class="flex-1 rounded border border-gray-300 p-2 shadow-sm">
          <!-- 이미지 미리보기 (textarea 위에) -->
          <div v-if="replyUploadedImage" class="relative m-2 inline-block">
            <img
              :src="getFullImageUrl(replyUploadedImage.url)"
              :alt="replyUploadedImage.fileName"
              class="h-20 w-20 cursor-pointer object-cover"
              @click="openReplyImageModal"
            />
            <button
              type="button"
              class="absolute -right-1 -top-1 flex items-center justify-center rounded-full border border-defaults-tertiary-border-tertiary bg-defaults-primary-background-primary p-0.5"
              @click="removeReplyImage"
            >
              <IconClose />
            </button>
          </div>

          <!-- Textarea -->
          <InputBase
            v-model="replyContent"
            type="textarea"
            placeholder="답글을 입력해주세요. (Ctrl + Enter로 등록)"
            :max-length="500"
            class="w-full border-0 bg-transparent p-0 focus:bg-transparent focus:ring-0"
            @keyup.escape="isReplying = false"
            @keydown="handleOpenReplyModalByKey"
          />
        </div>

        <!-- 버튼 영역 -->
        <div class="flex flex-col gap-2">
          <!-- 이미지 업로드 버튼 -->
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isReplyImageUploading"
            @click="handleReplyImageClick"
          >
            <IconImagePlus class="h-6 w-6" />
          </button>
          <input
            ref="replyFileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleReplyFileChange"
          />

          <!-- 등록 버튼 -->
          <ButtonBase
            type="button"
            :color="
              replyContent.length > 0 || replyUploadedImage
                ? 'deepBlue'
                : 'lightGray'
            "
            size="sm"
            :disabled="replyContent.length === 0 && !replyUploadedImage"
            @click="handleReplySubmitClick"
          >
            등록
          </ButtonBase>
        </div>
      </div>
    </div>

    <!-- 이미지 확대 모달 (수정 모드) -->
    <ModalImage
      :is-open="isEditModalOpen"
      :images="editUploadedImage ? [{ fileUrl: editUploadedImage.url }] : []"
      :image-index="0"
      @close="closeEditImageModal"
    />

    <!-- 이미지 확대 모달 (댓글 이미지) -->
    <ModalImage
      :is-open="isCommentImageModalOpen"
      :images="comment.filePath ? [{ fileUrl: comment.filePath }] : []"
      :image-index="0"
      @close="closeCommentImageModal"
    />

    <!-- 이미지 확대 모달 (답글 미리보기) -->
    <ModalImage
      :is-open="isReplyModalOpen"
      :images="replyUploadedImage ? [{ fileUrl: replyUploadedImage.url }] : []"
      :image-index="0"
      @close="closeReplyImageModal"
    />

    <!-- 댓글 수정 확인 모달 -->
    <ModalBaseNew v-if="showEditConfirmModal">
      <div class="min-w-[400px] max-w-[500px] space-y-6 p-6">
        <div class="space-y-2">
          <h2 class="pretendard-18Medium">댓글 수정</h2>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            댓글을 수정하시겠습니까?
          </p>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            size="md"
            :disabled="queryStates.edit.isPending"
            @click="closeEditConfirmModal"
          >
            취소
          </ButtonBase>
          <ButtonBase
            type="button"
            color="primary"
            size="md"
            class="flex"
            :disabled="queryStates.edit.isPending"
            @click="handleSaveConfirmed"
          >
            <SpinnerCircle v-if="queryStates.edit.isPending" />
            <template v-else>수정</template>
          </ButtonBase>
        </div>
      </div>
    </ModalBaseNew>

    <!-- 답글 등록 확인 모달 -->
    <ModalBaseNew v-if="showReplyConfirmModal">
      <div class="min-w-[400px] max-w-[500px] space-y-6 p-6">
        <div class="space-y-2">
          <h2 class="pretendard-18Medium">답글 등록</h2>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            답글을 등록하시겠습니까?
          </p>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            size="md"
            :disabled="queryStates.reply.isPending"
            @click="closeReplyConfirmModal"
          >
            취소
          </ButtonBase>
          <ButtonBase
            type="button"
            color="primary"
            size="md"
            class="flex"
            :disabled="queryStates.reply.isPending"
            @click="handleReplyConfirmed"
          >
            <SpinnerCircle v-if="queryStates.reply.isPending" />
            <template v-else>등록</template>
          </ButtonBase>
        </div>
      </div>
    </ModalBaseNew>

    <!-- 댓글 삭제 확인 모달 -->
    <ModalBaseNew v-if="showDeleteConfirmModal">
      <div class="min-w-[400px] max-w-[500px] space-y-6 p-6">
        <div class="space-y-2">
          <h2 class="pretendard-18Medium">댓글 삭제</h2>
          <p
            class="text-defaults-secondary-text-secondary pretendard-14Regular"
          >
            댓글을 삭제하시겠습니까?
          </p>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonBase
            type="button"
            color="secondary"
            size="md"
            :disabled="queryStates.delete.isPending"
            @click="closeDeleteConfirmModal"
          >
            취소
          </ButtonBase>
          <ButtonBase
            type="button"
            color="destructive"
            size="md"
            class="flex"
            :disabled="queryStates.delete.isPending"
            @click="handleDeleteConfirmed"
          >
            <SpinnerCircle v-if="queryStates.delete.isPending" />
            <template v-else>삭제</template>
          </ButtonBase>
        </div>
      </div>
    </ModalBaseNew>
  </li>
</template>
