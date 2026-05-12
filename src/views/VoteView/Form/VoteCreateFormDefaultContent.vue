<script setup>
  import QuillContentContainer from '@components/common/QuillContentContainer.vue';
  import { computed } from 'vue';

  import convertDeltaToHtml from '@/lib/delta/convertDeltaToHtml.js';

  const props = defineProps({
    content: {
      type: String,
      required: true,
      default: '',
    },
  });

  const htmlContent = computed(() => {
    if (!props.content) return '';
    return convertDeltaToHtml(props.content);
  });
</script>

<template>
  <div
    class="max-h-[1000px] overflow-auto rounded-md border border-defaults-secondary-border-secondary bg-defaults-secondary-background-secondary"
  >
    <QuillContentContainer>
      <span v-dompurify-html="htmlContent" />
    </QuillContentContainer>
  </div>
</template>
