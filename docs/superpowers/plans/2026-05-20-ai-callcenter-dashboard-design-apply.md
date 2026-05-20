# AI 콜센터 대시보드 디자인 적용 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `docs/superpowers/specs/2026-05-20-ai-callcenter-dashboard-design.md`의 Linear 무드 + Motion 명세를 3개 화면(`/dashboard`, `/calls`, `/evaluation`)과 공통 레이아웃에 적용.

**Architecture:** Tailwind 토큰 → 글로벌 CSS → 폰트 → 공용 모듈/composables → 공용 컴포넌트 → 레이아웃 → 3개 뷰 순서로 in-place 적용. 페이지 구조·라우팅·API·Query 훅 변경 없음. 신규 npm 의존성 없음.

**Tech Stack:** Vue 3 (Composition API), Tailwind v3, ApexCharts v5, TanStack Vue Query, `@vuepic/vue-datepicker` (이미 설치됨).

**Project Conventions (CLAUDE.md 준수):**
- 절대경로 import (`@components`, `@views`, `@/lib`, `@/constants`)
- 템플릿 리터럴 클래스 바인딩 (배열 형식 금지)
- 매핑/상수는 `src/constants/`에 분리
- 주석 처리된 코드 남기지 않기 (Git history로 추적)
- **Commit은 사용자가 명시적으로 요청할 때만.** 각 Phase 끝의 commit step은 옵션이며, 사용자에게 시점 위임.

**Testing Strategy:** 이 프로젝트에는 unit test 셋업이 없음(vitest/jest 없음, test 스크립트 없음). 모든 검증은 `npm run dev`로 띄운 dev 서버에서 수동 시각 검증으로 수행. 각 task마다 "Visual verification" step에 어떤 화면의 무엇을 확인해야 하는지 명시.

---

## File Structure

### 신규 (Create)
| 경로 | 책임 |
|---|---|
| `src/lib/charts/apexBase.js` | ApexCharts 공통 옵션 (theme/easing/grid/tooltip 토큰 통일) |
| `src/lib/composables/common/useCountUp.js` | ref/숫자를 받아 0→target 카운트업하는 reactive 값 반환 |
| `src/lib/composables/common/useCursorSpotlight.js` | element에 mousemove 바인딩해 `--mx`/`--my` CSS 변수 업데이트 |
| `src/lib/composables/common/useStickyHeader.js` | 스크롤 컨테이너의 scrollTop 임계치 감지 → boolean ref |
| `src/components/common/CardBase.vue` | 새 무드의 카드 베이스. slot 기반, hoverable/interactive props 지원 |
| `src/components/common/KpiCard.vue` | label + counted value + unit + optional spotlight 합성 컴포넌트 |
| `src/components/common/AnimatedNumber.vue` | 숫자 ref 받아서 `useCountUp` + tabular-nums 렌더링 |

### 수정 (Modify)
| 경로 | 변경 |
|---|---|
| `tailwind.config.js` | 신규 namespace 토큰 (`linear` 네임스페이스), motion duration/easing util 추가 |
| `src/input.css` | motion CSS vars, focus ring, skeleton shimmer keyframe, reduced-motion 미디어쿼리, 기존 `button:hover { opacity: 0.8 }` 제거 |
| `index.html` | Inter, JetBrains Mono Google Fonts link 추가 |
| `src/components/layout/LayoutAuth.vue` | `<main>`을 sticky header blur용 scroll container로 마크, `<RouterView>`를 `<Transition>` 래핑 |
| `src/components/layout/components/HeaderAi.vue` | 60px 높이, 배경 blur 토글, 하단 1px border |
| `src/components/layout/components/LNBAi.vue` | 240px 너비, active 인디케이터 2px violet bar, hover bg-subtle |
| `src/components/common/DateRangePicker.vue` | 새 토큰으로 borders/colors 교체, 팝오버 fade-slide |
| `src/components/common/ButtonBase.vue` | (touch only if used in target views) 새 variant 색상 |
| `src/views/AiDashboardView/AiDashboardView.vue` | CardBase·KpiCard 적용, stagger entrance, 카드 그리드 gap 24px |
| `src/views/AiDashboardView/components/AiStatCard.vue` | KpiCard로 대체 (얇은 래퍼만 유지) |
| `src/views/AiDashboardView/components/AiDailyCountLine.vue` | apexBase 적용, live data sim |
| `src/views/AiDashboardView/components/AiDailyScoreLine.vue` | apexBase 적용 |
| `src/views/AiDashboardView/components/AiCategoryDonut.vue` | apexBase 적용, donut hover pop |
| `src/views/AiEvaluationView/AiEvaluationView.vue` | CardBase 적용, stagger |
| `src/views/AiEvaluationView/components/AiScoreCard.vue` | 새 무드 (CardBase 래핑, AnimatedNumber, progress bar 토큰화) |
| `src/views/AiEvaluationView/components/AiDistributionBar.vue` | apexBase 적용, score-range palette |
| `src/views/AiCallsView/AiCallsView.vue` | CardBase 적용 |
| `src/views/AiCallsView/components/AiCallsSummary.vue` | 새 무드 (KpiCard 5개) |

### 보존 (Don't touch)
- 라우터, API, Query 훅, 데이터 흐름
- 기존 `TableView.vue` (스타일만 부분 override, 신규 컴포넌트 만들지 않음)
- `LayoutBase.vue`, `HeaderBase.vue`, `LNBBase.vue`
- 기존 apt-admin 관련 모든 뷰

---

## Phase A: 토큰 · 인프라

### Task 1: Tailwind config 토큰 확장

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: 신규 색·라운드·모션 토큰 추가**

`tailwind.config.js`의 `theme.extend` 블록을 찾아 다음을 추가 (기존 colors/extend는 보존, 같은 키에 머지). `linear` 네임스페이스를 사용해 기존 토큰과 충돌 회피.

