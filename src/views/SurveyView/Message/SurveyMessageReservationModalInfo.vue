<script setup>
  import { SMS_RESERVATION_INFO_TEXT } from '@/constants/survey.js';
</script>

<template>
  <div class="m-6 space-y-2 rounded-lg bg-blue-50 p-4">
    <h2 class="text-defaults-secondary-text-secondary pretendard-14SemiBold">
      메시지 발송 안내
    </h2>
    <ul class="list-disc space-y-1 rounded pl-4 text-sm">
      <li v-for="(text, index) in SMS_RESERVATION_INFO_TEXT" :key="index">
        {{ text }}
      </li>
    </ul>
  </div>
</template>
