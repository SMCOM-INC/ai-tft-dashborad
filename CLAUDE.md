# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Handling Ambiguous Requirements

When requirements are unclear or lack sufficient information:

1. **Do not make arbitrary decisions** - Instead, create a prioritized list of questions that need clarification
2. **Present questions with recommendations** - For each question, provide your recommended approach (Best Practice)
   along with reasoning

**Example Format:**

```markdown
### 확인이 필요한 질문 리스트

**[높은 우선순위]**

1. **질문**: [명확하지 않은 요구사항]

   - **추천 안**: [Best Practice 제안]
   - **이유**: [해당 방식을 추천하는 근거]

2. **질문**: [추가 정보가 필요한 부분]
   - **추천 안**: [Best Practice 제안]
   - **이유**: [해당 방식을 추천하는 근거]

**[중간 우선순위]**

3. **질문**: [선택적으로 확인이 필요한 부분]
   - **추천 안**: [Best Practice 제안]
   - **이유**: [해당 방식을 추천하는 근거]
```

**When to Apply:**

- New feature development with incomplete specifications
- Bug fixes where the expected behavior is unclear
- Refactoring tasks where scope is ambiguous
- Any task where multiple valid approaches exist

## Mandatory Workflow Rules

### Before Starting Any Task

1. **Read project documentation first**

   - Check CLAUDE.md for project conventions and patterns
   - Check `.claude/rules/` for specialized conventions:
     - `api-conventions.md` - API and Query patterns
     - `form-patterns.md` - Form validation patterns
     - `figma.md` - Figma design to code workflow
   - Review Serena memories if relevant (`list_memories` → `read_memory`)
   - Understand existing code patterns before writing new code

2. **Plan before implementation**

   - Use EnterPlanMode for non-trivial tasks
   - For complex features, explore codebase with Serena tools first
   - Never start coding without understanding the context

3. **When working with Figma designs**
   - Follow the workflow in `.claude/rules/figma.md`
   - Phase 1: Create detailed UI specification first (do NOT generate code immediately)
   - Phase 2: Generate code only after specification is approved
   - Always use existing components and Tailwind utilities from the project

### After Completing Any Feature

1. **Update documentation if needed**

   - CLAUDE.md: Add new pitfalls, patterns, or conventions discovered
   - `.claude/rules/*.md`: Update relevant specialized documentation
   - Serena memories: Update if codebase structure changed significantly

2. **Verify before committing**
   - Request user to test manually (or use `/verify-ui` for UI verification support)
   - Check for console errors
   - Ensure no debugging code remains (console.log, commented code)
   - Use `/simplify` to review and clean up code

### Key Principles

- **Documentation is mandatory, not optional** - If you discover a new pattern or pitfall, document it immediately
- **Read before write** - Always understand existing patterns before implementing
- **Verify before commit** - Never commit untested code

### 최소한의 변경만 수행

코드 변경 시:

- **필요한 부분만 수정** - 몇 줄만 바꾸면 되는데 전체 파일이나 함수를 다시 작성하지 않기
- **기존 구조 유지** - 기존 패턴, 네이밍 규칙, 코드 구성 유지
- **Write보다 Edit 사용** - 파일 전체를 덮어쓰지 말고 특정 부분만 수정
- **관련 없는 변경 추가 금지** - `ButtonBase`를 `ButtonBaseNew`로 바꾸라고 하면 import와 컴포넌트 사용 부분만 변경, 주변 코드는 건드리지 않기

## Code Conventions

### Import Path Rules

**항상 절대경로 사용** (상대경로 금지):

```javascript
// ✅ Good - 절대경로
import ButtonBase from '@components/common/ButtonBase.vue';
import { formatDate } from '@/lib/utils/formatDate.js';
import { HOUSEHOLD_STATUS_TABLE_COLUMNS } from '@/constants/fireInspection.js';

// ❌ Bad - 상대경로
import ButtonBase from '../../../components/common/ButtonBase.vue';
import { formatDate } from './utils/formatDate.js';
import StatCard from './components/StatCard.vue';
```

