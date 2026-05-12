<script setup>
  import ChevronLeftIcon from '@assets/icons/icon-chevron-left-black.svg';

  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const props = defineProps({
    customRoute: { type: String, required: false, default: '' },
  });

  const { navigateBack, navigateTo } = useNavigate();

  const handleBackButton = () => {
    if (props.customRoute && props.customRoute !== '') {
      navigateTo(props.customRoute);
    } else {
      navigateBack();
    }
  };
</script>
<template>
  <button
    type="button"
    class="mb-8 flex items-center hover:text-primary-90"
    @click="handleBackButton"
  >
    <ChevronLeftIcon class="h-3 w-3" aria-hidden="true" />
    <span class="ml-2 select-none text-base"> 뒤로가기 </span>
  </button>
</template>
