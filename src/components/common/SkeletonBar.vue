<script setup>
  import { computed } from 'vue';

  const randomWidth = computed(() => {
    return `${Math.floor(Math.random() * (98 - 85 + 1) + 85)}%`;
  });
</script>

<template>
  <div class="skeleton-row">
    <div class="skeleton-loader" :style="{ width: randomWidth }"></div>
  </div>
</template>

<style scoped>
  .skeleton-row {
    height: 40px;
    display: flex;
    align-items: center;
  }

  .skeleton-loader {
    height: 24px;
    border-radius: 4px;
    margin: 6px;
    background: linear-gradient(
      90deg,
      rgba(190, 190, 190, 0.2) 25%,
      rgba(129, 129, 129, 0.24) 37%,
      rgba(190, 190, 190, 0.2) 63%
    );
    background-size: 400% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
</style>