**Available aliases:**

- `@components` - src/components
- `@views` - src/views
- `@assets` - src/assets
- `@/lib` - src/lib
- `@/constants` - src/constants
- `@/schemas` - src/schemas
- `@/stores` - src/stores
- `@/apis` - src/apis

### Class Binding Rules

**템플릿 리터럴 사용** (배열 형식 금지):

```vue
<!-- ✅ Good - 백틱 사용 -->
<div :class="`flex flex-col gap-2.5 rounded p-3 ${cardBgClass}`"></div>
```

**규칙:**

- 동적 class 바인딩 시 템플릿 리터럴(백틱) 사용
- 배열 형식 사용 금지
- computed 또는 reactive 변수는 `${}` 안에 포함

### Constants Usage Rules

**매핑 객체는 항상 constants에 정의** (컴포넌트 내 인라인 금지):

```javascript
// ❌ Bad - 컴포넌트 내 인라인 정의
const renderFieldValue = ({ key, row }) => {
  if (key === 'submitStatus') {
    const statusMap = {
      submitted: { status: 'submitted', label: '제출완료' },
      pending: { status: 'pending', label: '미제출' },
      excluded: { status: 'excluded', label: '제외' },
    };
    return statusMap[value] || { status: 'pending', label: '-' };
  }
};

// ✅ Good - constants에 정의
// constants/fireInspection.js
export const FIRE_INSPECTION_SUBMIT_STATUS = {
  submitted: { status: 'submitted', label: '제출완료' },
  pending: { status: 'pending', label: '미제출' },
  excluded: { status: 'excluded', label: '제외' },
};

// 컴포넌트에서 사용
import { FIRE_INSPECTION_SUBMIT_STATUS } from '@/constants/fireInspection.js';

const renderFieldValue = ({ key, row }) => {
  if (key === 'submitStatus') {
    return (
      FIRE_INSPECTION_SUBMIT_STATUS[value] || { status: 'pending', label: '-' }
    );
  }
};
```

**규칙:**

- 상태 매핑, 타입 매핑 등 객체 매핑은 `src/constants/` 에 정의
- 컴포넌트에서는 constants를 import하여 사용
- 재사용 가능성과 유지보수성 향상

### Commented Code Rules

**주석 처리된 코드 금지**:

```javascript
// ❌ Bad - 의미없는 주석 처리된 코드
export const useGetDataList = () => {
  const { data: dataList } = useQuery({
    // queryKey: ['oldDataList', aptUuid], // 이전 방식
    queryKey: ['dataList', aptUuid],
    queryFn: () => getDataList({ aptUuid }),
  });

  // const oldFunction = () => {
  //   console.log('old logic');
  // };

  return { dataList };
};

// ✅ Good - 주석 처리된 코드 제거
export const useGetDataList = () => {
  const { data: dataList } = useQuery({
    queryKey: ['dataList', aptUuid],
    queryFn: () => getDataList({ aptUuid }),
  });

  return { dataList };
};
```

**규칙:**

- 사용하지 않는 코드는 완전히 삭제
- Git history로 이전 코드 추적 가능
- 주석으로 설명이 필요한 경우에만 주석 사용
- 임시 디버깅 코드도 commit 전 제거

### Tailwind CSS Spacing Rules

**우선순위:** `space-*` > `gap-*` > `mb-*`/`mt-*`

1. **수직/수평 간격은 space-\* 우선 사용**

```html
<!-- ✅ Good - space-y 사용 -->
<div class="space-y-3">
  <div>Section 1</div>
  <div>Section 2</div>
  <div>Section 3</div>
</div>

<!-- ✅ Good - space-x 사용 -->
<div class="flex space-x-2">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

<!-- ❌ Bad - 개별 margin -->
<div>
  <div class="mb-3">Section 1</div>
  <div class="mb-3">Section 2</div>
  <div>Section 3</div>
</div>
```

