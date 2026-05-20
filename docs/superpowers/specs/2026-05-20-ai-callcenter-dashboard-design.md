# AI 콜센터 분석 대시보드 — DESIGN.md

**작성일:** 2026-05-20
**상태:** 승인 (적용 대기)
**기반:** VoltAgent/awesome-design-md `Linear` DESIGN.md 무드, AI 콜센터 분석 도메인·한국어 UI에 맞춤 재작성
**적용 대상:** `/dashboard`, `/calls`, `/evaluation` 3개 화면 + 공통 레이아웃(Header, LNB) + 공통 컴포넌트(카드, 버튼, 입력, 테이블, 차트)
**시연 목적:** 대표·부대표·임원진 대상 데모. 데이터 정확성보다 시각적 완성도·신뢰감 우선.

---

## 1. Visual Theme & Atmosphere

### 무드
**Editorial · data-dense · trustworthy.** Linear의 미니멀리즘을 차용한 B2B SaaS 분석 도구. 화려한 그라데이션·과한 색감 없이 정밀하게 정돈된 정보 밀도로 신뢰감을 전달한다.

### 디자인 철학
- **절제(Restraint)**: 한 화면에 보라 accent는 3회를 넘기지 않는다. 정보의 중요도가 색의 양으로 결정된다.
- **정렬(Alignment)**: 모든 숫자는 `tabular-nums`. 메트릭은 시각적으로 떨리지 않아야 한다.
- **단호한 경계(Crisp boundaries)**: 모든 경계선은 `1px solid`. 흐릿한 그림자나 두꺼운 보더는 사용하지 않는다.
- **호흡(Breathing)**: 모듈 사이 24px 이상, 카드 내부 패딩 16–20px. 정보가 많을수록 여백이 더 중요하다.
- **계층(Hierarchy)**: 색이 아닌 크기·굵기·간격으로 위계를 만든다. 색은 최후 수단.
- **움직임(Motion)**: 정적이지 않되 산만하지 않다. 모든 모션은 의미가 있어야 하며, 사용자의 주의를 유도하거나 상태 변화를 알리는 역할로만 쓴다 (10번 섹션 참조).

### 밀도
- **중간 밀도(Mid-density)**. 임원 시연 환경(빔프로젝터·1080p·약 2m 거리)을 가정. 기본 폰트 14px, 메트릭 28–32px.
- 단일 화면에 카드 3–5개, 차트 2–3개가 동시에 보이도록 설계.

---

## 2. Color Palette & Roles

모든 색상은 시멘틱 토큰으로 정의하고 컴포넌트는 토큰만 참조한다. Tailwind 기본 색 직접 사용 금지.

### Base Tokens

| Token | HEX | 역할 |
|---|---|---|
| `--color-bg-base` | `#FFFFFF` | 페이지 배경 |
| `--color-bg-subtle` | `#F9FAFB` | 카드 위 surface, hover row, table header |
| `--color-bg-muted` | `#F4F5F8` | input 비활성, code chip 배경 |
| `--color-border-default` | `#E5E7EB` | 카드/입력/divider 기본 경계 |
| `--color-border-strong` | `#D4D8DD` | 강조 경계 (focus 인접) |
| `--color-text-primary` | `#08090A` | 본문 / 헤딩 / 메트릭 |
| `--color-text-secondary` | `#3D424A` | 카드 label, 본문 보조 |
| `--color-text-muted` | `#6C727E` | caption, table header, axis 라벨 |
| `--color-text-disabled` | `#9CA3AF` | disabled 상태 |

### Accent (Brand)

| Token | HEX | 역할 |
|---|---|---|
| `--color-accent` | `#5E6AD2` | 메인 accent (active 메뉴 bar, primary 차트, link) |
| `--color-accent-hover` | `#4F5BC9` | accent hover |
| `--color-accent-subtle` | `#EEF0FB` | accent tinted background (selected row 등) |

### Semantic

| Token | HEX | 역할 |
|---|---|---|
| `--color-success` | `#10B981` | 긍정 지표 (점수 상승, 신속성 등) |
| `--color-warning` | `#F59E0B` | 주의 지표 (중간 점수 구간) |
| `--color-danger` | `#EF4444` | 부정 지표 (낮은 점수, 에러 메시지) |
| `--color-info` | `#3B82F6` | 보조 정보 (info badge) |

