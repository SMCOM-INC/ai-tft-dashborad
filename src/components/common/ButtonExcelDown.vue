<script setup>
  import IconDownloadBlack from '@assets/icons/icon-download-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';


  const props = defineProps({
    downloadFn: {
      type: Function,
      required: true,
      default: () => {},
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const downloadExcel = () => {
    props.downloadFn();
  };
</script>

<template>
  <ButtonBase
    type="button"
    color="secondary-fill"
    :disabled="isLoading || disabled"
    @click="downloadExcel"
  >
    <SpinnerCircle v-if="isLoading" color="blue" class="flex" />
    <div v-else class="flex min-w-[100px] items-center justify-between gap-2">
      엑셀 다운로드
      <IconDownloadBlack class="w-4" />
    </div>
  </ButtonBase>
</template>