2. **flex/grid에서는 gap-\* 사용**

```html
<!-- ✅ Good - flex + gap -->
<div class="flex items-center justify-between gap-2">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- ✅ Good - grid + gap -->
<div class="grid grid-cols-4 gap-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

3. **개별 margin은 필요한 경우에만**

```html
<!-- ✅ Good - 특정 요소만 margin 필요 -->
<div class="space-y-6">
  <SearchBar class="mb-7" />
  <!-- 다른 간격 필요 -->
  <TableView />
</div>
```

**적용 기준:**

- flex 필요 없음 (단순 수직/수평 나열) → `space-y-*` / `space-x-*`
- flex 필요함 (중앙 정렬, justify 등) → `flex` + `gap-*`
- 예외적인 간격 → `mb-*`, `mt-*` 등

### Divider/Separator Rules

**가능한 div로 구분선 만들지 않기** - semantic HTML 또는 border 사용

```html
<!-- ❌ Bad - div로 구분선 -->
<div class="flex items-center gap-2">
  <span>전체 5</span>
  <div class="h-3.5 w-px bg-defaults-tertiary-background-tertiary"></div>
  <span>조회 5</span>
</div>

<!-- ✅ Good - border 활용 -->
<div class="flex items-center gap-2">
  <span>전체 5</span>
  <span class="border-l border-defaults-tertiary-background-tertiary pl-2">
    조회 5
  </span>
</div>

<!-- ✅ Good - hr 태그 (수평선) -->
<section>
  <h2>Title</h2>
  <hr class="my-4 border-defaults-secondary-border-secondary" />
  <p>Content</p>
</section>
```

**예외:** 복잡한 레이아웃에서 div가 불가피한 경우에만 허용

### Modal State Management

**모달마다 ref 만들지 않기** - 단일 modalType으로 관리

```javascript
// ❌ Bad - 모달마다 개별 ref
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

const openEditModal = () => {
  isEditModalOpen.value = true;
};

const closeModal = () => {
  isCreateModalOpen.value = false;
  isEditModalOpen.value = false;
  isDeleteModalOpen.value = false;
};

// ✅ Good - 단일 modalType으로 관리
const modalType = ref(null);

const openCreateModal = () => {
  modalType.value = 'create';
};

const openEditModal = () => {
  modalType.value = 'edit';
};

const openDeleteModal = () => {
  modalType.value = 'delete';
};

const closeModal = () => {
  modalType.value = null;
};
```

```html
<!-- ❌ Bad - 여러 개의 boolean ref -->
<CreateModal v-if="isCreateModalOpen" @close="isCreateModalOpen = false" />
<EditModal v-if="isEditModalOpen" @close="isEditModalOpen = false" />
<DeleteModal v-if="isDeleteModalOpen" @close="isDeleteModalOpen = false" />

<!-- ✅ Good - 단일 modalType 체크 -->
<CreateModal v-if="modalType === 'create'" @close="closeModal" />
<EditModal v-if="modalType === 'edit'" @close="closeModal" />
<DeleteModal v-if="modalType === 'delete'" @close="closeModal" />
```

**장점:**

- 코드 간결화 (여러 ref 대신 하나만 관리)
- 한 번에 하나의 모달만 열림 (자동 배타적 처리)
- closeModal 함수 하나로 통일

### User Input Text Handling

**사용자가 직접 입력한 텍스트는 decodeUrl 처리**

```javascript
// ✅ Good - 사용자 입력 텍스트에 decodeUrl 적용
const renderFieldValue = ({ key, row }) => {
  const value = row[key];

  // 제목 (사용자 직접 입력)
  if (key === 'title') {
    return decodeUrl(value);
  }

  // 기타 처리...

  // 기본값 - 문자열인 경우 decodeUrl 처리
  if (value && typeof value === 'string') {
    return decodeUrl(value);
  }

  return value || '-';
};
```

**적용 대상:**

- 사용자가 직접 입력하는 텍스트 필드 (제목, 설명, 메모 등)
- URL에서 전달된 텍스트 파라미터

**적용 제외:**

- 날짜, 숫자 등 포맷팅된 값
- 상태 코드, enum 값
- API에서 계산/생성된 값

### Table Column Constants

**테이블 컬럼은 name, key만 정의** - width나 스타일링 정보 포함 금지

```javascript
// ❌ Bad - width, label 사용
export const TABLE_COLUMNS = [
  { key: 'id', label: '관리번호', width: '82px' },
  { key: 'title', label: '제목', width: '199.5px' },
  { key: 'status', label: '상태', width: '114px' },
];