### Chart Palette (categorical, 분석 친화)
순서대로 사용. 5개 이상 카테고리부터는 채도를 낮춰 보조군으로 분리.

```
1. #5E6AD2  accent violet     (primary metric)
2. #3B82F6  blue              (secondary)
3. #10B981  emerald           (positive / success-tinted)
4. #F59E0B  amber             (warning-tinted)
5. #EF4444  red               (negative / outlier)
6. #8B5CF6  purple-400        (categorical-only)
7. #14B8A6  teal-500          (categorical-only)
8. #6B7280  gray-500          (residual / etc)
```

### Chart Scoring Palette (score-range, 순차)
품질평가의 점수 구간(under_70 → 95_100)에 적용. 낮음(red) → 중간(amber) → 높음(emerald) 그라디언트를 단계 색으로.

```
under_70  #EF4444
70_74     #F87171
75_79     #F59E0B
80_84     #FBBF24
85_89     #34D399
90_94     #10B981
95_100    #059669
```

---

## 3. Typography Rules

### Font Stack
- **한글 본문**: `Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif`
- **영문/숫자(메트릭·테이블)**: `Inter, Pretendard, sans-serif` — Inter는 메트릭·테이블·축 라벨에만 부분 적용
- **고정폭(코드·id·timestamp)**: `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace`

### Font 설치
- **Pretendard**: 이미 프로젝트에 적용 중 (기존 `.pretendard-*` 유틸 클래스 사용)
- **Inter**: 신규 설치 필요. `index.html`에 Google Fonts CDN 1줄 추가 (`<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`)
- **JetBrains Mono**: 신규 설치 필요. 위와 같은 방식으로 추가

### Weight 정책
- `400` (Regular), `500` (Medium), `600` (Semibold)만 사용
- `700` 이상 금지 — Linear 무드 유지. 임팩트는 크기·간격·색으로 표현
- italic 사용 금지

### Type Scale

| Token | Size / Line | Weight | 용도 |
|---|---|---|---|
| `display` | 32 / 40 | 600 | 페이지 메인 메트릭 (대시보드 상단 KPI) |
| `h1` | 24 / 32 | 600 | 페이지 타이틀 |
| `h2` | 18 / 28 | 600 | 카드/섹션 헤딩 |
| `h3` | 16 / 24 | 600 | 서브헤딩, 차트 타이틀 |
| `body-lg` | 15 / 24 | 400 | 카드 본문, 강조 텍스트 |
| `body` | 14 / 22 | 400 | 기본 본문, 테이블 셀 |
| `label` | 13 / 20 | 500 | 카드 label, 폼 라벨 |
| `caption` | 12 / 18 | 400 | 보조 캡션, axis 라벨 |
| `overline` | 11 / 16 | 500 | uppercase 11px, letter-spacing 0.04em, 테이블 헤더·grouping label |
| `mono` | 13 / 20 | 400 | id, timestamp, code |

### 숫자 규칙
- 모든 메트릭/테이블 점수/차트 축 라벨은 `font-variant-numeric: tabular-nums`
- 점수는 소수 둘째자리까지 (`82.50`), 정수형 카운트는 `toLocaleString('ko-KR')`
- 통화·점수 단위는 13px secondary 텍스트로 메트릭 옆 baseline 정렬

### Letter spacing
- `display` / `h1`: `-0.02em` (살짝 타이트)
- `h2` / `h3`: `-0.01em`
- `overline`: `+0.04em`
- 본문: 0

---

## 4. Component Stylings

### 4-1. Card

```
배경: bg-base
보더: 1px solid border-default
라운드: 8px
패딩: 20px (compact 카드는 16px)
그림자: card elevation (5번 섹션 참조)
헤더(있다면): label 13px / 500 / text-secondary, 헤더와 본문 사이 12px 간격
```

**Variants**
- `card-stat` (KPI 카드): label + 메트릭 1개 + (선택) 보조 라인 1개. 높이 약 112px.
- `card-chart`: 헤더 + 차트 영역. 차트 영역은 카드 패딩 안에서 좌우로 가득. 높이는 차트 따라.
- `card-flush`: 패딩 없는 카드. 테이블이 카드 안에 들어갈 때 사용.

**Hover**
- 클릭 가능한 카드만 hover 시 `border-default → border-strong`. 배경/그림자 변경 없음.

### 4-2. Button

