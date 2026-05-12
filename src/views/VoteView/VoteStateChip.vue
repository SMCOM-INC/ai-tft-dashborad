<script setup>
  import ChipBaseNew from '@components/common/ChipBaseNew.vue';
  import { computed } from 'vue';

  import { VOTE_STATE } from '@/constants/vote.js';

  const props = defineProps({
    voteState: {
      type: String,
      required: true,
    },
  });

  const chipInfo = computed(() => {
    switch (props.voteState) {
      case VOTE_STATE.PROGRESS:
        return {
          color: 'primary',
          variant: 'fill',
          size: 'md',
          label: '진행중',
        };
      case VOTE_STATE.PENDING:
        return {
          color: 'secondary',
          variant: 'outline',
          size: 'md',
          label: '시작전',
        };
      case VOTE_STATE.CLOSE:
        return {
          color: 'success',
          variant: 'fill',
          size: 'md',
          label: '종료',
        };
      default:
        return '';
    }
  });
</script>

<template>
  <ChipBaseNew
    :color="chipInfo?.color"
    :variant="chipInfo?.variant"
    :size="chipInfo?.size"
  >
    {{ chipInfo?.label }}
  </ChipBaseNew>
</template>
