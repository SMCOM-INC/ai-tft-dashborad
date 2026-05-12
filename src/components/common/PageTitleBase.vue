<script setup>
  import IconArrowLeft from '@assets/icons/icon-arrow-left-solid.svg';

  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const props = defineProps({
    title: { type: String, required: true },
    paragraph: { type: String, required: false, default: '' },
    hasBackButton: { type: Boolean, required: false, default: false },
    backUrl: { type: String, required: false, default: '' },
  });

  const { navigateBack, navigateTo } = useNavigate();

  const handleBackButton = () => {
    if (props.backUrl) {
      navigateTo(props.backUrl);
    } else {
      navigateBack();
    }
  };
</script>

<template>
  <div class="mb-7">
    <div class="flex gap-1">
      <button v-if="hasBackButton" type="button" @click="handleBackButton">
        <IconArrowLeft />
      </button>
      <h2 class="text-text-primary pretendard-24Bold">{{ props.title }}</h2>
    </div>
    <p
      v-if="props.paragraph && !hasBackButton"
      class="text-defaults-secondary-text-secondary pretendard-16Regular"
    >
      {{ props.paragraph }}
    </p>
  </div>
</template>