| Variant | 배경 | 글자 | 보더 | hover | 비고 |
|---|---|---|---|---|---|
| `primary` | `#08090A` | `#FFFFFF` | none | bg `#1F2024` | 메인 CTA |
| `secondary` | `#FFFFFF` | `text-primary` | `1px border-default` | bg `bg-subtle` | 보조 액션 |
| `ghost` | transparent | `text-secondary` | none | bg `bg-subtle` | LNB·툴바 |
| `danger` | `#EF4444` | `#FFFFFF` | none | bg `#DC2626` | 삭제·취소 |

**규격**
- 사이즈: `sm` 28px · `md` 36px · `lg` 44px (기본 md)
- 패딩: `sm` 8px 12px · `md` 10px 16px · `lg` 12px 20px
- 라운드: `6px`
- 폰트: 14px / 500 / text-primary (variant별 위 표 참조)
- focus ring: `2px solid #5E6AD2` outline-offset 2px

### 4-3. Input

```
높이: 36px (기본), 44px (lg)
배경: bg-base
보더: 1px solid border-default
라운드: 6px
패딩: 0 12px
폰트: 14px / 400 / text-primary
placeholder: text-muted
focus: border-color → accent, ring 2px accent-subtle
disabled: bg-muted, text-disabled, cursor-not-allowed
```

**DateRangePicker**
- 외형은 input과 동일
- 캘린더 팝오버: 흰 배경 + `1px border-default` + `8px` 라운드 + popover elevation
- 선택된 날짜: 보라 accent 배경 + 흰 글자
- 호버: bg-subtle

### 4-4. Navigation

**Header**
- 높이 60px
- 배경: bg-base
- 보더: bottom `1px border-default`
- 좌측: 햄버거(32x32) + 16px gap + 타이틀(h2 사이즈 / 600)
- 우측: (시연용으로 비움. 후속 작업에서 사용자 메뉴 자리)

**LNB**
- 너비 240px (기존 266px 대비 슬림)
- 배경: bg-base (좌측 보더만, 별도 surface 없음)
- 보더: right `1px border-default`
- 메뉴 아이템:
  - 높이 36px, 좌측 패딩 16px, 우측 패딩 12px
  - 폰트 14px / 500 / text-secondary
  - hover: bg-subtle
  - active:
    - 배경 `bg-subtle`
    - 좌측에 `2px solid accent` 인디케이터 바
    - 글자 → text-primary, weight 600

### 4-5. Table

```
배경: bg-base
헤더 행: bg-subtle, height 40px
헤더 셀: overline 토큰 (11px / 500 / uppercase / text-muted / letter-spacing 0.04em)
바디 셀: 14px / 400 / text-primary, height 48px
보더: 가로 divider만 1px border-default. 세로 divider 없음.
hover row: bg-subtle
selected row: accent-subtle 배경
zebra 사용 안 함
```

**컬럼 정렬**
- 텍스트: left
- 숫자/점수: right (tabular-nums)
- 상태 chip: left

### 4-6. Chip / Badge

```
높이: 20px (sm), 24px (md)
라운드: full (pill) 또는 4px (rectangular). 토큰 노출용은 pill, 카운트는 rectangular
패딩: 0 8px (sm), 0 10px (md)
폰트: 12px / 500
```

**Variants**
- `chip-neutral`: bg `bg-subtle` / text-secondary
- `chip-accent`: bg `accent-subtle` / text `accent`
- `chip-success` / `chip-warning` / `chip-danger`: 각 semantic 색 8% 배경 + 100% 텍스트

### 4-7. Skeleton

```
배경: linear-gradient 90deg from #F4F5F8 0% to #ECEDF1 50% to #F4F5F8 100%
animation: shimmer 1.4s infinite linear
라운드: 6px
```

### 4-8. Tooltip / Popover

```
배경: bg-base
보더: 1px border-default
라운드: 6px
패딩: 8px 12px
폰트: 12px / 400 / text-primary
그림자: popover elevation
```

### 4-9. Chart 통일 규칙

