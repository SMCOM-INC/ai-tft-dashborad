<script setup>
  import { RouterView } from 'vue-router';
</script>

<template>
  <div class="mx-auto h-screen min-w-[1280px] max-w-[1920px] overflow-hidden">
    <slot><RouterView /></slot>
  </div>
</template>
