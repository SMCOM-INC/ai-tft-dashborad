<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';

  const props = defineProps({
    btnText: {
      type: String,
      required: false,
      default: '수정하기',
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
    isManualSubmit: {
      type: Boolean,
      required: false,
      default: false,
    },
    form: {
      type: String,
      required: false,
      default: '',
    },
  });

  const emit = defineEmits(['edit', 'cancel', 'submit']);

  const handleEdit = () => {
    emit('edit');
  };

  const handleCancel = () => {
    emit('cancel');
  };

  const handleSubmit = () => {
    emit('submit');
  };
</script>

<template>
  <div v-if="isEditing" class="flex gap-2">
    <ButtonBase
      type="button"
      color="secondary"
      size="md"
      @click="handleCancel"
    >
      취소
    </ButtonBase>
    <ButtonBase
      v-if="!isManualSubmit"
      key="form-submit-button"
      type="submit"
      color="primary"
      size="md"
      :form="props.form"
      :disabled="props.isLoading"
    >
      <div v-if="props.isLoading" class="flex items-center gap-2">
        <span>수정 내용 저장중..</span>
        <SpinnerWhiteView />
      </div>
      <div v-else class="w-full">수정 내용 저장</div>
    </ButtonBase>
    <ButtonBase
      v-else
      key="manual-submit-button"
      type="button"
      color="primary"
      size="md"
      :disabled="props.isLoading"
      @click="handleSubmit"
    >
      <div v-if="props.isLoading" class="flex items-center gap-2">
        <span>수정 내용 저장중..</span>
        <SpinnerWhiteView />
      </div>
      <div v-else class="w-full">수정 내용 저장</div>
    </ButtonBase>
  </div>
  <div v-else>
    <ButtonBase
      key="button-base-3"
      type="button"
      color="primary"
      size="md"
      @click="handleEdit"
    >
      {{ props.btnText }}
    </ButtonBase>
  </div>
</template>
