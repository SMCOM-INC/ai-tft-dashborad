<script setup>
  import IconEye from '@assets/icons/icon-eye.svg';
  import IconThumbUp from '@assets/icons/icon-thumbs-up.svg';

  const props = defineProps({
    viewCount: {
      type: Number,
      required: true,
    },
    likeCount: {
      type: Number,
      required: true,
    },
    likeButtonName: {
      type: String,
      required: true,
      default: '추천수',
    },
  });
</script>

<template>
  <div class="flex items-center gap-2 text-muted-foreground-100">
    <IconEye />조회 {{ props.viewCount?.toLocaleString('en-US') || 0 }}
    <span class="mx-1">|</span>
    <IconThumbUp /> {{ props.likeButtonName }}
    {{ props.likeCount?.toLocaleString('en-US') || 0 }}
  </div>
</template>