// ✅ Good - name, key만 사용 (type은 선택적)
export const TABLE_COLUMNS = [
  { name: '관리번호', key: 'id' },
  { name: '제목', key: 'title' },
  { name: '상태', key: 'status', type: 'badge' }, // type은 렌더링 힌트
];
```

**필수 필드:**

- `name`: 컬럼 헤더에 표시될 텍스트
- `key`: 데이터 객체의 키

**선택적 필드:**

- `type`: 렌더링 타입 힌트 (예: `'dateTime'`, `'number'`, `'badge'` 등)

**Width 처리 방법:**

```vue
<!-- 컴포넌트에서 CSS로 처리 -->
<template>
  <table>
    <thead>
      <tr>
        <th class="w-20">관리번호</th>
        <th class="w-48">제목</th>
        <th class="w-28">상태</th>
      </tr>
    </thead>
  </table>
</template>

<!-- 또는 style로 처리 -->
<style scoped>
  th:nth-child(1) {
    width: 82px;
  }
  th:nth-child(2) {
    width: 199.5px;
  }
  th:nth-child(3) {
    width: 114px;
  }
</style>
```

**이유:**

- Constants는 데이터 구조만 정의 (관심사의 분리)
- 스타일링은 컴포넌트/CSS에서 관리
- width는 반응형 디자인 등으로 변경 가능성이 높음

## Prerequisites

- Node.js v20 or higher required
- Use `nvm use` or `nvm use 20` to set correct Node version

## Development Commands

### Setup

1. Clone repository: `git clone https://github.com/SMCOM-INC/apt-admin-fe.git`
2. Navigate to directory: `cd apt-admin-fe`
3. Set Node version: `nvm use` or `nvm use 20`
4. Install dependencies: `npm install`
5. Configure environment files (contact team for values):
   - Create `.env.local`, `.env.development`, `.env.production` in root directory

### Running the Application

- `npm run start` - Run with local environment (.env.local)
- `npm run dev` - Run with development environment (.env.development)
- `npm run prod` - Run with production environment (.env.production)

### Building

- `npm run build:dev` - Build for development environment
- `npm run build:prod` - Build for production environment

### Code Quality

- Pre-commit hooks run linting automatically via husky

## Architecture Overview

### Tech Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia with localStorage persistence
- **Routing**: Vue Router with role-based guards
- **HTTP Client**: Axios with custom interceptors
- **Data Fetching**: TanStack Vue Query (react-query for Vue)
- **Styling**: Tailwind CSS with extensive custom design system
- **Form Validation**: Vee-validate with Zod schemas
- **Rich Text**: Quill Editor with custom modules

### Project Structure

- `src/apis/` - HTTP API layer with axios instances
- `src/components/common/` - Reusable UI components
- `src/components/layout/` - Layout components with role-based headers/navigation
- `src/lib/queries/` - TanStack Query hooks organized by feature
- `src/lib/composables/` - Vue composables for shared logic
- `src/schemas/` - Zod validation schemas
- `src/stores/` - Pinia stores (auth, questionForm, searchConfig, vote)
- `src/views/` - Page components organized by feature modules
- `src/constants/` - Static data and configuration
- `src/router/` - Route definitions split by feature

