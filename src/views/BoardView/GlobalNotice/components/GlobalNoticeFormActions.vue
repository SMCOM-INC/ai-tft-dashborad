<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';

  defineProps({
    mode: {
      type: String,
      required: true,
      validator: (value) => ['create', 'edit'].includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <div class="flex justify-end gap-4">
    <ButtonBase
      form="globalNoticeForm"
      type="submit"
      color="primary"
      custom-class="px-3 py-2"
      :disabled="loading"
    >
      <div v-if="loading" class="flex items-center gap-2">
        <span>{{ mode === 'create' ? '등록중..' : '수정중..' }}</span>
        <SpinnerWhiteView />
      </div>
      <div
        v-else
        class="w-full"
        :title="mode === 'create' ? '등록하기' : '수정하기'"
      >
        {{ mode === 'create' ? '등록하기' : '수정하기' }}
      </div>
    </ButtonBase>
  </div>
</template>
