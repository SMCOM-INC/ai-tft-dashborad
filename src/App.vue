<script setup>
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
  import { RouterView } from 'vue-router';
  import '@/input.css';
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
</template>
