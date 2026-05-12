<script setup>
  import QuillContentContainer from '@components/common/QuillContentContainer.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import { computed } from 'vue';

  import convertDeltaToHtml from '@/lib/delta/convertDeltaToHtml.js';

  const props = defineProps({
    fetchData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const htmlContent = computed(() => {
    if (!props.fetchData?.content) {
      return '';
    }

    return convertDeltaToHtml(props.fetchData?.content);
  });
</script>

<template>
  <div>
    <div
      class="pb-3 text-defaults-secondary-text-secondary pretendard-14Regular"
    >
      상세내용
    </div>
    <template v-if="isLoading">
      <SkeletonBase v-for="item in 5" :key="item" class="m-4 h-5 rounded-md" />
    </template>
    <div
      v-else
      class="max-h-[610px] min-h-[337px] w-full overflow-auto rounded-md border px-4 py-3"
    >
      <QuillContentContainer>
        <span v-dompurify-html="htmlContent" />
      </QuillContentContainer>
    </div>
  </div>
</template>
