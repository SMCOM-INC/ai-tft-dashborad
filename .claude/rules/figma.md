# Figma 디자인 → 코드 생성 워크플로우

이 문서는 Figma 디자인을 기반으로 UI 명세를 작성하고, 명세를 기반으로 퍼블리싱 코드를 생성하는 워크플로우를 설명합니다.

## Phase 1: Figma 노드 분석 및 명세 작성

### 1-1. Figma URL에서 정보 추출

Figma URL 형식:

```
https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}
```

예시:

```
https://www.figma.com/design/tB6atKrvAx2GMD4bg8x5Kw/ReviewCopy_Admin...?node-id=1082249-10750
```

추출 정보:

- `fileKey`: `tB6atKrvAx2GMD4bg8x5Kw`
- `nodeId`: `1082249:10750` (하이픈을 콜론으로 변환)

### 1-2. Figma 도구 사용

```javascript
// 1. 스크린샷 가져오기
mcp__figma__get_screenshot({
  fileKey: 'tB6atKrvAx2GMD4bg8x5Kw',
  nodeId: '1082249:10750',
  clientLanguages: 'javascript,html,css',
  clientFrameworks: 'vue',
});

// 2. 메타데이터 확인
mcp__figma__get_metadata({
  fileKey: 'tB6atKrvAx2GMD4bg8x5Kw',
  nodeId: '1082249:10750',
  clientLanguages: 'javascript,html,css',
  clientFrameworks: 'vue',
});

// 3. 디자인 컨텍스트 가져오기 (코드 생성 시)
mcp__figma__get_design_context({
  fileKey: 'tB6atKrvAx2GMD4bg8x5Kw',
  nodeId: '1082249:10750',
  clientLanguages: 'javascript,html,css',
  clientFrameworks: 'vue',
});
```

### 1-3. 명세 작성 항목

사용자 요청 시 다음 항목을 포함한 명세를 작성합니다:

```markdown
# [화면명] - UI 명세서

## 1. 화면/상태 요약

- 화면 유형 (리스트/상세/모달/상태변형 등)
- 주요 기능
- 상태 구분

## 2. 레이아웃 스펙

- 컨테이너 크기 (px)
- 그리드 시스템
- 정렬 방식
- 간격 체계 (4px/8px 기반 등)

## 3. 타이포그래피 스펙

| 요소 | 사이즈 | 웨이트 | 라인하이트 | 컬러 | 비고 |
| ---- | ------ | ------ | ---------- | ---- | ---- |
| ...  | ...    | ...    | ...        | ...  | ...  |

## 4. 컬러/보더/쉐도우 토큰

### 컬러 토큰

- 배경색 (Background)
- 텍스트색 (Text)
- 보더색 (Border)

### 보더 스펙

- 두께, 스타일, 컬러

### 쉐도우 토큰

- 그림자 값

## 5. 컴포넌트 분해

- Layout Components
- Atomic Components
- Feature Components

## 6. 인터랙션/상태

- Hover States
- Active/Focus States
- Disabled States
- Empty State
- Loading State
- Validation State
- Interactive Behaviors

## 7. 공통 컴포넌트 추상화 제안

- 재사용 가능한 컴포넌트 후보
- Props 정의
- 사용 예시
```

### 1-4. 명세 작성 프롬프트 예시

```
Figma URL: https://www.figma.com/design/...?node-id=...

1) 각 노드가 어떤 화면/상태인지 요약해줘(예: 리스트/상세/모달/상태변형 등)
2) 레이아웃 스펙: 컨테이너 폭/그리드/정렬/간격(8px 기반인지 등)
3) 타이포 스펙: 폰트/사이즈/웨이트/라인하이트/색
4) 컬러/보더/쉐도우 토큰 후보 정리
5) 컴포넌트 분해: 버튼/인풋/탭/테이블/뱃지 등 재사용 단위로 목록화
6) 인터랙션/상태: hover/active/disabled/empty/loading/validation 등이 보이면 정리
7) (가능하면) 공통 컴포넌트로 추상화해야 할 후보를 제안해줘

코드 생성은 하지 말고, 먼저 명세만 만들어줘
```

---

## Phase 2: 명세 기반 퍼블리싱 코드 생성

### 2-1. 코드 생성 요구사항

```
명세를 기준으로 "퍼블리싱 코드"를 생성해줘.

요구사항:
- Vue SFC(<script setup>/<template>/<style>)로 작성
- 스타일은 tailwind css 로
- 레이아웃/타이포/컬러는 tailwind.config.js 에 원래 있던 거는 원래꺼 쓰고 없는 거는 추가해줘.
- 테이블/검색폼/필터는 있으면 컴포넌트로 분리해줘. 원래 있던거는 원래 꺼 써
- 더미 데이터는 해당 컴포넌트에다가 const mocks = [] 이런식으로 해서 만들어줘.
- 기타 컨벤션은 다른 파일들 보고 해줘.

산출물:
1) 생성/수정될 파일 목록 (경로 포함)
2) 각 파일의 전체 코드
3) 화면에 필요한 더미 데이터
```

