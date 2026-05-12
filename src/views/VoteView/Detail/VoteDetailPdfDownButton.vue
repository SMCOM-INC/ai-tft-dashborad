<script setup>
  import IconDownloadBlack from '@assets/icons/icon-download-black.svg';
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import useGetVoteDetailPdf from '@/lib/queries/vote/useGetVoteDetailPdf.js';

  defineProps({
    disabled: {
      type: Boolean,
      required: true,
      default: false,
    },
  });

  const { refetchVoteDetailVotersPdf, isVoteDetailVotersPdfLoading } =
    useGetVoteDetailPdf();

  const downloadPdf = () => {
    refetchVoteDetailVotersPdf();
  };
</script>

<template>
  <ButtonBase
    type="button"
    color="secondary-fill"
    :disabled="isVoteDetailVotersPdfLoading || disabled"
    @click="downloadPdf"
  >
    <div v-if="isVoteDetailVotersPdfLoading" class="flex min-w-[100px]">
      <SpinnerCircle color="blue" />
    </div>
    <div v-else class="flex min-w-[100px] items-center justify-between gap-2">
      결과 다운로드
      <IconDownloadBlack class="w-4" />
    </div>
  </ButtonBase>
</template>
