<template>
  <span class="spinner"></span>
</template>

<style scoped>
  .spinner {
    width: 14px;
    height: 14px;
    border: 4px solid rgba(96, 134, 240, 0.3);
    border-radius: 50%;
    border-top-color: #2563eb;
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