### 2-2. 코드 생성 체크리스트

#### Vue 컴포넌트 작성

- [ ] `<script setup>` 사용
- [ ] 절대경로 import (`@components`, `@views`, `@/constants` 등)
- [ ] Props validation
- [ ] Emits 정의
- [ ] 더미 데이터는 컴포넌트 내부에 `const mocks = []` 형태로 작성

#### Tailwind CSS

- [ ] 기존 `tailwind.config.js`의 컬러/타이포 유틸리티 활용
- [ ] 새로운 컬러/타이포가 필요한 경우 `tailwind.config.js`에 추가
- [ ] Pretendard 폰트 유틸리티 클래스 사용 (`.pretendard-14Regular` 등)
- [ ] spacing은 기존 체계 활용 (4px 기반)
- [ ] 템플릿 리터럴로 class 바인딩 (배열 형식 금지)

#### 컴포넌트 분리

- [ ] 재사용 가능한 단위로 컴포넌트 분리
- [ ] 기존 공통 컴포넌트 우선 활용 (ModalBaseNew, ButtonBase 등)
- [ ] 새로운 공통 컴포넌트는 명확한 네이밍

#### Constants/Schema

- [ ] 매핑 객체는 `src/constants/`에 정의
- [ ] 폼 validation schema는 `src/schemas/`에 정의
- [ ] 절대경로 import

#### 네이밍 규칙

- [ ] 컴포넌트: PascalCase (ButtonBase, ModalBaseNew)
- [ ] 파일명: PascalCase.vue
- [ ] Constants: UPPER_SNAKE_CASE
- [ ] Props/Variables: camelCase

---

## Phase 3: 코드 검증 및 수정

### 3-1. 코드 생성 후 확인사항

1. **Import 경로 확인**

   ```javascript
   // ✅ Good
   import ButtonBase from '@components/common/ButtonBase.vue';
   import { CONSTANTS } from '@/constants/feature.js';

   // ❌ Bad
   import ButtonBase from '../../../components/common/ButtonBase.vue';
   ```

2. **Tailwind 유틸리티 확인**

   ```vue
   <!-- ✅ Good -->
   <div :class="`flex gap-2 ${dynamicClass}`"></div>
   ```

3. **더미 데이터 확인**

   ```javascript
   // ✅ Good - 컴포넌트 내부에 정의
   const mockTableData = {
     content: [
       { id: 1, name: '테스트' },
       { id: 2, name: '샘플' },
     ],
   };
   ```

4. **Props/Emits 확인**

   ```javascript
   // ✅ Good
   const props = defineProps({
     value: {
       type: String,
       required: true,
     },
   });

   const emits = defineEmits(['update', 'close']);
   ```

### 3-2. 일반적인 수정 사항

1. **컴포넌트가 너무 큰 경우**: 하위 컴포넌트로 분리
2. **반복되는 로직**: Composable로 추출
3. **하드코딩된 값**: Constants로 이동
4. **인라인 스타일**: Tailwind 유틸리티로 변환

---

## 예시: 점검항목 수기등록 모달

### 명세 작성

```
Figma URL: https://www.figma.com/design/.../node-id=1082249-10750
→ 스크린샷 확인 → 메타데이터 분석 → 명세 작성
```

### 코드 생성

```
생성 파일:
1. src/schemas/fireInspection.js (수정)
2. src/constants/fireInspection.js (수정)
3. src/views/FireInspectionView/Household/ManualInputModal.vue (신규)
4. src/views/.../components/CheckboxRadioGroup.vue (신규)
5. src/views/.../components/InspectionTableCell.vue (신규)
6. src/views/.../components/FilterSection.vue (신규)
```

### 더미 데이터

```javascript
// ManualInputModal.vue 내부
const inspectionData = computed(() => {
  return FIRE_INSPECTION_QUESTION_TEMPLATE.sections;
});

const inspectionResults = ref({});
```

---

## 주의사항

### DO

- ✅ 명세를 먼저 작성하고 사용자 확인 후 코드 생성
- ✅ 기존 프로젝트 구조와 컨벤션 준수
- ✅ 재사용 가능한 컴포넌트 분리
- ✅ Tailwind CSS 활용 (인라인 스타일 지양)
- ✅ 더미 데이터는 컴포넌트 내부에 정의

### DON'T

- ❌ 명세 없이 바로 코드 생성
- ❌ 상대경로 import
- ❌ 인라인 스타일 사용
- ❌ 컴포넌트 내 매핑 객체 하드코딩
- ❌ 배열 형식 class 바인딩

---

## 참고 문서

- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 전체 컨벤션 및 문서 메타데이터 규칙
- [api-conventions.md](./api-conventions.md) - API/Query 컨벤션
- [form-patterns.md](./form-patterns.md) - Form 패턴

---

**생성일:** 2025-02-06
**생성자:** 이은영
**최종 수정일:** 2025-02-06
**최종 수정자:** 이은영