**ApexCharts 공통 옵션**
```js
{
  chart: {
    fontFamily: "'Inter', 'Pretendard', sans-serif",
    toolbar: { show: false },
    foreColor: '#6C727E',
  },
  grid: {
    borderColor: '#F4F5F8',  // 매우 옅게
    strokeDashArray: 0,
    padding: { left: 8, right: 8 },
  },
  xaxis: {
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { color: '#E5E7EB' },
    labels: { style: { fontSize: '12px', colors: '#6C727E' } },
  },
  yaxis: {
    labels: { style: { fontSize: '12px', colors: '#6C727E' } },
  },
  tooltip: {
    theme: 'light',
    style: { fontSize: '12px', fontFamily: 'Inter, Pretendard, sans-serif' },
  },
  dataLabels: { enabled: false },
  legend: {
    fontSize: '12px',
    fontFamily: 'Inter, Pretendard, sans-serif',
    labels: { colors: '#3D424A' },
    markers: { width: 8, height: 8, radius: 2 },
  },
  stroke: { width: 2, curve: 'smooth' },
}
```

**차트 타입별**
- `line`: 굵기 2px, marker 미표시 (hover 시만), 부드러운 curve, 영역 채움 안 함
- `bar` / `column`: borderRadius 4px, columnWidth 55%, 그라데이션 없음 (단색)
- `donut`: hole size 60%, stroke 2px 흰색 분리선, dataLabels 없음, legend 우측

---

## 5. Layout Principles

### Spacing Scale (4 기반)
```
4   xs    아이콘 ↔ 텍스트, 인라인 칩 사이
8   sm    카드 내 label ↔ value, 인풋 좌우 패딩
12  md    카드 내 섹션 간, 버튼 간 gap
16  lg    카드 내부 패딩 (compact), 메뉴 아이템 좌우 패딩
20  xl    카드 내부 패딩 (default)
24  2xl   카드 사이 gap (대시보드 그리드)
32  3xl   페이지 섹션 사이
48  4xl   페이지 최상단 ↔ 첫 섹션
64  5xl   특수 (랜딩성 강조 영역)
```

### Grid
- 콘텐츠 max-width: 1440px, 좌우 32px 패딩
- 대시보드 카드 그리드: 12-col CSS grid, gap 24px
- KPI 카드 행: `grid-cols-3` (또는 4) 균등 분할
- 차트 행: 1 wide (full row) 또는 `grid-cols-2`

### Container 규칙
- 메인 콘텐츠 영역: `padding: 32px 32px` (페이지 상하좌우)
- 페이지 타이틀 ↔ 첫 카드: 24px
- 페이지 타이틀 우측 끝에 DateRangePicker 정렬 (baseline)

### 여백 철학
- "더 좁히고 싶은 욕구를 누른다." 정보 밀도가 높을수록 여백을 늘려 가독성을 보호한다.
- 카드 사이 16px 이하 금지. 시각적 그룹이 무너진다.
- 카드 내부 패딩 12px 이하 금지. 텍스트가 보더에 닿으면 안 된다.

---

## 6. Depth & Elevation

Linear 정체성: **그림자는 거의 보이지 않는다**. 깊이는 surface 색차이와 보더로 표현한다.

| Token | CSS | 사용처 |
|---|---|---|
| `elevation-none` | `none` | 기본 페이지 영역 |
| `elevation-card` | `0 1px 2px rgba(8, 9, 10, 0.04)` | 일반 카드 (거의 안 보임) |
| `elevation-card-hover` | `0 2px 6px rgba(8, 9, 10, 0.06)` | 클릭 가능 카드 hover |
| `elevation-popover` | `0 4px 12px rgba(8, 9, 10, 0.08), 0 0 0 1px #E5E7EB` | tooltip, dropdown, calendar |
| `elevation-modal` | `0 16px 48px rgba(8, 9, 10, 0.12)` | 모달 (지금은 사용 없음) |

### 금지
- `0 8px 16px` 이상 무거운 그림자 금지
- `box-shadow: inset` 금지
- 그라데이션 보더 금지

### Surface 계층
```
Level 0: bg-base       (페이지 배경)
Level 1: card on base  (단일 boder + 미세 그림자)
Level 2: popover       (boder + 약한 그림자)
Level 3: modal         (boder + 강한 그림자, 거의 사용 안 함)
```

---

## 7. Do's and Don'ts

### ✅ Do
- 모든 색은 토큰 경유 (`bg-base`, `text-primary` 등). Tailwind 직격 색(`text-gray-500`) 금지
- 메트릭/숫자에 `tabular-nums` 강제
- Border 1px만 사용. 두꺼운 보더가 필요해 보이면 색을 진하게 (border-strong)
- 빈 상태(empty state)는 짧은 한 줄 + 옅은 일러스트 없는 텍스트로
- 차트 색은 chart-palette 8색을 순서대로. 9번째부터는 회색조로 강등
- 한글은 Pretendard, 숫자/영문 메트릭은 Inter
- KPI 변화량(증감 화살표)은 데이터가 정확해진 시점부터 노출 — 지금은 자리만 비워둔다
- 모든 인터랙티브 요소에 focus ring (accent 2px outline-offset 2px)

