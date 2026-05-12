<script setup>
  import ChipBaseNew from '@components/common/ChipBaseNew.vue';
  import { computed } from 'vue';

  import { SURVEY_STATE } from '@/constants/survey.js';

  const props = defineProps({
    state: {
      type: String,
      required: true,
    },
  });

  const chipInfo = computed(() => {
    switch (props.state) {
      case SURVEY_STATE.PROGRESS:
        return {
          color: 'primary',
          variant: 'fill',
          size: 'md',
          label: '진행중',
        };
      case SURVEY_STATE.PENDING:
        return {
          color: 'secondary',
          variant: 'outline',
          size: 'md',
          label: '시작전',
        };
      case SURVEY_STATE.CLOSE:
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