```js
theme: {
  extend: {
    colors: {
      // 기존 토큰들 보존 ...
      linear: {
        bg: '#FFFFFF',
        surface: '#F9FAFB',
        muted: '#F4F5F8',
        border: '#E5E7EB',
        'border-strong': '#D4D8DD',
        text: '#08090A',
        'text-secondary': '#3D424A',
        'text-muted': '#6C727E',
        'text-disabled': '#9CA3AF',
        accent: '#5E6AD2',
        'accent-hover': '#4F5BC9',
        'accent-subtle': '#EEF0FB',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      // 차트 카테고리 팔레트
      chart: {
        1: '#5E6AD2',
        2: '#3B82F6',
        3: '#10B981',
        4: '#F59E0B',
        5: '#EF4444',
        6: '#8B5CF6',
        7: '#14B8A6',
        8: '#6B7280',
      },
      // 점수 구간 팔레트
      score: {
        'under-70': '#EF4444',
        '70-74': '#F87171',
        '75-79': '#F59E0B',
        '80-84': '#FBBF24',
        '85-89': '#34D399',
        '90-94': '#10B981',
        '95-100': '#059669',
      },
    },
    borderRadius: {
      // 기존 보존, 신규 추가
      'linear-sm': '6px',
      'linear-md': '8px',
      'linear-lg': '12px',
    },
    fontFamily: {
      inter: ['Inter', 'Pretendard', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
    transitionDuration: {
      micro: '150ms',
      transition: '250ms',
      page: '350ms',
      data: '700ms',
    },
    transitionTimingFunction: {
      'ease-out-quint': 'cubic-bezier(0.16, 1, 0.3, 1)',
      'ease-in-quint': 'cubic-bezier(0.7, 0, 0.84, 0)',
      'ease-std': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    boxShadow: {
      'linear-card': '0 1px 2px rgba(8, 9, 10, 0.04)',
      'linear-card-hover': '0 2px 6px rgba(8, 9, 10, 0.06)',
      'linear-popover':
        '0 4px 12px rgba(8, 9, 10, 0.08), 0 0 0 1px #E5E7EB',
      'linear-modal': '0 16px 48px rgba(8, 9, 10, 0.12)',
      'linear-focus': '0 0 0 4px rgba(94, 106, 210, 0.12)',
    },
    keyframes: {
      'shimmer': {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
      },
      'fade-up': {
        '0%': { opacity: '0', transform: 'translateY(8px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'fade-slide': {
        '0%': { opacity: '0', transform: 'translateY(-6px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'accent-pulse': {
        '0%, 100%': { boxShadow: '0 0 0 0 rgba(94, 106, 210, 0)' },
        '50%': { boxShadow: '0 0 0 6px rgba(94, 106, 210, 0.08)' },
      },
    },
    animation: {
      'shimmer': 'shimmer 1.4s linear infinite',
      'fade-up': 'fade-up 350ms cubic-bezier(0.16, 1, 0.3, 1) both',
      'fade-slide': 'fade-slide 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
      'accent-pulse': 'accent-pulse 1.6s ease-in-out infinite',
    },
  },
},
```

- [ ] **Step 2: dev 서버 재시작 후 컴파일 확인**

`npm run dev` 다시 시작. tailwind 빌드 에러 없는지 확인 (config 변경은 HMR 안 됨).

- [ ] **Step 3: (옵션) commit**

```bash
git add tailwind.config.js
git commit -m "feat: add linear-mood design tokens to tailwind"
```

---

### Task 2: 글로벌 CSS 추가 (input.css)

**Files:**
- Modify: `src/input.css`

- [ ] **Step 1: 기존 `button:hover { opacity: 0.8 }` 제거**

이 글로벌 룰이 새 무드와 충돌(Linear는 hover에 opacity 사용 안 함). 다음 블록 삭제:

```css
button:hover {
  opacity: 0.8;
}
```

- [ ] **Step 2: motion 변수, focus ring 헬퍼, skeleton shimmer, reduced-motion 추가**

`@tailwind utilities;` 줄 바로 다음에 추가:

```css
@layer base {
  :root {
    --motion-micro: 150ms;
    --motion-transition: 250ms;
    --motion-page: 350ms;
    --motion-data: 700ms;
    --ease-out-quint: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-quint: cubic-bezier(0.7, 0, 0.84, 0);
    --ease-std: cubic-bezier(0.4, 0, 0.2, 1);
    --stagger-step: 40ms;
  }

  *,
  *::before,
  *::after {
    transition-timing-function: var(--ease-std);
  }
}

@layer utilities {
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  .focus-ring:focus-visible {
    outline: 2px solid #5e6ad2;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(94, 106, 210, 0.12);
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      #f4f5f8 0%,
      #ecedf1 50%,
      #f4f5f8 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s linear infinite;
  }

  .spotlight {
    position: relative;
    overflow: hidden;
  }

  .spotlight::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      300px circle at var(--mx, 50%) var(--my, 50%),
      rgba(94, 106, 210, 0.05),
      transparent 40%
    );
    opacity: 0;
    transition: opacity var(--motion-transition) var(--ease-std);
  }

  .spotlight:hover::before {
    opacity: 1;
  }

  .stagger-item {
    opacity: 0;
    animation: fade-up var(--motion-page) var(--ease-out-quint) both;
    animation-delay: calc(var(--i, 0) * var(--stagger-step));
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Visual verification**

dev 서버에서 임의 페이지의 버튼 hover를 확인 → opacity 0.8로 흐려지지 않아야 함.

- [ ] **Step 4: (옵션) commit**

---

### Task 3: 폰트 로드 (Inter, JetBrains Mono)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: `<head>` 안에 Google Fonts link 추가**

기존 `<head>` 안 다른 link 옆에:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 2: Visual verification**

dev 서버에서 임의 KPI 카드 위에 다음 CSS를 임시로 적용해 폰트 변경 시각화 (devtools `font-family: 'Inter'`로 변경) → 산세리프 글자 모양이 바뀌어야 함.

- [ ] **Step 3: (옵션) commit**

---

## Phase B: 공용 모듈

### Task 4: ApexCharts 공통 옵션 모듈

**Files:**
- Create: `src/lib/charts/apexBase.js`

- [ ] **Step 1: 파일 작성**

```js
// 모든 ApexCharts 컴포넌트가 공유하는 기본 옵션
// 사용: { ...apexBase, ...localOptions }
export const apexBase = {
  chart: {
    fontFamily: "'Inter', 'Pretendard', sans-serif",
    foreColor: '#6C727E',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeout',
      speed: 700,
      animateGradually: { enabled: true, delay: 60 },
      dynamicAnimation: { enabled: true, speed: 350 },
    },
  },
  grid: {
    borderColor: '#F4F5F8',
    strokeDashArray: 0,
    padding: { left: 8, right: 8, top: 0, bottom: 0 },
  },
  xaxis: {
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { color: '#E5E7EB' },
    labels: {
      style: { fontSize: '12px', colors: '#6C727E' },
    },
  },
  yaxis: {
    labels: {
      style: { fontSize: '12px', colors: '#6C727E' },
    },
  },
  tooltip: {
    theme: 'light',
    style: { fontSize: '12px', fontFamily: "'Inter', 'Pretendard', sans-serif" },
  },
  dataLabels: { enabled: false },
  legend: {
    fontSize: '12px',
    fontFamily: "'Inter', 'Pretendard', sans-serif",
    labels: { colors: '#3D424A' },
    markers: { width: 8, height: 8, radius: 2 },
    itemMargin: { vertical: 4, horizontal: 8 },
  },
  stroke: { width: 2, curve: 'smooth' },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } },
  },
};

export const chartPalette = [
  '#5E6AD2',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#14B8A6',
  '#6B7280',
];

export const scorePalette = [
  '#EF4444', // under_70
  '#F87171', // 70_74
  '#F59E0B', // 75_79
  '#FBBF24', // 80_84
  '#34D399', // 85_89
  '#10B981', // 90_94
  '#059669', // 95_100
];

