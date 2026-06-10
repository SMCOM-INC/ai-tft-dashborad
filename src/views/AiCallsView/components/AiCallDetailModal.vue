<script setup>
  import AudioWavePlayer from '@views/AiCallsView/components/AudioWavePlayer.vue';
  import { computed, onMounted, onUnmounted } from 'vue';

  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const props = defineProps({
    call: { type: Object, required: true },
  });

  const emit = defineEmits(['close']);

  // 데모용 통화 원문 목데이터 — API 연동 시 call.originalText / call.correctedText 값으로 대체됨
  // 원본: 화자 라벨([SPEAKER_xx]) 그대로의 STT 결과
  const MOCK_ORIGINAL_TEXT =
    '[SPEAKER_00] 안녕하세요 행복아파트 관리사무소입니다 무엇을 도와드릴까요\n[SPEAKER_01] 네 안녕하세요 저희 집 주차 등록이 안 되어 있다고 떠서요 분명히 지난달에 등록했는데요\n[SPEAKER_00] 불편을 드려 죄송합니다 확인해 드리겠습니다 동호수와 차량번호 알려주시겠어요\n[SPEAKER_01] 101동 1502호고요 차량번호는 12가 3456입니다\n[SPEAKER_00] 확인해 보니 지난달 신청 건이 서류 미비로 보류되어 있었네요 신분증 사본이 누락되어 있었습니다\n[SPEAKER_01] 아 그런 안내를 못 받았는데요 그럼 지금 어떻게 해야 하나요\n[SPEAKER_00] 지금 바로 등록 도와드리겠습니다 입주민 앱으로 신분증 사진만 다시 올려주시면 오늘 중으로 처리됩니다\n[SPEAKER_01] 네 알겠습니다 그럼 오늘 안에 주차 가능한 거죠\n[SPEAKER_00] 네 등록 완료되면 문자로 안내드리겠습니다 더 도와드릴 부분 있으실까요\n[SPEAKER_01] 아니요 감사합니다 수고하세요';

  // 가공본: 화자명·문장부호를 정리한 결과
  const MOCK_CORRECTED_TEXT =
    '상담사 : 안녕하세요, 행복아파트 관리사무소입니다. 무엇을 도와드릴까요?\n고객 : 네, 안녕하세요. 저희 집 주차 등록이 안 되어 있다고 떠서요. 분명히 지난달에 등록했는데요.\n상담사 : 불편을 드려 죄송합니다. 확인해 드리겠습니다. 동호수와 차량번호 알려주시겠어요?\n고객 : 101동 1502호고요, 차량번호는 12가 3456입니다.\n상담사 : 확인해 보니 지난달 신청 건이 서류 미비로 보류되어 있었네요. 신분증 사본이 누락되어 있었습니다.\n고객 : 아, 그런 안내를 못 받았는데요. 그럼 지금 어떻게 해야 하나요?\n상담사 : 지금 바로 등록 도와드리겠습니다. 입주민 앱으로 신분증 사진만 다시 올려주시면 오늘 중으로 처리됩니다.\n고객 : 네, 알겠습니다. 그럼 오늘 안에 주차 가능한 거죠?\n상담사 : 네, 등록 완료되면 문자로 안내드리겠습니다. 더 도와드릴 부분 있으실까요?\n고객 : 아니요, 감사합니다. 수고하세요.';

  const metaItems = computed(() => [
    { label: '관리번호', value: props.call.id },
    { label: '통화일시', value: props.call.date },
    { label: '통화시간', value: `${Number(props.call.duration).toFixed(1)}초` },
  ]);

  const categoryPath = computed(() =>
    [
      props.call.categoryMain,
      props.call.categorySub,
      props.call.categoryDetail,
    ].filter(Boolean),
  );

  const scores = computed(() => [
    { label: '신속성', value: props.call.scoreSpeed, max: 30 },
    { label: '정확성', value: props.call.scoreAccuracy, max: 40 },
    { label: '전문성', value: props.call.scoreProfessionalism, max: 30 },
    { label: '종합점수', value: props.call.scoreTotal, max: 100, accent: true },
  ]);

  const summaryText = computed(() => {
    const value = props.call.summary;
    return typeof value === 'string' && value ? decodeUrl(value) : '-';
  });

  // 녹음 파일 유무 (API의 audioUrl 기준) — 없으면 빈 상태 노출
  const hasAudio = computed(() => !!props.call.audioUrl);

  // API가 통화 원문을 내려주면 그것을, 아직 없으면 목데이터를 사용
  const originalText = computed(() => {
    const value = props.call.originalText;
    const raw = typeof value === 'string' && value ? value : MOCK_ORIGINAL_TEXT;
    return decodeUrl(raw);
  });

  const correctedText = computed(() => {
    const value = props.call.correctedText;
    const raw = typeof value === 'string' && value ? value : MOCK_CORRECTED_TEXT;
    return decodeUrl(raw);
  });

  const close = () => emit('close');

  const handleKeydown = (event) => {
    if (event.key === 'Escape') close();
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(8,9,10,0.45)] p-5"
      @click="close"
    >
      <div
        class="animate-fade-up flex max-h-[85vh] w-full max-w-[840px] flex-col overflow-hidden rounded-linear-lg border border-linear-border bg-linear-bg shadow-linear-modal"
        @click.stop
      >
        <div
          class="flex shrink-0 items-center justify-between border-b border-linear-border px-6 py-4"
        >
          <h2
            class="font-inter text-[16px] font-semibold tracking-tight text-linear-text"
          >
            통화 상세
          </h2>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-linear-sm text-linear-text-muted transition-colors duration-micro ease-std hover:bg-linear-muted hover:text-linear-text"
            @click="close"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div class="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div class="grid grid-cols-3 gap-4">
            <div v-for="item in metaItems" :key="item.label" class="space-y-1">
              <p class="text-[12px] font-medium text-linear-text-muted">
                {{ item.label }}
              </p>
              <p class="text-[14px] font-medium text-linear-text">
                {{ item.value || '-' }}
              </p>
            </div>
          </div>

          <div
            v-if="categoryPath.length"
            class="flex flex-wrap items-center gap-1.5"
          >
            <template v-for="(name, index) in categoryPath" :key="name">
              <span
                class="rounded-linear-sm bg-linear-accent-subtle px-2 py-1 text-[12px] font-medium text-linear-accent"
              >
                {{ name }}
              </span>
              <span
                v-if="index < categoryPath.length - 1"
                class="text-linear-text-disabled"
              >
                /
              </span>
            </template>
          </div>

          <div class="space-y-2">
            <p class="text-[12px] font-medium text-linear-text-muted">
              통화 녹음
            </p>
            <AudioWavePlayer v-if="hasAudio" :src="call.audioUrl" />
            <div
              v-else
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
              통화 녹음 파일이 없습니다.
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-[12px] font-medium text-linear-text-muted">
              상담 요약
            </p>
            <p
              class="whitespace-pre-line text-[14px] leading-6 text-linear-text-secondary"
            >
              {{ summaryText }}
            </p>
          </div>

          <div class="grid grid-cols-4 gap-3">
            <div
              v-for="score in scores"
              :key="score.label"
              :class="`flex flex-col items-center gap-1 rounded-linear-md border px-3 py-3 ${score.accent ? 'border-linear-accent/30 bg-linear-accent-subtle' : 'border-linear-border bg-linear-surface'}`"
            >
              <p class="text-[12px] font-medium text-linear-text-muted">
                {{ score.label }}
              </p>
              <p
                :class="`font-inter text-[20px] font-semibold leading-7 tracking-tight ${score.accent ? 'text-linear-accent' : 'text-linear-text'}`"
              >
                {{ score.value ?? '-' }}
              </p>
              <p class="text-[11px] text-linear-text-disabled">
                / {{ score.max }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-[12px] font-medium text-linear-text-muted">
              통화 내용
            </p>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <p
                  class="text-[11px] font-medium uppercase tracking-wide text-linear-text-disabled"
                >
                  원본 텍스트
                </p>
                <p
                  class="h-[280px] overflow-y-auto whitespace-pre-line rounded-linear-md border border-linear-border bg-linear-surface px-4 py-3 text-[13px] leading-6 text-linear-text-secondary"
                >
                  {{ originalText }}
                </p>
              </div>
              <div class="space-y-1.5">
                <p
                  class="text-[11px] font-medium uppercase tracking-wide text-linear-accent"
                >
                  가공 텍스트
                </p>
                <p
                  class="h-[280px] overflow-y-auto whitespace-pre-line rounded-linear-md border border-linear-accent/30 bg-linear-accent-subtle px-4 py-3 text-[13px] leading-6 text-linear-text-secondary"
                >
                  {{ correctedText }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
