<script setup>
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const { navigateBack } = useNavigate();

  const goBack = () => {
    navigateBack();
  };
</script>

<template>
  <div
    class="flex h-full flex-col items-center justify-center px-4 py-16 text-center"
  >
    <p class="mt-4 text-xl font-medium text-gray-600">
      페이지를 찾을 수 없습니다.
    </p>
    <p class="mt-2 text-gray-500">
      요청하신 페이지가 존재하지 않거나, 삭제되었을 수 있습니다.
    </p>
    <button
      type="button"
      class="hover:bg-primary-dark focus:ring-primary mt-6 rounded-xl border px-6 py-3 shadow-md"
      @click="goBack"
    >
      뒤로가기
    </button>
  </div>
</template>