### Key Features

This is an apartment management admin interface with modules for:

- **Member Management**: Household and resident information
- **Parking Management**: Regular cars, reservations, violations, mileage
- **Board Management**: Notices, community posts, complaints, global notices
- **Repair Management**: Maintenance requests and scheduling
- **Vote Management**: Digital voting system with Excel import/export
- **Store Management**: Apartment store administration
- **Moving House**: Booking system for moving services

### Authentication & Authorization

- Role-based system: `master` (super admin) vs `apt` (apartment admin)
- Token stored in localStorage via Pinia store
- Route guards prevent unauthorized access
- Master users must select apartment before accessing other features

### Data Fetching Pattern

Uses TanStack Vue Query extensively:

- Query hooks in `src/lib/queries/` follow naming: `useGet*`, `usePost*`, `usePatch*`, `useDelete*`
- Mutations handle optimistic updates and error handling
- Custom query client with network error retry logic

### UI Components

- Custom design system built on Tailwind CSS
- Extensive color palette and typography utilities (`.pretendard-*` classes)
- Reusable components follow naming: `*Base`, `*View`, `*Modal`
- Form components integrate with Vee-validate
- QuillEditor with custom image upload and resize modules

### File Organization

Routes are organized by feature in separate files (apt.js, board.js, parking.js, etc.) and imported into main router.
Components follow co-location pattern within feature directories under `src/views/`.

### Environment Configuration

Requires environment files (.env.local, .env.development, .env.production) for API endpoints and configuration - contact
team for values.

### Commit Convention

Uses lowercase English commit prefixes:

- `feat`: New feature additions
- `fix`: Bug fixes and other corrections
- `refactor`: Code refactoring
- `rename`: Naming changes, file moves, typo fixes
- `remove`: File deletions
- `style`: Edit css style
- `chore`: Build configuration, package manager, config updates, module additions
- `docs`: Documentation
- `hotfix`: Urgent fixes
- `test`: Test code related changes
- `perf`: Performance efficiency improvements

### Vue Script Organization

When writing Vue 3 Composition API components, organize the `<script setup>` section in the following order:

1. **Imports** - Component imports, utility imports, etc.
2. **Props & Emits** - defineProps, defineEmits
3. **Reactive State** - ref, reactive, computed declarations
4. **Functions** - All function declarations and handlers
5. **Lifecycle Methods** (bottom section, in this specific order):
   - `watch` - Watchers and observers
   - `onMounted` - Mount lifecycle hooks
   - `onUnmounted` - Cleanup lifecycle hooks (last)

## Table List Page 작업 방법

When refactoring table list pages to use modern patterns, follow these steps based on the ManagementView.vue pattern:

### SearchBar Props Format

When passing search input constants to SearchBar component:

**If the constant only has inputs without filters:**

```javascript
// Before
export const REGULAR_CAR_BUSINESS_SEARCH_INPUT_LIST = {
  inputs: [inputCarNum, inputCarOwnerName, inputContact],
  filters: [],
};

// After - simplify to array format
export const REGULAR_CAR_BUSINESS_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputCarOwnerName,
  inputContact,
];
```

**Keep object format only when filters exist:**

```javascript
export const ADMIN_PARKING_MILEAGE_SEARCH_INPUT_LIST = {
  inputs: [inputDong, inputHouseholdNumber],
  filters: [filterMileagePeriod, filterHours],
};
```

### 1. View Component Refactoring

**Before (SearchBarView pattern):**

