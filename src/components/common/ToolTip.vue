<script setup>
  import InfoIcon from '@assets/icons/icon-info-filled-blue.svg';
  import { computed } from 'vue';


  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    width: {
      type: [String, Number],
      default: 600,
    },
  });

  const processedWidth = computed(() =>
    typeof props.width === 'number' ? `${props.width}px` : props.width,
  );

  const processedText = computed(() =>
    props.text.replace(/\\n/g, '<br />').replace(/\n/g, '<br />'),
  );
</script>

<template>
  <div class="group relative">
    <InfoIcon class="w-5" />
    <div
      :style="{ width: `${processedWidth}` }"
      class="invisible absolute bottom-6 left-0 z-10 transform select-none rounded bg-gray-800 px-3 py-2 text-sm text-white group-hover:visible"
    >
      <div v-dompurify-html="processedText" />
      <div
        class="absolute -bottom-1 left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-gray-800"
      ></div>
    </div>
  </div>
</template>
