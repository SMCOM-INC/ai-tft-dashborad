<script setup>
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import WaveSurfer from 'wavesurfer.js';

  const props = defineProps({
    src: { type: String, required: true },
    height: { type: Number, default: 56 },
    formatHint: { type: Boolean, default: true },
  });

  const waveformRef = ref(null);
  const isReady = ref(false);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const loadError = ref(false);

  let wavesurfer = null;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const destroyInstance = () => {
    if (wavesurfer) {
      wavesurfer.destroy();
      wavesurfer = null;
    }
  };

  const createInstance = () => {
    destroyInstance();

    isReady.value = false;
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
    loadError.value = false;

    wavesurfer = WaveSurfer.create({
      container: waveformRef.value,
      url: props.src,
      height: props.height,
      waveColor: '#D4D8DD',
      progressColor: '#5E6AD2',
      cursorColor: '#5E6AD2',
      cursorWidth: 2,
      barWidth: 2,
      barGap: 2,
      barRadius: 8,
      normalize: true,
    });

    wavesurfer.on('ready', (audioDuration) => {

      isReady.value = true;
      duration.value = audioDuration;
    });
    wavesurfer.on('timeupdate', (time) => {
      currentTime.value = time;
    });
    wavesurfer.on('play', () => {
      isPlaying.value = true;
    });
    wavesurfer.on('pause', () => {
      isPlaying.value = false;
    });
    wavesurfer.on('finish', () => {
      isPlaying.value = false;
    });
    wavesurfer.on('error', () => {
      loadError.value = true;
      isReady.value = false;
    });
  };

  const togglePlay = () => {
    if (!wavesurfer || !isReady.value) return;
    wavesurfer.playPause();
  };

  watch(
    () => props.src,
    () => {
      createInstance();
    },
  );

  onMounted(() => {
    createInstance();
  });

  onBeforeUnmount(() => {
    destroyInstance();
  });
</script>

<template>
  <div class="space-y-2">
    <div
      v-if="loadError"
      class="flex items-center gap-2 rounded-linear-md border border-dashed border-linear-border bg-linear-surface px-4 py-5 text-[13px] text-linear-text-muted"
    >
      <svg
        viewBox="0 0 24 24"
        class="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M5.6 5.6l12.8 12.8" />
      </svg>
      통화 음원을 불러올 수 없습니다.
    </div>

    <div
      v-else
      class="flex items-center gap-4 rounded-linear-md border border-linear-border bg-linear-surface px-4 py-3"
    >
      <button
        type="button"
        :disabled="!isReady"
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-accent text-white transition-colors duration-micro ease-std hover:bg-linear-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        @click="togglePlay"
      >
        <svg
          v-if="!isPlaying"
          viewBox="0 0 24 24"
          class="ml-0.5 h-5 w-5"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      </button>

      <div ref="waveformRef" class="min-w-0 flex-1"></div>

      <span
        class="shrink-0 font-mono text-[13px] tabular-nums text-linear-text-secondary"
      >
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </span>
    </div>

    <p
      v-if="formatHint"
      class="flex items-start gap-1.5 text-[12px] leading-5 text-linear-text-muted"
    >
      <svg
        viewBox="0 0 24 24"
        class="mt-0.5 h-3.5 w-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <span>
        WAV·MP3·M4A·OGG·FLAC 등 오디오 파일만 재생됩니다. AVI·MP4·WMA 등 영상·기타
        포맷은 지원하지 않습니다.
      </span>
    </p>
  </div>
</template>