```vue
<script setup>
  import SearchBarView from '@components/common/SearchBarView.vue';
  import { computed, watch } from 'vue';
  import { buildSearchQuery } from '@/lib/utils/formatSearchQuery.js';

  const { getQueryString, navigateTo } = useNavigate();
  const queryParams = computed(() => getQueryString());

  // Complex manual parameter building
  const fetchParams = computed(() => {
    const baseParams = { page: 0, size: 10 };
    return Object.entries(queryParams.value).reduce(
      (acc, [key, value]) => {
        // Manual parameter processing logic...
      },
      { ...baseParams },
    );
  });

  const handleSearch = (searchData) => {
    const currentQuery = { ...queryParams.value };
    const newQuery = buildSearchQuery(searchData, currentQuery);
    navigateTo({ query: newQuery });
  };

  const handleFieldsReset = () => {
    navigateTo({ query: { page: '0' } });
  };

  // Manual watch for refetching
  watch(
    queryParams,
    (newParams) => {
      refetch(filteredParams);
    },
    { immediate: true, deep: true },
  );
</script>

<template>
  <SearchBarView
    :search-input="SEARCH_INPUT_LIST"
    @search="handleSearch"
    @fields-reset="handleFieldsReset"
  />
  <TableView :page-data="dataList" />
</template>
```

**After (SearchBar pattern):**

```vue
<script setup>
  import SearchBar from '@components/common/SearchBar.vue';

  const { navigateTo } = useNavigate();

  // Automatic URL parameter tracking
  const { dataList, isDataListLoading } = useGetDataList();

  // Field value rendering
  const renderFieldValue = (key, value) => {
    if (!value) return '-';

    if (key === 'phone') {
      return formatPhone(value);
    }

    if (key === 'createdDate') {
      return formatDate(value).dateOnly();
    }

    return value || '-';
  };
</script>

<template>
  <SearchBar
    :search-input="SEARCH_INPUT_LIST"
    has-reset
    :is-search-loading="isDataListLoading"
    class="mb-7"
  />
  <TableView :page-data="dataList" :is-loading="isDataListLoading">
    <template #default="{ row, column }">
      {{ renderFieldValue(column.key, row[column.key]) }}
    </template>
  </TableView>
</template>
```

### 2. Query Hook Refactoring

**Before (Manual parameter management):**

```javascript
const useGetDataList = (aptUuid, initialSearchParams) => {
  const searchParams = ref({ ...defaultParams, ...initialSearchParams });

  const { data, refetch: originalRefetch } = useQuery({
    queryKey: ['dataList', aptUuid, searchParams.value],
    queryFn: () => getDataList(aptUuid, searchParams.value),
  });

  const refetch = (newParams) => {
    if (newParams) {
      searchParams.value = { ...defaultParams, ...newParams };
    }
    return originalRefetch();
  };

  return { dataList: data, refetch };
};
```

**After (Automatic URL parameter tracking):**

```javascript
const useGetDataList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const { aptUuid } = userInfo;

  const { data: dataList, isLoading: isDataListLoading } = useQuery({
    queryKey: ['dataList', aptUuid, queryParams],
    queryFn: () => {
      return getDataList({
        aptUuid,
        page: queryParams.value.page || 0,
        size: queryParams.value.size || 10,
        searchType: queryParams.value.searchType,
        keyword: queryParams.value.keyword,
      });
    },
    enabled: !!aptUuid,
  });

  return { dataList, isDataListLoading };
};
```

### 3. API Function Refactoring

**Before (Grouped parameters):**

```javascript
export const getDataList = async (aptUuid, queryParams) => {
  const response = await auth.get(`/api/${aptUuid}/data`, {
    params: queryParams,
  });
  return response;
};
```

**After (Individual parameters):**

```javascript
// 데이터 리스트 조회
export const getDataList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
}) => {
  const response = await auth.get(`/api/${aptUuid}/data`, {
    params: {
      page,
      size,
      searchType,
      keyword,
    },
  });
  return response;
};
```

### 4. Common Field Rendering Patterns