### ❌ Don't
- 그라데이션 사용 (Stripe·Cursor 무드가 아님)
- 폰트 weight 700 이상 사용
- 화려한 색(네온, 핫핑크 등) 사용
- 색만으로 의미 전달 (라벨 항상 동반)
- 카드 안에 카드 (중첩 surface 금지). 필요하면 divider로 분리
- 1픽셀 미만 (0.5px) 보더. 한국어 환경 모니터 픽셀 정렬 문제
- 차트 toolbar (export, zoom 버튼) 노출 — 시연용이라 산만
- 정의되지 않은 hex 직접 입력 — 모두 토큰화

---

## 8. Responsive Behavior

### 타겟 환경
- **시연 환경(Primary)**: 1920×1080 빔프로젝터 또는 1440×900 노트북. min-width 1280px 고정. 모바일·태블릿 대응 안 함.
- **유저 환경(Secondary)**: 1280–1920px 데스크탑.

### 브레이크포인트
- `min-width: 1280px` — 모든 기능 노출 (기본)
- `min-width: 1600px` — KPI 카드 한 줄에 4개까지, 차트 2열
- `min-width: 1920px` — 콘텐츠 max-width 1440px로 중앙 정렬

### 축소 전략 (1280px 미만은 미지원이지만 깨지지 않게)
- LNB는 햄버거로 접힘 (기존 동작 유지)
- KPI 카드 행이 가로로 넘치면 그리드 2열로 wrap
- 차트는 가로 100% 유지, 높이 280–320px 고정

### 터치 타깃
- 시연용 데스크탑 환경이라 hover 가능 가정. 그러나 모든 클릭 가능 요소 최소 32×32 hit area 보장

---

## 9. Agent Prompt Guide

### 색상 빠른 참조 (복붙용)
```
bg-base          #FFFFFF
bg-subtle        #F9FAFB
bg-muted         #F4F5F8
border-default   #E5E7EB
border-strong    #D4D8DD
text-primary     #08090A
text-secondary   #3D424A
text-muted       #6C727E
accent           #5E6AD2
accent-hover     #4F5BC9
accent-subtle    #EEF0FB
success          #10B981
warning          #F59E0B
danger           #EF4444
info             #3B82F6
```

### 즉시 사용 가능한 프롬프트

**Tailwind 클래스 생성용**
```
"Linear-mood light theme. Background #FFFFFF, surface #F9FAFB.
Borders 1px solid #E5E7EB only. Text #08090A primary / #6C727E muted.
Accent #5E6AD2 used sparingly (≤3 instances per screen).
Use 4-based spacing scale (4/8/12/16/20/24/32). Round 6/8px.
Almost-invisible shadows. No gradients. No font-weight 700+.
Korean body: Pretendard. Numbers/metrics: Inter with tabular-nums."
```

**컴포넌트 만들 때 강령**
- "Editorial, data-dense, trustworthy."
- "If you reach for a gradient or weight 700, stop."
- "Color carries meaning only after label and size."
- "Numbers must not visually jitter — tabular-nums."

### Tailwind config 토큰 매핑 (적용 시 참조)

```js
colors: {
  base: { bg: '#FFFFFF', subtle: '#F9FAFB', muted: '#F4F5F8' },
  border: { DEFAULT: '#E5E7EB', strong: '#D4D8DD' },
  text: {
    primary: '#08090A', secondary: '#3D424A',
    muted: '#6C727E', disabled: '#9CA3AF',
  },
  accent: { DEFAULT: '#5E6AD2', hover: '#4F5BC9', subtle: '#EEF0FB' },
  success: '#10B981', warning: '#F59E0B',
  danger: '#EF4444', info: '#3B82F6',
}
```

---

## 10. Motion & Interactions

정적 무드 안에 살아있는 인상을 만든다. 모든 모션은 토큰화되어 일관성을 유지하며, `prefers-reduced-motion`을 존중한다.

### 10-1. Motion Tokens