// 깊은 머지 헬퍼 (apexBase + 로컬 옵션 합칠 때)
export const mergeChartOptions = (base, override) => {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = { ...base[key], ...override[key] };
    } else {
      result[key] = override[key];
    }
  }
  return result;
};
```

- [ ] **Step 2: (옵션) commit**

---

### Task 5: useCountUp composable

**Files:**
- Create: `src/lib/composables/common/useCountUp.js`

- [ ] **Step 1: 파일 작성**

```js
import { ref, watch, onUnmounted } from 'vue';

// targetRef(number ref) → 0에서 target까지 카운트업되는 display ref 반환
// options: { duration = 800, decimals = 0 }
const useCountUp = (targetRef, { duration = 800, decimals = 0 } = {}) => {
  const display = ref(0);
  let rafId = null;
  let startTime = null;
  let startValue = 0;

  const ease = (t) => 1 - Math.pow(1 - t, 4); // ease-out-quart

  const tick = (now) => {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = ease(progress);
    const current = startValue + (targetRef.value - startValue) * eased;
    display.value = decimals > 0
      ? Number(current.toFixed(decimals))
      : Math.round(current);
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const start = () => {
    if (rafId) cancelAnimationFrame(rafId);
    startTime = null;
    startValue = display.value;
    rafId = requestAnimationFrame(tick);
  };

  watch(
    targetRef,
    (newValue, oldValue) => {
      if (newValue === oldValue) return;
      if (typeof newValue !== 'number' || isNaN(newValue)) {
        display.value = 0;
        return;
      }
      start();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  return display;
};

export default useCountUp;
```

- [ ] **Step 2: (옵션) commit**

---

### Task 6: useCursorSpotlight composable

**Files:**
- Create: `src/lib/composables/common/useCursorSpotlight.js`

- [ ] **Step 1: 파일 작성**

```js
import { onMounted, onUnmounted } from 'vue';

// elementRef에 mousemove 바인딩, CSS 변수 --mx/--my를 px 단위로 업데이트
const useCursorSpotlight = (elementRef) => {
  const handleMove = (e) => {
    const el = elementRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  onMounted(() => {
    const el = elementRef.value;
    if (!el) return;
    el.addEventListener('mousemove', handleMove);
  });

  onUnmounted(() => {
    const el = elementRef.value;
    if (!el) return;
    el.removeEventListener('mousemove', handleMove);
  });
};

export default useCursorSpotlight;
```

- [ ] **Step 2: (옵션) commit**

---

### Task 7: useStickyHeader composable

**Files:**
- Create: `src/lib/composables/common/useStickyHeader.js`

- [ ] **Step 1: 파일 작성**

```js
import { ref, onMounted, onUnmounted } from 'vue';

// 스크롤 컨테이너 요소의 scrollTop이 threshold를 넘으면 isScrolled = true
const useStickyHeader = (scrollContainerRef, threshold = 8) => {
  const isScrolled = ref(false);

  const handleScroll = () => {
    const el = scrollContainerRef.value;
    if (!el) return;
    isScrolled.value = el.scrollTop > threshold;
  };

  onMounted(() => {
    const el = scrollContainerRef.value;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });

  onUnmounted(() => {
    const el = scrollContainerRef.value;
    if (!el) return;
    el.removeEventListener('scroll', handleScroll);
  });

  return { isScrolled };
};

export default useStickyHeader;
```

- [ ] **Step 2: (옵션) commit**

---

### Task 8: CardBase 컴포넌트

**Files:**
- Create: `src/components/common/CardBase.vue`

- [ ] **Step 1: 파일 작성**

```vue
<script setup>
  defineProps({
    padding: {
      type: String,
      default: 'default', // 'default' (20px) | 'compact' (16px) | 'flush' (0)
      validator: (v) => ['default', 'compact', 'flush'].includes(v),
    },
    interactive: {
      type: Boolean,
      default: false,
    },
    spotlight: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <div
    :class="`
      relative rounded-linear-md border border-linear-border bg-linear-bg
      shadow-linear-card transition-all duration-micro ease-std
      ${padding === 'default' ? 'p-5' : padding === 'compact' ? 'p-4' : 'p-0'}
      ${interactive ? 'cursor-pointer hover:border-linear-border-strong hover:shadow-linear-card-hover' : ''}
      ${spotlight ? 'spotlight' : ''}
    `"
  >
    <slot />
  </div>
</template>
```

- [ ] **Step 2: (옵션) commit**

---

### Task 9: AnimatedNumber 컴포넌트

**Files:**
- Create: `src/components/common/AnimatedNumber.vue`

- [ ] **Step 1: 파일 작성**

```vue
<script setup>
  import { computed, toRef } from 'vue';

  import useCountUp from '@/lib/composables/common/useCountUp.js';

  const props = defineProps({
    value: {
      type: Number,
      required: true,
    },
    decimals: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 800,
    },
  });

  const targetRef = toRef(props, 'value');
  const display = useCountUp(targetRef, {
    duration: props.duration,
    decimals: props.decimals,
  });

  const formatted = computed(() => {
    return display.value.toLocaleString('ko-KR', {
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals,
    });
  });
</script>

<template>
  <span class="tabular-nums">{{ formatted }}</span>
</template>
```

- [ ] **Step 2: (옵션) commit**

---

### Task 10: KpiCard 컴포넌트

**Files:**
- Create: `src/components/common/KpiCard.vue`

- [ ] **Step 1: 파일 작성**

```vue
<script setup>
  import AnimatedNumber from '@components/common/AnimatedNumber.vue';
  import CardBase from '@components/common/CardBase.vue';
  import { ref } from 'vue';

  import useCursorSpotlight from '@/lib/composables/common/useCursorSpotlight.js';

  const props = defineProps({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, default: '' },
    decimals: { type: Number, default: 0 },
    pulse: { type: Boolean, default: false }, // 절제 적용 — KPI 1곳만
    interactive: { type: Boolean, default: false },
  });

  const cardRef = ref(null);
  useCursorSpotlight(cardRef);
</script>

<template>
  <div ref="cardRef">
    <CardBase
      :interactive="props.interactive"
      spotlight
      :class="props.pulse ? 'animate-accent-pulse' : ''"
    >
      <div class="flex flex-col gap-2">
        <p class="text-[13px] font-medium text-linear-text-secondary">
          {{ props.label }}
        </p>
        <div class="flex items-baseline gap-1.5">
          <p
            class="font-inter text-[28px] font-semibold leading-9 tracking-tight text-linear-text"
          >
            <AnimatedNumber :value="props.value" :decimals="props.decimals" />
          </p>
          <span
            v-if="props.unit"
            class="text-[14px] font-medium text-linear-text-secondary"
          >
            {{ props.unit }}
          </span>
        </div>
      </div>
    </CardBase>
  </div>
</template>
```

- [ ] **Step 2: (옵션) commit**

---

## Phase C: 레이아웃

### Task 11: LayoutAuth — 스크롤 컨테이너 마크 + 라우트 트랜지션

**Files:**
- Modify: `src/components/layout/LayoutAuth.vue`

- [ ] **Step 1: scroll container ref 추가 + sticky header 연결**

전체 교체:

```vue
<script setup>
  import HeaderAi from '@components/layout/components/HeaderAi.vue';
  import LNBAi from '@components/layout/components/LNBAi.vue';
  import { ref } from 'vue';
  import { RouterView } from 'vue-router';

  import useStickyHeader from '@/lib/composables/common/useStickyHeader.js';
  import { useLnbStore } from '@/stores/lnb.js';

  const lnbStore = useLnbStore();
  const scrollContainer = ref(null);
  const { isScrolled } = useStickyHeader(scrollContainer, 8);
</script>

<template>
  <HeaderAi :is-scrolled="isScrolled" />
  <div class="mt-[60px] flex h-[calc(100%-60px)] w-full overflow-hidden">
    <div
      :class="`flex-shrink-0 overflow-hidden transition-all duration-transition ease-std ${lnbStore.isLNBVisible ? 'w-[240px]' : 'w-0'}`"
    >
      <LNBAi />
    </div>
    <main
      ref="scrollContainer"
      class="h-[calc(100vh-60px)] flex-1 overflow-y-auto bg-linear-bg px-8 py-8"
    >
      <RouterView v-slot="{ Component }">
        <Transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
  .route-fade-enter-active {
    transition:
      opacity 350ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .route-fade-leave-active {
    transition:
      opacity 150ms cubic-bezier(0.7, 0, 0.84, 0),
      transform 150ms cubic-bezier(0.7, 0, 0.84, 0);
  }

  .route-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }

  .route-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
```

- [ ] **Step 2: Visual verification**

LNB에서 메뉴 클릭해서 화면 전환 → 부드러운 fade-up 트랜지션 보여야 함.

- [ ] **Step 3: (옵션) commit**

---

### Task 12: HeaderAi — 60px 높이 + sticky blur

**Files:**
- Modify: `src/components/layout/components/HeaderAi.vue`
- Modify: `src/components/layout/components/HeaderBase.vue` (높이 60px로)

- [ ] **Step 1: HeaderBase 높이 조정**

기존 `h-16`(64px) → 60px로 조정. `HeaderBase.vue` 전체 교체:

```vue
<script setup>
  defineProps({
    blurred: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <div class="fixed left-0 top-0 z-50 w-full">
    <header
      :class="`
        mx-auto flex h-[60px] min-w-[1280px] max-w-[1920px] items-center
        justify-between gap-2 pl-3 pr-8 transition-all duration-transition ease-std
        ${blurred ? 'bg-white/80 backdrop-blur-md border-b border-linear-border' : 'bg-linear-bg border-b border-linear-border'}
      `"
    >
      <slot></slot>
    </header>
  </div>
</template>
```

- [ ] **Step 2: HeaderAi에 isScrolled prop 전달 + 타이틀 스타일 교체**

```vue
<script setup>
  import HeaderBase from '@components/layout/components/HeaderBase.vue';
  import LNBHamburgerButton from '@components/layout/components/LNBHamburgerButton.vue';

  defineProps({
    isScrolled: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <HeaderBase :blurred="isScrolled">
    <div class="flex items-center gap-3">
      <LNBHamburgerButton />
      <h1
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        AI 콜센터 분석
      </h1>
    </div>
  </HeaderBase>
</template>
```

- [ ] **Step 3: Visual verification**

페이지 스크롤 다운 → 헤더 배경에 미세한 blur 나타나야 함. 스크롤 업 → blur 사라짐.

- [ ] **Step 4: (옵션) commit**

---

### Task 13: LNBAi — 240px 슬림 + active indicator bar

**Files:**
- Modify: `src/components/layout/components/LNBAi.vue`
- Modify: `src/components/layout/components/LNBBase.vue` (너비 240px)

- [ ] **Step 1: LNBBase 너비 조정**

기존 `w-[266px]` → `w-[240px]`로:

```vue
<script setup></script>
<template>
  <nav
    class="h-full w-[240px] overflow-y-auto border-r border-linear-border bg-linear-bg"
  >
    <slot />
  </nav>
</template>
```

- [ ] **Step 2: LNBAi active indicator + 호버 정리**

```vue
<script setup>
  import LNBBase from '@components/layout/components/LNBBase.vue';

  import { AI_CALL_CENTER_LNB_MENU } from '@/constants/aiCallCenter.js';
  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const { navigateTo, getCurrentRoutePath } = useNavigate();

  const isActive = (path) => getCurrentRoutePath() === path;
</script>

<template>
  <LNBBase>
    <div class="px-3 py-4">
      <p
        class="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-linear-text-muted"
      >
        분석
      </p>
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in AI_CALL_CENTER_LNB_MENU" :key="item.path">
          <button
            type="button"
            :class="`
              relative flex w-full items-center px-4 py-2 text-left text-[14px] rounded-linear-sm
              transition-colors duration-micro ease-std
              ${
                isActive(item.path)
                  ? 'bg-linear-surface text-linear-text font-semibold'
                  : 'text-linear-text-secondary font-medium hover:bg-linear-surface hover:text-linear-text'
              }
            `"
            @click="navigateTo(item.path)"
          >
            <span
              v-if="isActive(item.path)"
              class="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-linear-accent"
              aria-hidden="true"
            ></span>
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </LNBBase>
</template>
```

- [ ] **Step 3: LayoutAuth의 LNB 너비 클래스도 240px로 맞춤 확인**

Task 11에서 이미 `w-[240px]`로 설정됨. 확인만.

- [ ] **Step 4: Visual verification**

LNB에서 메뉴 hover → 배경 살짝 변화. 메뉴 클릭 → 좌측에 2px 보라 바 등장. 화면 전환 시 바가 새 active 위치로 자연스럽게 이동.

- [ ] **Step 5: (옵션) commit**

---

### Task 14: DateRangePicker 스타일 교체

**Files:**
- Modify: `src/components/common/DateRangePicker.vue`

- [ ] **Step 1: 스타일만 새 토큰으로 교체 (인터페이스 보존)**

기존 props/emit 그대로. template 클래스만 교체:

```vue
<script setup>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { ref, watch } from 'vue';

  const props = defineProps({
    modelValue: { type: Array, required: false, default: () => [] },
    placeholder: { type: String, required: false, default: '기간 선택' },
    className: { type: String, required: false, default: 'w-[260px]' },
    maxDate: { type: Date, required: false, default: () => new Date() },
    minDate: { type: Date, required: false, default: null },
    disabled: { type: Boolean, required: false, default: false },
  });

  const emit = defineEmits(['update:modelValue', 'reset']);

  const localDateRange = ref(props.modelValue || []);

  const updateDate = (value) => {
    emit('update:modelValue', value);
  };

  const resetDate = () => {
    emit('reset');
  };

  watch(
    () => props.modelValue,
    (newValue) => {
      localDateRange.value = newValue || [];
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <VueDatePicker
    v-model="localDateRange"
    range
    locale="ko"
    :enable-time-picker="false"
    auto-apply
    :placeholder="placeholder"
    format="yyyy.MM.dd"
    model-type="yyyy-MM-dd"
    :class="`linear-dp ${className}`"
    :max-date="maxDate"
    :min-date="minDate"
    :disabled="disabled"
    @update:model-value="updateDate"
    @cleared="resetDate"
  />
</template>

<style scoped>
  .linear-dp :deep(.dp__input) {
    height: 36px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #ffffff;
    font-family: 'Inter', 'Pretendard', sans-serif;
    font-size: 13px;
    color: #08090a;
    transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .linear-dp :deep(.dp__input:hover) {
    border-color: #d4d8dd;
  }

  .linear-dp :deep(.dp__input:focus) {
    border-color: #5e6ad2;
    box-shadow: 0 0 0 4px rgba(94, 106, 210, 0.12);
    outline: none;
  }

  .linear-dp :deep(.dp__menu) {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow:
      0 4px 12px rgba(8, 9, 10, 0.08),
      0 0 0 1px #e5e7eb;
    animation: fade-slide 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .linear-dp :deep(.dp__active_date),
  .linear-dp :deep(.dp__range_end),
  .linear-dp :deep(.dp__range_start) {
    background: #5e6ad2;
    color: #ffffff;
  }

  .linear-dp :deep(.dp__range_between) {
    background: #eef0fb;
    color: #08090a;
  }

  @keyframes fade-slide {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

- [ ] **Step 2: Visual verification**

DateRangePicker 클릭 → 캘린더 팝오버가 fade-slide로 등장. 선택된 날짜 보라 배경. focus 시 입력란에 옅은 보라 ring.

- [ ] **Step 3: (옵션) commit**

---

## Phase D: 화면 적용

### Task 15: AiDashboardView — KpiCard·차트 적용

**Files:**
- Modify: `src/views/AiDashboardView/AiDashboardView.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import KpiCard from '@components/common/KpiCard.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import AiCategoryDonut from '@views/AiDashboardView/components/AiCategoryDonut.vue';
  import AiDailyCountLine from '@views/AiDashboardView/components/AiDailyCountLine.vue';
  import AiDailyScoreLine from '@views/AiDashboardView/components/AiDailyScoreLine.vue';
  import { computed } from 'vue';

  import { AI_DEFAULT_DATE_RANGE } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetAiDashboard from '@/lib/queries/aiCallCenter/useGetAiDashboard.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const { aiDashboard, isAiDashboardLoading } = useGetAiDashboard();

  const stats = computed(() => ({
    totalCount: aiDashboard.value?.total_count ?? 0,
    yesterdayCount: aiDashboard.value?.yesterday_count ?? 0,
    avgScore: aiDashboard.value?.avg_score ?? 0,
  }));

  const dailyCount = computed(
    () => aiDashboard.value?.daily_consultation_count || {},
  );
  const dailyScore = computed(() => aiDashboard.value?.daily_avg_score || {});
  const categoryCount = computed(() => aiDashboard.value?.category_count || {});
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-end justify-between">
      <div class="space-y-1">
        <h1
          class="font-inter text-[24px] font-semibold tracking-tight text-linear-text"
        >
          대시보드
        </h1>
        <p class="text-[14px] text-linear-text-muted">
          기간별 상담 통계를 한눈에 확인합니다.
        </p>
      </div>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div v-if="isAiDashboardLoading" class="space-y-6">
      <div class="grid grid-cols-3 gap-6">
        <SkeletonBase v-for="i in 3" :key="i" class="h-[112px] rounded-linear-md" />
      </div>
      <SkeletonBase class="h-[320px] rounded-linear-md" />
      <div class="grid grid-cols-2 gap-6">
        <SkeletonBase class="h-[320px] rounded-linear-md" />
        <SkeletonBase class="h-[320px] rounded-linear-md" />
      </div>
    </div>

    <template v-else>
      <div class="grid grid-cols-3 gap-6">
        <div class="stagger-item" :style="{ '--i': 0 }">
          <KpiCard
            label="기간 내 총 상담 건수"
            :value="stats.totalCount"
            unit="건"
            pulse
          />
        </div>
        <div class="stagger-item" :style="{ '--i': 1 }">
          <KpiCard label="어제 상담 건수" :value="stats.yesterdayCount" unit="건" />
        </div>
        <div class="stagger-item" :style="{ '--i': 2 }">
          <KpiCard
            label="기간 평균 종합 점수"
            :value="stats.avgScore"
            unit="점"
            :decimals="2"
          />
        </div>
      </div>

      <div class="stagger-item" :style="{ '--i': 3 }">
        <AiDailyCountLine :data="dailyCount" />
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="stagger-item" :style="{ '--i': 4 }">
          <AiDailyScoreLine :data="dailyScore" />
        </div>
        <div class="stagger-item" :style="{ '--i': 5 }">
          <AiCategoryDonut :data="categoryCount" />
        </div>
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 2: Visual verification**

`/dashboard` 진입 → 카드들이 시간차 등장(stagger). 첫 KPI 카드는 미세하게 pulse. KPI 숫자는 0에서 실제값까지 카운트업. KPI 카드 hover 시 옅은 보라 spotlight가 마우스를 따라옴.

- [ ] **Step 3: (옵션) commit**

---

### Task 16: AiStatCard 폐지 / 정리

**Files:**
- 삭제: `src/views/AiDashboardView/components/AiStatCard.vue` (KpiCard가 대체)

- [ ] **Step 1: 파일 삭제**

```bash
rm "src/views/AiDashboardView/components/AiStatCard.vue"
```

(이미 Task 15에서 import 제거됨)

- [ ] **Step 2: dev 서버에서 import 누락 에러 없는지 확인**

- [ ] **Step 3: (옵션) commit**

---

### Task 17: AiDailyCountLine — apexBase + live data sim

**Files:**
- Modify: `src/views/AiDashboardView/components/AiDailyCountLine.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import ApexCharts from 'apexcharts';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

  import { apexBase, chartPalette, mergeChartOptions } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;
  let simInterval = null;

  const seriesData = computed(() => {
    const entries = Object.entries(props.data).sort(([a], [b]) => a.localeCompare(b));
    return entries.map(([date, count]) => ({ x: date, y: count }));
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: [{ name: '상담 건수', data: seriesData.value }],
      chart: {
        ...apexBase.chart,
        type: 'line',
        height: 280,
        group: 'dashboard-lines',
        id: 'daily-count',
      },
      colors: [chartPalette[0]],
      stroke: { curve: 'smooth', width: 2.5 },
      markers: { size: 0, hover: { size: 5 } },
      yaxis: {
        ...apexBase.yaxis,
        title: { text: '건수', style: { fontSize: '12px', color: '#6C727E' } },
        labels: {
          ...apexBase.yaxis.labels,
          formatter: (val) => Math.round(val).toString(),
        },
      },
      tooltip: {
        ...apexBase.tooltip,
        y: { formatter: (val) => `${val}건` },
      },
    });

  const startLiveSim = () => {
    // 마지막 포인트에 ±5% 노이즈 (시연용)
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    simInterval = setInterval(() => {
      if (!chart || seriesData.value.length === 0) return;
      const data = [...seriesData.value];
      const last = data[data.length - 1];
      const noise = Math.round(last.y * (Math.random() * 0.1 - 0.05));
      data[data.length - 1] = { x: last.x, y: Math.max(0, last.y + noise) };
      chart.updateSeries([{ name: '상담 건수', data }], false);
    }, 1500);
  };

  onMounted(() => {
    if (!chartRef.value) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render().then(() => startLiveSim());
  });

  onUnmounted(() => {
    if (simInterval) clearInterval(simInterval);
    if (chart) chart.destroy();
  });

  watch(seriesData, (newData) => {
    if (chart) chart.updateSeries([{ name: '상담 건수', data: newData }]);
  });
</script>

<template>
  <CardBase>
    <div class="space-y-4">
      <h2
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        일자별 상담 건수
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
```

- [ ] **Step 2: Visual verification**

대시보드 접속 → 라인 차트가 좌→우로 그려지는 entrance. 마지막 포인트가 1.5초 간격으로 미세 변동. tooltip hover 시 부드러운 fade.

- [ ] **Step 3: (옵션) commit**

---

### Task 18: AiDailyScoreLine — apexBase 적용 + 그룹 sync

**Files:**
- Modify: `src/views/AiDashboardView/components/AiDailyScoreLine.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import ApexCharts from 'apexcharts';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

  import { apexBase, chartPalette, mergeChartOptions } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  const seriesData = computed(() => {
    const entries = Object.entries(props.data).sort(([a], [b]) => a.localeCompare(b));
    return entries.map(([date, score]) => ({ x: date, y: Number(score) }));
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: [{ name: '평균 종합점수', data: seriesData.value }],
      chart: {
        ...apexBase.chart,
        type: 'line',
        height: 280,
        group: 'dashboard-lines',
        id: 'daily-score',
      },
      colors: [chartPalette[2]], // emerald
      stroke: { curve: 'smooth', width: 2.5 },
      markers: { size: 0, hover: { size: 5 } },
      yaxis: {
        ...apexBase.yaxis,
        min: 0,
        max: 100,
        title: { text: '점수', style: { fontSize: '12px', color: '#6C727E' } },
      },
      tooltip: {
        ...apexBase.tooltip,
        y: { formatter: (val) => `${val.toFixed(2)}점` },
      },
    });

  onMounted(() => {
    if (!chartRef.value) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render();
  });

  onUnmounted(() => {
    if (chart) chart.destroy();
  });

  watch(seriesData, (newData) => {
    if (chart) chart.updateSeries([{ name: '평균 종합점수', data: newData }]);
  });
</script>

<template>
  <CardBase>
    <div class="space-y-4">
      <h2
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        일자별 평균 점수
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
```

- [ ] **Step 2: Visual verification**

위 일자별 상담 건수 라인 hover → 세로 가이드 라인이 같이 따라옴 (group sync).

- [ ] **Step 3: (옵션) commit**

---

### Task 19: AiCategoryDonut — apexBase + hover pop

**Files:**
- Modify: `src/views/AiDashboardView/components/AiCategoryDonut.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import ApexCharts from 'apexcharts';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

  import { apexBase, chartPalette, mergeChartOptions } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  const formatted = computed(() => {
    const entries = Object.entries(props.data).sort(([, a], [, b]) => b - a);
    return {
      labels: entries.map(([label]) => label),
      series: entries.map(([, count]) => count),
    };
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: formatted.value.series,
      labels: formatted.value.labels,
      chart: { ...apexBase.chart, type: 'donut', height: 280 },
      colors: chartPalette,
      stroke: { width: 2, colors: ['#FFFFFF'] },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            size: '60%',
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: false,
                label: '총',
                fontSize: '12px',
                fontFamily: "'Inter', 'Pretendard', sans-serif",
                color: '#6C727E',
                formatter: (w) =>
                  w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString(),
              },
              value: {
                fontSize: '20px',
                fontFamily: "'Inter', 'Pretendard', sans-serif",
                color: '#08090A',
                fontWeight: 600,
              },
            },
          },
        },
      },
      legend: {
        ...apexBase.legend,
        position: 'right',
        offsetY: 16,
      },
      tooltip: {
        ...apexBase.tooltip,
        y: { formatter: (val) => `${val}건` },
      },
    });

  onMounted(() => {
    if (!chartRef.value) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render();
  });

  onUnmounted(() => {
    if (chart) chart.destroy();
  });

  watch(formatted, (newValue) => {
    if (chart) {
      chart.updateOptions({
        series: newValue.series,
        labels: newValue.labels,
      });
    }
  });
</script>

<template>
  <CardBase>
    <div class="space-y-4">
      <h2
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        대분류별 상담 분포
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
```

- [ ] **Step 2: Visual verification**

도넛 segment hover → 살짝 바깥으로 확장. 중앙에 총합 표시. 클릭 → expandOnClick 활성.

- [ ] **Step 3: (옵션) commit**

---

### Task 20: AiEvaluationView — CardBase + stagger 적용

**Files:**
- Modify: `src/views/AiEvaluationView/AiEvaluationView.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import AiDistributionBar from '@views/AiEvaluationView/components/AiDistributionBar.vue';
  import AiScoreCard from '@views/AiEvaluationView/components/AiScoreCard.vue';
  import { computed } from 'vue';

  import {
    AI_DEFAULT_DATE_RANGE,
    AI_EVALUATION_SCORE_CARDS,
  } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetAiEvaluation from '@/lib/queries/aiCallCenter/useGetAiEvaluation.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const { aiEvaluation, isAiEvaluationLoading } = useGetAiEvaluation();

  const scoreCardValues = computed(() => ({
    avgScoreTotal: aiEvaluation.value?.avg_score_total ?? 0,
    avgScoreSpeed: aiEvaluation.value?.avg_score_speed ?? 0,
    avgScoreAccuracy: aiEvaluation.value?.avg_score_accuracy ?? 0,
    avgScoreProfessionalism: aiEvaluation.value?.avg_score_professionalism ?? 0,
  }));

  const totalCount = computed(() => aiEvaluation.value?.total_count ?? 0);
  const distribution = computed(() => aiEvaluation.value?.distribution || []);
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-end justify-between">
      <div class="space-y-1">
        <h1
          class="font-inter text-[24px] font-semibold tracking-tight text-linear-text"
        >
          품질평가
        </h1>
        <p class="text-[14px] text-linear-text-muted">
          기간별 평가 점수와 분포를 확인합니다.
        </p>
      </div>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div v-if="isAiEvaluationLoading" class="space-y-6">
      <SkeletonBase class="h-[88px] rounded-linear-md" />
      <div class="grid grid-cols-4 gap-6">
        <SkeletonBase v-for="i in 4" :key="i" class="h-[140px] rounded-linear-md" />
      </div>
      <SkeletonBase class="h-[360px] rounded-linear-md" />
    </div>

    <template v-else>
      <div class="stagger-item" :style="{ '--i': 0 }">
        <CardBase>
          <p class="text-[13px] font-medium text-linear-text-secondary">
            기간 내 평가 건수
          </p>
          <p
            class="font-inter text-[28px] font-semibold tracking-tight text-linear-text tabular-nums"
          >
            {{ totalCount.toLocaleString() }}건
          </p>
        </CardBase>
      </div>

      <div class="grid grid-cols-4 gap-6">
        <div
          v-for="(card, i) in AI_EVALUATION_SCORE_CARDS"
          :key="card.key"
          class="stagger-item"
          :style="{ '--i': i + 1 }"
        >
          <AiScoreCard
            :label="card.label"
            :value="scoreCardValues[card.key]"
            :max="card.max"
          />
        </div>
      </div>

      <div class="stagger-item" :style="{ '--i': 5 }">
        <AiDistributionBar :data="distribution" />
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 2: (옵션) commit**

---

### Task 21: AiScoreCard — 새 무드

**Files:**
- Modify: `src/views/AiEvaluationView/components/AiScoreCard.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import AnimatedNumber from '@components/common/AnimatedNumber.vue';
  import CardBase from '@components/common/CardBase.vue';
  import { computed } from 'vue';

  const props = defineProps({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    max: { type: Number, required: true },
  });

  const percent = computed(() =>
    Math.min(100, Math.max(0, (props.value / props.max) * 100)),
  );
</script>

<template>
  <CardBase>
    <div class="flex flex-col gap-4">
      <p class="text-[13px] font-medium text-linear-text-secondary">
        {{ props.label }}
      </p>
      <div class="flex items-baseline gap-1.5">
        <p
          class="font-inter text-[26px] font-semibold tracking-tight text-linear-text"
        >
          <AnimatedNumber :value="props.value" :decimals="2" />
        </p>
        <span class="text-[13px] font-medium text-linear-text-secondary">
          / {{ props.max }}
        </span>
      </div>
      <div class="h-1 w-full overflow-hidden rounded-full bg-linear-muted">
        <div
          class="h-full rounded-full bg-linear-accent transition-all duration-data ease-out-quint"
          :style="`width: ${percent}%`"
        ></div>
      </div>
    </div>
  </CardBase>
</template>
```

- [ ] **Step 2: Visual verification**

품질평가 화면 → 카드 4개 모두 카운트업 + progress bar가 0%에서 실제 %까지 천천히 부풀어 오름.

- [ ] **Step 3: (옵션) commit**

---

### Task 22: AiDistributionBar — apexBase + 점수 팔레트

**Files:**
- Modify: `src/views/AiEvaluationView/components/AiDistributionBar.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import ApexCharts from 'apexcharts';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

  import { AI_EVALUATION_SCORE_RANGES } from '@/constants/aiCallCenter.js';
  import { apexBase, mergeChartOptions, scorePalette } from '@/lib/charts/apexBase.js';

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });

  const chartRef = ref(null);
  let chart = null;

  const formatted = computed(() => {
    const lookup = new Map(props.data.map((item) => [item.range, item.count]));
    return AI_EVALUATION_SCORE_RANGES.map((r, i) => ({
      label: r.label,
      count: lookup.get(r.key) ?? 0,
      color: scorePalette[i],
    }));
  });

  const buildOptions = () =>
    mergeChartOptions(apexBase, {
      series: [
        {
          name: '콜 수',
          data: formatted.value.map((d) => ({
            x: d.label,
            y: d.count,
            fillColor: d.color,
          })),
        },
      ],
      chart: { ...apexBase.chart, type: 'bar', height: 320 },
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderRadiusApplication: 'end',
          columnWidth: '55%',
          distributed: true,
        },
      },
      colors: scorePalette,
      legend: { show: false },
      xaxis: {
        ...apexBase.xaxis,
        categories: formatted.value.map((d) => d.label),
      },
      yaxis: {
        ...apexBase.yaxis,
        title: { text: '콜 수', style: { fontSize: '12px', color: '#6C727E' } },
        labels: {
          ...apexBase.yaxis.labels,
          formatter: (val) => Math.round(val).toString(),
        },
      },
      tooltip: {
        ...apexBase.tooltip,
        y: { formatter: (val) => `${val}건` },
      },
    });

  onMounted(() => {
    if (!chartRef.value) return;
    chart = new ApexCharts(chartRef.value, buildOptions());
    chart.render();
  });

  onUnmounted(() => {
    if (chart) chart.destroy();
  });

  watch(formatted, (newValue) => {
    if (chart) {
      chart.updateOptions({
        series: [
          {
            name: '콜 수',
            data: newValue.map((d) => ({ x: d.label, y: d.count, fillColor: d.color })),
          },
        ],
        xaxis: { categories: newValue.map((d) => d.label) },
      });
    }
  });
</script>

<template>
  <CardBase>
    <div class="space-y-4">
      <h2
        class="font-inter text-[15px] font-semibold tracking-tight text-linear-text"
      >
        점수 구간별 분포
      </h2>
      <div ref="chartRef" class="w-full"></div>
    </div>
  </CardBase>
</template>
```

- [ ] **Step 2: Visual verification**

품질평가 페이지 → bar 차트가 아래→위로 grow. 각 막대 색이 score 팔레트(red → amber → emerald) 단계로 다름.

- [ ] **Step 3: (옵션) commit**

---

### Task 23: AiCallsView — 카드 적용

**Files:**
- Modify: `src/views/AiCallsView/AiCallsView.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import CardBase from '@components/common/CardBase.vue';
  import DateRangePicker from '@components/common/DateRangePicker.vue';
  import TableView from '@components/common/TableView.vue';
  import AiCallsSummary from '@views/AiCallsView/components/AiCallsSummary.vue';
  import { computed } from 'vue';

  import {
    AI_CALLS_TABLE_COLUMNS,
    AI_DEFAULT_DATE_RANGE,
  } from '@/constants/aiCallCenter.js';
  import useDateRangeRouteSync from '@/lib/composables/common/useDateRangeRouteSync.js';
  import useGetAiCalls from '@/lib/queries/aiCallCenter/useGetAiCalls.js';
  import decodeUrl from '@/lib/utils/decodeUrl.js';

  const { dateRange } = useDateRangeRouteSync(AI_DEFAULT_DATE_RANGE);

  const { aiCalls, isAiCallsLoading, isAiCallsError, aiCallsError } =
    useGetAiCalls();

  const summary = computed(() => ({
    count: aiCalls.value?.count ?? 0,
    avgScoreTotal: aiCalls.value?.avg_score_total ?? 0,
    avgScoreSpeed: aiCalls.value?.avg_score_speed ?? 0,
    avgScoreAccuracy: aiCalls.value?.avg_score_accuracy ?? 0,
    avgScoreProfessionalism: aiCalls.value?.avg_score_professionalism ?? 0,
  }));

  const tableData = computed(() => {
    const calls = aiCalls.value?.calls || [];
    const content = calls.map((call) => ({
      id: call.id,
      date: call.date,
      duration: call.duration,
      categoryMain: call.category_main,
      categorySub: call.category_sub,
      categoryDetail: call.category_detail,
      summary: call.summary,
      scoreSpeed: call.score_speed,
      scoreAccuracy: call.score_accuracy,
      scoreProfessionalism: call.score_professionalism,
      scoreTotal: call.score_total,
    }));

    return {
      content,
      totalElements: content.length,
    };
  });

  const renderCell = ({ key, row }) => {
    const value = row[key];

    if (value === null || value === undefined || value === '') return '-';

    if (key === 'duration') {
      return `${Number(value).toFixed(1)}초`;
    }

    if (key === 'summary' && typeof value === 'string') {
      return decodeUrl(value);
    }

    return value;
  };
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-end justify-between">
      <div class="space-y-1">
        <h1
          class="font-inter text-[24px] font-semibold tracking-tight text-linear-text"
        >
          상담기록
        </h1>
        <p class="text-[14px] text-linear-text-muted">
          기간별 상담 상세 내역과 평가 점수를 확인합니다.
        </p>
      </div>
      <DateRangePicker v-model="dateRange" />
    </div>

    <div class="stagger-item" :style="{ '--i': 0 }">
      <AiCallsSummary :summary="summary" :is-loading="isAiCallsLoading" />
    </div>

    <div class="stagger-item" :style="{ '--i': 1 }">
      <CardBase padding="flush">
        <TableView
          :column-data="AI_CALLS_TABLE_COLUMNS"
          :page-data="tableData"
          :selectable="false"
          :show-count="true"
          :pageable="false"
          :is-loading="isAiCallsLoading"
          :is-error="isAiCallsError"
          :error="aiCallsError"
        >
          <template #default="{ row, column }">
            {{ renderCell({ key: column.key, row }) }}
          </template>
        </TableView>
      </CardBase>
    </div>
  </div>
</template>
```

- [ ] **Step 2: (옵션) commit**

---

### Task 24: AiCallsSummary — KpiCard 5장

**Files:**
- Modify: `src/views/AiCallsView/components/AiCallsSummary.vue`

- [ ] **Step 1: 전체 교체**

```vue
<script setup>
  import KpiCard from '@components/common/KpiCard.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import { computed } from 'vue';

  const props = defineProps({
    summary: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  const cards = computed(() => [
    { label: '상담 건수', value: props.summary.count, unit: '건', decimals: 0 },
    { label: '종합 평균', value: props.summary.avgScoreTotal, unit: '점', decimals: 2 },
    { label: '신속성 평균', value: props.summary.avgScoreSpeed, unit: '점', decimals: 2 },
    { label: '정확성 평균', value: props.summary.avgScoreAccuracy, unit: '점', decimals: 2 },
    { label: '전문성 평균', value: props.summary.avgScoreProfessionalism, unit: '점', decimals: 2 },
  ]);
</script>

<template>
  <div v-if="isLoading" class="grid grid-cols-5 gap-6">
    <SkeletonBase v-for="i in 5" :key="i" class="h-[112px] rounded-linear-md" />
  </div>
  <div v-else class="grid grid-cols-5 gap-6">
    <KpiCard
      v-for="card in cards"
      :key="card.label"
      :label="card.label"
      :value="card.value"
      :unit="card.unit"
      :decimals="card.decimals"
    />
  </div>
</template>
```

- [ ] **Step 2: Visual verification**

상담기록 페이지 → KPI 5장이 카운트업. 각 카드 hover spotlight.

- [ ] **Step 3: (옵션) commit**

---

## Phase E: 검증

### Task 25: 통합 시각 검증

**No file changes. 사용자가 직접 dev 서버에서 확인하는 체크리스트.**

- [ ] **체크 1: 대시보드 페이지 (`/dashboard`)**
  - KPI 카드 3개가 시간차로 등장하며 숫자가 0에서 카운트업
  - 첫 번째 카드(총 상담건수)에 미세한 보라 pulse가 1.6초 간격으로 보임
  - 카드 위로 마우스 올리면 옅은 보라 spotlight가 마우스를 따라옴
  - 일자별 상담 건수 라인이 좌→우로 그려짐
  - 일자별 평균 점수 라인 위에 마우스 올리면 다른 라인 차트와 x축 동기화 (group sync)
  - 마지막 데이터 포인트가 1.5초 간격으로 미세하게 변동 (live sim)
  - 카테고리 도넛에서 segment hover 시 살짝 바깥으로 확장

- [ ] **체크 2: 품질평가 페이지 (`/evaluation`)**
  - 평가 건수 카드, 점수 카드 4개가 stagger 등장
  - 점수 카드 progress bar가 0% → 실제 %로 늘어남
  - 분포 바차트가 아래→위로 grow, 각 막대 색상이 점수에 따라 다름(red→emerald)

- [ ] **체크 3: 상담기록 페이지 (`/calls`)**
  - KPI 5장 카운트업
  - 테이블 헤더는 작은 uppercase 11px 글자, 회색조
  - 테이블 row hover 시 배경 옅게 변화 (zebra 없음)

- [ ] **체크 4: 라우트 전환**
  - LNB에서 메뉴 클릭 → fade-up 트랜지션, active 인디케이터 바가 새 위치로 이동
  - LNB 호버 시 부드러운 배경 변화

- [ ] **체크 5: 헤더 sticky blur**
  - 페이지를 스크롤다운 → 헤더 배경에 미세한 blur 적용
  - 스크롤업 → blur 사라짐

- [ ] **체크 6: DateRangePicker**
  - 입력란 focus → 보라 ring
  - 캘린더 팝오버가 fade-slide로 등장
  - 날짜 선택 → 보라 배경

- [ ] **체크 7: Reduced Motion**
  - OS 설정에서 "동작 줄이기" 활성화 (Windows: 설정 → 접근성 → 시각 효과 → 애니메이션 효과 OFF) 또는 Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`
  - 페이지 새로고침 → 모든 entrance·pulse·live sim이 즉시 표시되거나 비활성

- [ ] **체크 8: 콘솔 에러 없음**
  - F12 → Console 탭. 빨간 에러 없어야 함.

---

## 적용 후 정리 (선택)

- [ ] **TASK list 정리**: 기존 만든 #1–10 태스크 모두 completed. 새 작업용 task 만들 거면 plan task 단위로.
- [ ] **DESIGN.md spec 보강**: 시연 중 발견되는 디자인 조정사항을 spec에 반영
- [ ] **변경 commit 묶기**: 사용자가 원하면 Phase 단위로 묶어서 commit
