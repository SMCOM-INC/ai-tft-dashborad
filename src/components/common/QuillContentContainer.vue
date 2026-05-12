<script setup>
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
</script>

<template>
  <div class="quill-content">
    <div class="ql-snow">
      <div class="ql-editor">
        <slot />
      </div>
    </div>
  </div>
</template>