```css
/* Duration */
--motion-micro:      150ms;  /* hover, press */
--motion-transition: 250ms;  /* dropdown, state change */
--motion-page:       350ms;  /* route transition */
--motion-data:       700ms;  /* chart entrance */

/* Easing */
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);    /* entrance */
--ease-in:     cubic-bezier(0.7, 0, 0.84, 0);    /* exit */
--ease-std:    cubic-bezier(0.4, 0, 0.2, 1);     /* interactive */

/* Stagger */
--stagger-step: 40ms;
--stagger-max:  6;
```

### 10-2. 채택 효과 (Adopted)

#### Micro-interactions
| 효과 | 적용 위치 | 구현 |
|---|---|---|
| Button press scale | 모든 버튼 | `active:scale-[0.98] transition-transform var(--motion-micro)` |
| Number counter | KPI 카드 메트릭 | `useCountUp` composable, 0→target, 800ms ease-out |
| Input clear | Input | clear 버튼 fade-in (`opacity` transition) |
| Tab indicator slide | (현재 화면엔 탭 없음, 가이드만) | active bar `transform: translateX` 슬라이드 |

#### Hover
| 효과 | 적용 위치 | 구현 |
|---|---|---|
| Border highlight | Card, Input | `hover:border-strong transition-colors var(--motion-micro)` |
| Bg shift | LNB 메뉴, Table row, Button(secondary/ghost) | `hover:bg-subtle transition-colors var(--motion-micro)` |
| Cursor spotlight | KPI 카드 한정 | CSS radial-gradient on mousemove, `--mx`/`--my` CSS 변수 사용 |
| Reveal action | KPI 카드 우측 화살표 | `opacity 0→1` + `translateX 4px→0` on hover |

#### Motion
| 효과 | 적용 위치 | 구현 |
|---|---|---|
| Page fade-up | 라우트 전환 | Vue `<Transition>` mode=out-in, `opacity 0→1 + translateY 8→0`, 350ms ease-out |
| Stagger entrance | 페이지 진입 시 카드들 | CSS `animation-delay: calc(var(--i) * var(--stagger-step))` |
| Popover slide-fade | DateRangePicker 캘린더, Tooltip | `opacity 0→1 + translateY -6→0`, 200ms |
| Skeleton→real cross | 로딩 완료 | skeleton fade-out 150ms ↔ content fade-in 250ms 살짝 overlap |

#### Glow
| 효과 | 적용 위치 | 구현 |
|---|---|---|
| Focus ring glow | 모든 입력/버튼 focus | `box-shadow: 0 0 0 4px rgba(94, 106, 210, 0.08)` |
| Cursor spotlight | KPI 카드 hover | `radial-gradient(circle at var(--mx) var(--my), rgba(94,106,210,0.05), transparent 40%)` |

#### Data Visualization
| 효과 | 적용 위치 | 구현 |
|---|---|---|
| Chart entrance — line | DailyCountLine, DailyScoreLine | ApexCharts `animations.speed: 800, easing: 'easeout'`, dynamicAnimation 활성 |
| Chart entrance — bar | DistributionBar | 동일, columns bottom→top |
| Chart entrance — donut | CategoryDonut | 동일, 각도 0→full |
| Tooltip smooth | 모든 차트 | ApexCharts 기본 + custom CSS transition |
| Series dim on hover | 추후 다중 series 차트 (지금은 단일 series 위주) | ApexCharts `chart.events.legendClick` 활용, opacity 30% |
| Animated counter | KPI 메트릭 | useCountUp composable |
| Cross-chart sync hover | 대시보드의 라인 2개 | ApexCharts `chart.group: 'dashboard-lines'` |

#### Scroll & Loading
| 효과 | 적용 위치 | 구현 |
|---|---|---|
| Sticky header blur | Header | `backdrop-filter: blur(8px)` on scroll detect (5px 이상 스크롤 시 클래스 부착) |
| Skeleton shimmer | 모든 skeleton | CSS animated linear-gradient |
| Progressive disclosure | 대시보드 로딩 | KPI 카드 먼저 표시, 차트는 데이터 도착 시 별도 fade-in |

### 10-3. 절제 적용 (1곳 한정)

