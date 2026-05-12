<script setup>
  import CloseIcon from '@assets/icons/icon-close-black.svg';
  import IconClose from '@assets/icons/icon-close-circle-gray.svg';
  import IconImagePlus from '@assets/icons/icon-imagePlus-line-blue.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import ModalBaseNew from '@components/common/ModalBaseNew.vue';
  import ModalField from '@components/common/ModalField.vue';
  import ModalFieldDongHo from '@components/common/ModalFieldDongHo.vue';
  import ModalFieldName from '@components/common/ModalFieldName.vue';
  import ModalFieldPhone from '@components/common/ModalFieldPhone.vue';
  import ModalFieldTextarea from '@components/common/ModalFieldTextarea.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import RepairMemberSearchInputByPhone from '@views/RepairView/RepairMemberSearchInputByPhone.vue';
  import { Field, useForm } from 'vee-validate';
  import { ref } from 'vue';


  import usePostRepair from '@/lib/queries/repair/usePostRepair.js';
  import formatFileSize from '@/lib/utils/formatFileSize.js';
  import { repairFormSchema } from '@/schemas/repair.js';

  const emits = defineEmits(['close']);

  const { createPostMutationAsync, isCreatePostPending } = usePostRepair();

  const { meta, handleSubmit, errors, setFieldValue } = useForm({
    validationSchema: repairFormSchema,
  });

  const selectedImagesListRef = ref([]);
  const selectedImageObjectsListRef = ref([]);

  const closeModal = () => {
    emits('close');
  };

  const handleMemberDetail = (memberDetail) => {
    setFieldValue('phone', memberDetail.phone);
    setFieldValue('residentUuid', memberDetail.newMemberDetail.aptResidentUuid);
    setFieldValue('dong', memberDetail.newMemberDetail.dong);
    setFieldValue('ho', memberDetail.newMemberDetail.ho);
    setFieldValue('name', memberDetail.newMemberDetail.name);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const existingFileIndex = selectedImagesListRef.value.findIndex(
        (f) => f.name === file.name && f.size === file.size,
      );

      if (existingFileIndex === -1) {
        selectedImagesListRef.value.push({
          url:
            file instanceof File
              ? URL.createObjectURL(file)
              : `${file.fileUrl}`,
          name: file.name,
          size: formatFileSize(file.size),
        });
        selectedImageObjectsListRef.value.push(file);
      }
    });

    setFieldValue('fileList', selectedImageObjectsListRef.value);
    event.target.value = '';
  };

  const removeFile = (index) => {
    selectedImagesListRef.value.splice(index, 1);
    selectedImageObjectsListRef.value.splice(index, 1);

    setFieldValue('fileList', selectedImageObjectsListRef.value);
  };

  const onSubmit = handleSubmit(async (submitValues) => {
    await createPostMutationAsync(submitValues);

    closeModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="max-h-[80vh] min-w-[672px] max-w-[672px] overflow-auto">
      <div
        class="flex items-center justify-between gap-3 border-b border-b-defaults-primary-border-primary px-6 py-4"
      >
        <h1 class="pretendard-20Bold">하자보수 접수하기</h1>
        <button
          type="button"
          :disabled="isCreatePostPending"
          @click="closeModal"
        >
          <CloseIcon class="h-5 w-5" />
        </button>
      </div>
      <form
        id="createRepairForm"
        class="flex flex-col gap-6 p-6"
        @submit="onSubmit"
      >
        <RepairMemberSearchInputByPhone @member-detail="handleMemberDetail" />
        <ModalFieldDongHo :errors="errors" disabled />
        <div class="flex gap-2">
          <ModalFieldName id="name" :errors="errors" disabled />
          <ModalFieldPhone
            id="emergencyPhone"
            :errors="errors"
            label-text="비상 연락처(선택)"
            :is-required="false"
          />
        </div>
        <ModalField
          id="location"
          input-type="text"
          label-text="위치"
          :errors="errors"
        />
        <ModalFieldTextarea
          id="content"
          label="접수내용"
          :errors="errors"
          :max-length="200"
          is-required
        />
        <ModalFieldTextarea
          id="requirement"
          label="기타 요청 사항(선택)"
          :errors="errors"
          :max-length="200"
          :is-required="false"
        />
        <div class="flex flex-col gap-3">
          <div class="flex justify-between">
            <LabelBase label-for="fileList" label-text="이미지 첨부(선택)" />
            <div>
              <label
                for="fileList"
                class="flex items-center justify-between gap-2 rounded-md border border-primary-50 bg-background-100 px-3 py-2 font-medium text-primary-100"
              >
                <IconImagePlus />
                이미지 첨부
              </label>
              <Field
                id="fileList"
                type="file"
                name="fileList"
                accept="image/*"
                multiple
                max="5"
                @change="handleFileChange"
              />
            </div>
          </div>

          <div>
            <ul
              class="flex min-h-[104px] items-center gap-2 overflow-x-auto rounded-[4px] bg-muted-50 p-3 text-muted-foreground-100"
            >
              <template
                v-if="selectedImagesListRef && selectedImagesListRef.length > 0"
              >
                <li
                  v-for="(image, index) in selectedImagesListRef"
                  :key="image.name"
                  class="relative flex h-20 w-20 shrink-0"
                >
                  <img
                    class="h-full w-full rounded-md"
                    :src="image.url"
                    alt="이미지 파일"
                  />
                  <button
                    type="button"
                    class="absolute right-1 top-1 h-5 w-5"
                    @click="removeFile(index)"
                  >
                    <IconClose alt="닫기 아이콘" />
                  </button>
                </li>
              </template>
              <p v-else class="h-full w-full text-center">
                첨부된 이미지가 없습니다.
              </p>
            </ul>
          </div>
          <p class="text-xs leading-5 text-muted-foreground-100">
            파일당 최대 10MB까지의 *.jpg, *.jpeg, *.png, *.gif 형식의 이미지만
            업로드 가능합니다 (최대 5개)
          </p>
        </div>
        <ButtonBase
          form="createRepairForm"
          type="submit"
          :color="meta.valid ? 'primary' : 'primary-disabled'"
          size="md"
          class="flex w-full items-center justify-center gap-2"
          :disabled="isCreatePostPending"
        >
          <SpinnerCircle v-if="isCreatePostPending" class="mx-auto" />
          <template v-else>접수하기</template>
        </ButtonBase>
      </form>
    </div>
  </ModalBaseNew>
</template>
