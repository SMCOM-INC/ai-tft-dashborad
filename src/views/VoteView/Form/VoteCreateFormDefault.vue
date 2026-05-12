<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputText from '@components/common/InputText.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';
  import VoteCreateFormContent from '@views/VoteView/Form/VoteCreateFormDefaultContent.vue';
  import VoteCreateFormEditor from '@views/VoteView/Form/VoteCreateFormDefaultEditor.vue';
  import VoteType from '@views/VoteView/VoteType.vue';
  import { useForm } from 'vee-validate';
  import { ref, watch } from 'vue';

  import { AUTH_TYPE } from '@/constants/vote.js';
  import usePatchVoteFormDefault from '@/lib/queries/vote/usePatchVoteFormDefault.js';
  import parseEditorContent from '@/lib/utils/parseEditorContent.js';
  import { voteSaveVoteFormDefaultSchema } from '@/schemas/vote.js';
  import { useVoteImageStore, useVoteSubmitStore } from '@/stores/vote.js';

  const props = defineProps({
    detailInfo: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isDetailInfoLoading: {
      type: Boolean,
      required: true,
    },
  });

  const { setDefaultInfo } = useVoteSubmitStore();
  const voteImageStore = useVoteImageStore();

  const {
    patchVoteFormDefaultMutationAsync,
    isPatchVoteFormDefaultPending,
    isPatchVoteFormDefaultSuccess,
    resetPatchVoteFormDefault,
  } = usePatchVoteFormDefault();

  const { values, handleSubmit, errors, setValues, meta, defineField } =
    useForm({
      validationSchema: voteSaveVoteFormDefaultSchema,
    });

  const [voteAuthType] = defineField('voteAuthType');

  const isEditing = ref(window.history.state.vote === 'create');

  const editDefault = () => {
    resetPatchVoteFormDefault();
    isEditing.value = true;
  };

  const onSubmit = handleSubmit(async (submitValues) => {
    await patchVoteFormDefaultMutationAsync({
      title: submitValues.title,
      voteType: submitValues.voteType,
      voteAuthType: submitValues.voteAuthType,
      content: values.content,
      voteManagerName: submitValues.voteManagerName,
      voteManagerPosition: submitValues.voteManagerPosition,
      imageFileUuidList: voteImageStore.editorContentUuidList,
    });

    window.history.state.vote = null;
  });

  watch(
    () => props.detailInfo,
    (newValue) => {
      if (!newValue) {
        return;
      }

      setValues({
        title: newValue.title,
        voteType: newValue.voteType,
        voteAuthType: newValue.voteAuthType,
        content: parseEditorContent(newValue.content),
        voteManagerName: newValue.voteManagerName,
        voteManagerPosition: newValue.voteManagerPosition,
      });

      const isCreateMode = window.history.state.vote === 'create';

      const requiredFields = [
        'title',
        'voteType',
        'voteAuthType',
        'voteManagerName',
        'voteManagerPosition',
      ];

      const isRequiredFilled = requiredFields.every(
        (field) => !!newValue[field],
      );

      // 저장 성공 후에는 isEditing을 true로 변경하지 않음
      if (!isPatchVoteFormDefaultSuccess.value) {
        isEditing.value = isCreateMode || !isRequiredFilled;
      }
    },
    { immediate: true },
  );

  watch(isPatchVoteFormDefaultSuccess, (newValue) => {
    if (!newValue) {
      return;
    }

    isEditing.value = false;
  });

  watch(
    isEditing,
    (newValue) => {
      setDefaultInfo(newValue);
    },
    { immediate: true },
  );

  // 에디터 이미지 삭제 관리를 위해, store 에  uuid list 저장
  watch(
    () => values.content,
    (newValue) => {
      if (!newValue) {
        return;
      }

      // 에디터 값을 store와 동기화
      voteImageStore.setEditorContentValues(newValue);
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <div>
    <template v-if="isDetailInfoLoading">
      <SkeletonBase v-for="item in 3" :key="item" class="m-4 h-5 rounded-md" />
    </template>
    <form
      v-else
      id="voteFormDefault"
      class="flex flex-col gap-4"
      @submit="onSubmit"
    >
      <!-- 제목 -->
      <InputText
        id="title"
        type="text"
        size="xl"
        label="제목"
        :maxlength="50"
        placeholder="제목 입력 (최대 50자)"
        hint="선택하신 그룹에 생성할 제목을 입력해 주세요."
        :error="errors.title"
        :disabled="!isEditing"
      />
      <!-- 투표 유형 -->
      <VoteType :errors="errors" :disabled="!isEditing" />
      <!-- 인증 유형 -->
      <div class="space-y-2">
        <h3 class="text-defaults-secondary-text-secondary pretendard-16Medium">
          인증 유형
        </h3>
        <ul class="flex gap-4">
          <li v-for="type in AUTH_TYPE" :key="type.key">
            <label
              :class="`flex h-14 items-center gap-2 rounded-md border border-defaults-primary-border-primary p-3 ${type.key === values.voteAuthType && isEditing ? 'border-primary2-pc-indigo-300' : undefined} ${type.key === values.voteAuthType && !isEditing ? 'border-4' : undefined} ${!isEditing ? 'cursor-not-allowed' : 'cursor-pointer'}`"
            >
              <input
                v-model="voteAuthType"
                type="radio"
                :value="type.key"
                class="mt-1"
                :disabled="!isEditing"
              />
              {{ type.label }}
            </label>
          </li>
        </ul>
        <p class="h-5 text-alerts-error-text-error pretendard-14Regular">
          {{ errors.voteAuthType }}
        </p>
      </div>
      <!-- 투표 담당자 -->
      <div class="flex gap-3">
        <!-- 투표 담당자 이름 -->
        <InputText
          id="voteManagerName"
          type="text"
          size="xl"
          label="담당자 이름"
          :maxlength="10"
          placeholder="이름 입력 (최대 10자)"
          :error="errors.voteManagerName"
          :disabled="!isEditing"
        />
        <!-- 투표 담당자 직책 -->
        <InputText
          id="voteManagerPosition"
          type="text"
          size="xl"
          label="담당자 직책"
          :maxlength="20"
          placeholder="직책 입력 (최대 20자)"
          :error="errors.voteManagerPosition"
          :disabled="!isEditing"
          class-custom="w-80"
        />
      </div>
      <!-- 투표 개요 -->
      <div class="space-y-2">
        <span
          class="text-defaults-secondary-text-secondary pretendard-16Medium"
        >
          상세내용
        </span>
        <VoteCreateFormEditor v-if="isEditing" :content="detailInfo?.content" />
        <VoteCreateFormContent v-else :content="detailInfo?.content" />
      </div>
      <div class="flex justify-end">
        <ButtonBase
          v-if="isEditing"
          key="button-base-new-2"
          form="voteFormDefault"
          type="submit"
          size="md"
          class="flex h-fit w-36 items-center justify-center gap-2"
          :color="meta.valid ? 'primary' : 'primary-disabled'"
          :disabled="isPatchVoteFormDefaultPending"
        >
          <SpinnerCircle v-if="isPatchVoteFormDefaultPending" />
          <template v-else>저장하기</template>
        </ButtonBase>
        <ButtonBase
          v-else
          key="button-base-new-1"
          form="voteFormDefault"
          type="button"
          size="md"
          class="flex h-fit w-36 items-center justify-center gap-2"
          :color="meta.valid ? 'primary' : 'primary-disabled'"
          :disabled="isPatchVoteFormDefaultPending"
          @click="editDefault"
        >
          <SpinnerCircle v-if="isPatchVoteFormDefaultPending" />
          <template v-else>수정하기</template>
        </ButtonBase>
      </div>
    </form>
  </div>
</template>