```javascript
const renderFieldValue = (key, value) => {
  if (!value) return '-';

  // Phone number formatting
  if (key === 'phone') {
    return formatPhone(value);
  }

  // Date formatting
  if (key === 'createdDate' || key === 'startDate' || key === 'endDate') {
    return formatDate(value).dateOnly();
  }

  // DateTime formatting
  if (key === 'inParkingTime' || key === 'outParkingTime') {
    return formatDate(value).full();
  }

  // Status mapping
  if (key === 'householdHeadFlag') {
    return value === 'HEAD' ? '세대주' : '세대원';
  }

  if (key === 'regularCarType') {
    return value === 'REGULAR' ? '정기차량' : '입주민차량';
  }

  // Count with unit
  if (key === 'householdResidentCount') {
    return `${value || 0}명`;
  }

  return value || '-';
};
```

### 5. Adding Dynamic Filters

For pages that need API-driven filters (like business types):

```vue
<script setup>
  import { useFetchAptBusinessTypeList } from '@/lib/queries/aptAdmin/aptAdminParkingPolicyQueries.js';

  const { aptBusinessTypeList } = useFetchAptBusinessTypeList({
    usedOnly: true,
    enabled: true,
  });

  const createBusinessTypeFilter = () => {
    if (!aptBusinessTypeList.value) return null;

    return {
      filterName: '업무목적',
      filterKey: 'businessTypeUuidList',
      inputType: 'checkbox',
      list: aptBusinessTypeList.value.map((item) => ({
        key: item.uuid,
        label: item.name,
      })),
    };
  };
</script>

<template>
  <SearchBar
    :search-input="{
      ...SEARCH_INPUT_LIST,
      filters: [createBusinessTypeFilter()].filter(Boolean),
    }"
    has-reset
    class="mb-7"
  />
</template>
```

### 6. Refactoring Checklist

- [ ] Replace `SearchBarView` with `SearchBar`
- [ ] Remove manual search handling (`handleSearch`, `handleFieldsReset`)
- [ ] Remove complex parameter building logic (`fetchParams`, `watch`)
- [ ] Update query hook to use automatic URL parameter tracking
- [ ] Add reactive `queryParams` computed property
- [ ] Flatten API function parameters (object destructuring)
- [ ] Add `renderFieldValue` function for field formatting
- [ ] Update template to use `renderFieldValue`
- [ ] Add dynamic filters if needed
- [ ] Test pagination, search, and filtering functionality

This pattern provides automatic URL state management, better performance with prefetching, and cleaner, more
maintainable code.

## Component Patterns

### Modal State Management

**Status-based Button Visibility:**

When showing/hiding action buttons based on entity status:

```javascript
// Define clear computed properties for each button
const showConfirmButton = computed(() => {
  const status = entity.value?.status;
  return status === 'WAITING' || status === 'CANCELED';
});

const showCancelButton = computed(() => {
  const status = entity.value?.status;
  return status === 'WAITING' || status === 'CONFIRMED';
});

// Template
<div v-if="showCancelButton || showConfirmButton" class="flex gap-2">
  <ButtonBase v-if="showCancelButton" @click="handleCancel">
  취소
</ButtonBase>
<ButtonBase v-if="showConfirmButton" @click = "handleConfirm" >
  확정
  < /ButtonBase>
</div>
```

**Benefits:**

- Clear logic - easy to understand what buttons appear in each state
- Easy to modify - change one computed property to adjust visibility rules
- Self-documenting - computed property names explain intent

## Common Pitfalls and Solutions

### 1. Form Not Submitting

**Symptom:** Clicking submit button does nothing

**Causes:**

- Schema validation failure (check console)
- Field name mismatch between `defineField` and schema
- Required field missing from schema
- Transform/superRefine logic errors

**Solution:**

1. Add validation error logging to `handleSubmit`
2. Verify all `defineField` names exist in schema
3. Check for required fields that aren't in the form
4. Simplify schema - remove unnecessary transforms/refinements