| 효과 | 위치 | 구현 |
|---|---|---|
| Accent pulse | 대시보드의 "기간 내 총 상담 건수" KPI 한 곳 | 1.5s 간격 `box-shadow` 외부 ring scale 1→1.005, opacity 0.4→0 |
| Donut hover pop | CategoryDonut segment | ApexCharts `plotOptions.pie.expandOnClick: true` + custom hover handler로 4px 확장 |
| Live data sim | DailyCountLine 마지막 포인트 | setInterval 1.5s, 마지막 값에 ±5% 노이즈 (시연 한정. 운영 시 제거) |

### 10-4. 제외 (Linear 무드/시연 부적합)
- Parallax, Confetti, Magnetic buttons, Cursor follower(글로벌), Background ambient
- Glass morphism, Gradient border, Lottie icons
- Spring physics 외부 라이브러리 도입

### 10-5. Implementation Patterns

**CSS-only effects** (대부분):
- Tailwind transition util + custom CSS variable (`--motion-*`, `--ease-*`)
- `motion-safe:` / `motion-reduce:` prefix 사용

**Vue `<Transition>`** (페이지/팝오버):
- 라우터 전환에서 `<RouterView v-slot>` + `<Transition mode="out-in">`

**ApexCharts options 통일**:
- `src/lib/charts/apexBase.js`에 base options 정의. animations·tooltip·grid 등 공통 토큰 적용
- 모든 차트 컴포넌트가 `{ ...apexBase, ...localOptions }` 패턴

**Composables**:
- `useCountUp(targetRef, { duration: 800 })` — 숫자 카운트업
- `useCursorSpotlight(elementRef)` — `--mx`, `--my` CSS 변수 업데이트
- `useStickyHeader(scrollY)` — 스크롤 임계치 감지

### 10-6. Accessibility — Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- 모든 의도된 애니메이션은 `motion-safe:` prefix로 감싸 사용자 설정 시 즉시 표시되게 함
- `prefers-reduced-motion: reduce` 환경에선 chart entrance도 0ms로 (`animations.enabled: false`)
- Live data sim은 reduced-motion 환경에선 비활성

---

## Implementation Notes (구현 단계 가이드)

이 spec은 구현 plan(별도 문서)에서 다음 순서로 적용된다:

1. **Tailwind config 토큰 확장** — 위 색·간격·라운드·모션 토큰을 `tailwind.config.js`에 추가 (기존 토큰 보존, 신규 namespace)
2. **글로벌 CSS 추가** — `src/input.css`에 motion CSS 변수, `prefers-reduced-motion` 미디어쿼리, focus ring, skeleton shimmer keyframe 등 추가
3. **폰트 로드** — `index.html`에 Inter + JetBrains Mono Google Fonts link 추가
4. **차트 공통 옵션 모듈화** — `src/lib/charts/apexBase.js` 신규. 모든 ApexCharts 컴포넌트가 이를 spread하도록 변경
5. **공용 composables** — `src/lib/composables/common/` 아래:
   - `useCountUp.js` (KPI 숫자 카운트업)
   - `useCursorSpotlight.js` (마우스 추적 CSS 변수)
   - `useStickyHeader.js` (스크롤 임계 감지)
6. **공통 컴포넌트 정리** — `src/components/common/` 아래 신규/교체:
   - `CardBase.vue` (신규, 모든 카드의 베이스)
   - `KpiCard.vue` (신규, 메트릭 카드 + 카운트업 + 옵션 spotlight)
   - 기존 `ButtonBase.vue`, `DateRangePicker.vue` 스타일 교체
7. **레이아웃** — `HeaderAi.vue`(blur on scroll), `LNBAi.vue`(active indicator bar) 스타일 교체
8. **3개 뷰** — KPI/차트/테이블 카드를 새 `CardBase`/`KpiCard`/토큰으로 교체, stagger entrance 적용
9. **라우터 전환 효과** — `App.vue` 또는 `LayoutAuth.vue`에 Vue `<Transition mode="out-in">` 적용
10. **검증** — `npm run dev`로 3개 화면 시각 검증, reduced-motion 토글 테스트, 사용자 직접 확인

### 변경하지 않는 것
- 라우팅 구조
- API 호출/Query 훅
- 데이터 흐름
- 페이지별 위젯 배치 (KPI 3 → 차트 → 분포 순서 유지)

### 후속 작업으로 미루는 것
- 다크 모드 토큰
- 모바일/태블릿 대응
- 모달·드롭다운·노티 토스트의 새 무드 적용 (지금 화면에 없음)
- KPI 증감 인디케이터 (데이터 정확해진 후)