### 2. Query Not Refetching

**Symptom:** Data doesn't update after mutation

**Causes:**

- Query key not invalidated in mutation's `onSuccess`
- Query key mismatch between query and invalidation
- Non-reactive query parameters

**Solution:**

1. Ensure `queryClient.invalidateQueries()` is called in `onSuccess`
2. Verify query key structure matches exactly
3. Use `computed()` for reactive parameters

### 3. Conditional Rendering Not Working

**Symptom:** v-if conditions not responding to state changes

**Causes:**

- Using `ref.value` directly instead of computed
- Nested property reactivity lost
- Condition logic error

**Solution:**

1. Use computed properties for complex conditions
2. Ensure reactive data source (ref, computed, reactive)
3. Check condition logic matches intended behavior

### 4. ModalBaseNew + ButtonBaseNew 폼 제출 문제

**Symptom:** 모달에서 submit 버튼 클릭 시 아무 반응 없음

**Cause:**

- `ModalBaseNew`는 단순 wrapper (slot만 있음)
- form을 컴포넌트 내부에서 직접 작성해야 함
- `ButtonBaseNew`가 `<form>` 태그 외부에 있을 때 `form` 속성 필수

**When `form` attribute is required:**

- `ModalBaseNew` + `useForm`의 `handleSubmit` 사용 시
- `ButtonBaseNew`가 `<form>` 태그 외부에 위치할 때

**ModalBaseNew 올바른 패턴 (VoteDeleteModal.vue 참고):**

```vue
<ModalBaseNew>
  <div class="p-6">
    <!-- form 태그에 id 부여 -->
    <form id="myForm" @submit="onSubmit">
      <!-- 폼 내용 -->
    </form>
    <!-- 버튼은 form 외부에 위치 -->
    <div class="flex gap-2">
      <ButtonBaseNew type="button" @click="close">취소</ButtonBaseNew>
      <!-- ✅ form 속성으로 연결 -->
      <ButtonBaseNew form="myForm" type="submit">제출</ButtonBaseNew>
    </div>
  </div>
</ModalBaseNew>
```

**주의:** `ModalBase`와 달리 `ModalBaseNew`는 `has-form`, `form-id` prop이 없음

### 5. Zod coerce.string() 빈 값 처리 주의

**Symptom:** 빈 입력에서 "필수 입력" 메시지 대신 다른 validation 메시지 표시

**Cause:** `z.coerce.string()`은 `undefined`를 빈 문자열 `""`로 변환

**Solution:**

```javascript
// ❌ Wrong
floorName: z.coerce.string().superRefine((val, ctx) => {
  if (!val) {
    /* 이미 ""로 변환됨 */
  }
});

// ✅ Correct
floorName: z.string()
  .optional()
  .superRefine((val, ctx) => {
    const trimmedVal = (val ?? '').trim();
    if (trimmedVal.length === 0) {
      ctx.addIssue({ message: '필수 입력 항목입니다.' });
      return;
    }
  });
```

---

## Documentation Metadata Rules

All markdown documents in `.claude/rules/` directory must include the following metadata at the top:

```markdown
# [Document Title]

**생성일:** YYYY-MM-DD
**생성자:** 홍길동
**최종 수정일:** YYYY-MM-DD
**최종 수정자:** 홍길동

> 작성자 및 수정자는 Git 커밋 히스토리 참조해서 작성
```

**Rules:**

- When creating a new document: Set both 생성일 and 최종 수정일 to the same date
- When updating a document: Update only 최종 수정일 and 최종 수정자
- Author and editor information is tracked via Git commit history, no need to duplicate in the document
- md 문서의 최하단에 작성

**Checking author/editor via Git:**

```bash
# Check document creator
git log --follow --diff-filter=A --format=%an -- .claude/rules/[filename].md

# Check last editor
git log -1 --format=%an -- .claude/rules/[filename].md
```
