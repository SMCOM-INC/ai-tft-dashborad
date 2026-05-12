# API and Query Conventions

## API Functions

### 기본 규칙

- JSDoc 주석 작성하지 않음
- 함수 위에 간단한 한글 주석으로 설명
- **모든 파라미터는 단일 객체로 전달** (positional arguments 금지)

```javascript
// 데이터 수정
export const patchData = async ({ id, name, value }) => {
  const response = await auth.patch(`/api/data/${id}`, { name, value });
  return response;
};

// ✅ Correct - 객체로 전달
await patchData({ id: 1, name: 'test', value: 'data' });

// ❌ Wrong - positional arguments
await patchData(1, 'test', 'data');
```

### API 함수 예시

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

// 단일 데이터 조회
export const getDataDetail = async ({ aptUuid, uuid }) => {
  const response = await auth.get(`/api/${aptUuid}/data/${uuid}`);
  return response;
};

// 데이터 생성
export const postData = async ({ aptUuid, data }) => {
  const response = await auth.post(`/api/${aptUuid}/data`, data);
  return response;
};

// 데이터 삭제
export const deleteData = async ({ aptUuid, uuid }) => {
  const response = await auth.delete(`/api/${aptUuid}/data/${uuid}`);
  return response;
};
```

## useMutation Query Hooks

### 기본 패턴

`useDeleteVoteSmsReservation.js` 패턴을 따름:

```javascript
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteData } from '@/apis/dataApi.js';
import { swalErrorModal, swalSuccessModal } from '@/lib/utils/swalModal.js';

export const useDeleteData = ({ aptUuid }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteDataMutationAsync,
    isPending: isDeleteDataPending,
  } = useMutation({
    mutationFn: ({ uuid }) => deleteData({ aptUuid, uuid }),
    onSuccess: () => {
      swalSuccessModal({ text: '삭제되었습니다.' });
      queryClient.invalidateQueries({ queryKey: ['dataList', aptUuid] });
    },
    onError: (error) => {
      const { message } = error.data.error;
      swalErrorModal({ text: message || '삭제에 실패했습니다.' });
    },
  });

  return { deleteDataMutationAsync, isDeleteDataPending };
};

export default useDeleteData;
```

### 네이밍 규칙

- `mutateAsync`: `{functionName}MutationAsync`
- `isPending`: `is{FunctionName}Pending`
- Export: named + default 모두
- **파일명 = 함수명 일치**: `useDeleteData.js` → `useDeleteData` 함수

## useQuery Hooks

### 네이밍 규칙 (필수)

**파일명, 함수명, 변수명 일관성 유지**:

```javascript
// ✅ Good
// 파일: useGetFireInspectionList.js
export const useGetFireInspectionList = ({ aptUuid }) => {
  const {
    data: fireInspectionListData,
    isLoading: isFireInspectionListLoading,
  } = useQuery({
    queryKey: ['fireInspectionList', aptUuid],
    queryFn: () => getFireInspectionList({ aptUuid }),
  });

  return { fireInspectionListData, isFireInspectionListLoading };
};

// ❌ Bad - 변수명이 파일명/함수명과 불일치
export const useGetFireInspectionList = ({ aptUuid }) => {
  const { data: inspectionData, isLoading: isLoading } = useQuery({
    // ...
  });

  return { inspectionData, isLoading }; // 변수명이 모호함
};
```

**규칙:**

- **파일명 = 함수명**: `useGetFireInspectionList.js` → `useGetFireInspectionList`
- **변수명 일관성**: `data: fireInspectionListData`, `isLoading: isFireInspectionListLoading`
- **파라미터는 객체**: `({ aptUuid })` - positional arguments 금지

### URL 파라미터 자동 추적 패턴

```javascript
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.js';
import { useNavigate } from '@/lib/composables/common/useNavigate.js';
import { getDataList } from '@/apis/dataApi.js';

// 파일명: useGetDataList.js
export const useGetDataList = () => {
  const { userInfo } = useUserInfoStore();
  const { getQueryString } = useNavigate();
  const queryParams = computed(() => getQueryString());

  const { aptUuid } = userInfo;

  // 변수명이 파일명/함수명과 일관됨
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

### Reactive Query Parameters

```javascript
const useFetchDetail = (aptUuid, detailUuid) => {
  // ✅ computed로 reactive parameter
  const queryKey = computed(() => ['detail', aptUuid, detailUuid.value]);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getDetail({ aptUuid, uuid: detailUuid.value }),
    enabled: !!aptUuid && !!detailUuid.value,
  });

  return { data, isLoading };
};

// Usage
const detailUuid = computed(() => queryParams.value.detailUuid);
const { data } = useFetchDetail(aptUuid, detailUuid);
```

## Error Message Extraction

**구조분해 할당 사용** (optional chaining 금지):

```javascript
// ✅ Correct
onError: (error) => {
  const { message } = error.data.error;
  swalErrorModal({ text: message || '기본 에러 메시지' });
};

// ❌ Wrong
onError: (error) => {
  const message = error?.data?.error?.message;
  swalErrorModal({ text: message || '기본 에러 메시지' });
};
```

## Query Invalidation

Mutation 성공 후 관련 쿼리 무효화:

```javascript
const useConfirmReservation = (aptUuid) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: ({ uuid, data }) => confirmReservation({ aptUuid, uuid, data }),
    onSuccess: (_response, { uuid }) => {
      // Detail query 무효화
      queryClient.invalidateQueries({
        queryKey: ['reservationDetail', aptUuid, uuid],
      });
      // List queries 무효화
      queryClient.invalidateQueries({
        queryKey: ['reservationMonth', aptUuid],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservationDay', aptUuid],
      });
    },
  });

  return { mutateAsync };
};
```

## 함수 파라미터 규칙 요약

**API와 상호작용하는 모든 함수**는 단일 객체로 파라미터 받기:

```javascript
// ✅ Correct
const deleteItems = async ({ aptUuid, itemIds }) => { ... }
await deleteItems({ aptUuid: 'uuid', itemIds: [1, 2, 3] });

// ❌ Wrong
const deleteItems = async (aptUuid, itemIds) => { ... }
await deleteItems('uuid', [1, 2, 3]);
```

적용 대상:

- API functions
- Query hooks (useQuery, useMutation)
- API를 호출하는 모든 함수

## 컴포넌트에서 Query Hook 연결하기

### mockData 제거 및 직접 연결 패턴

**Query hook을 컴포넌트에 연결할 때는 mockData를 완전히 제거하고 직접 연결**:

```javascript
// ❌ Bad - mockData를 computed로 감싸서 사용
import { computed } from 'vue';

const { fireInspectionList, isFireInspectionListLoading } =
  useGetFireInspectionList();

const mockTableData = computed(
  () => fireInspectionList.value || {
    content: [],
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
    page: 0,
    size: 15,
  },
);

const isLoading = computed(() => isFireInspectionListLoading.value);

// Template
<TableView
  :page-data="mockTableData"
  :is-loading="isLoading"
/>
```

```javascript
// ✅ Good - query 데이터를 직접 연결
import { ref } from 'vue';

const { fireInspectionList, isFireInspectionListLoading } =
  useGetFireInspectionList();

// Template
<TableView
  :page-data="fireInspectionList"
  :is-loading="isFireInspectionListLoading"
/>
```

**규칙:**

- mockData 변수를 만들지 않고 query에서 반환된 ref를 직접 사용
- computed로 감싸지 않음 (이미 reactive함)
- 로딩 상태도 computed 없이 직접 사용

### useMutation과 컴포넌트 연결

**모달에서 mutation을 직접 사용** (emit 패턴 지양):

```javascript
// ❌ Bad - emit으로 부모에 전달
const emits = defineEmits(['close', 'submit']);

const onSubmit = handleSubmit(async (values) => {
  emits('submit', values);
  closeModal();
});

// 부모 컴포넌트
<CreateModal @submit="handleSubmit" />
```

```javascript
// ✅ Good - mutation을 직접 호출
import usePostFireInspection from '@/lib/queries/fireInspection/usePostFireInspection.js';

const emits = defineEmits(['close']);

const { createFireInspectionMutationAsync, isCreateFireInspectionPending } =
  usePostFireInspection();

const onSubmit = handleSubmit(async (values) => {
  try {
    await createFireInspectionMutationAsync(values);
    closeModal();
  } catch (error) {
    console.error('등록 실패:', error);
  }
});

// 부모 컴포넌트
<CreateModal @close="closeModal" />
```

**장점:**

- 부모 컴포넌트에서 별도 핸들러 불필요
- mutation 성공 시 자동으로 queryClient.invalidateQueries 실행
- 에러 핸들링이 mutation 내부에서 처리됨

## ErrorCode별 처리

**onError에서 errorCode별로 분기 처리**:

```javascript
export const usePostFireInspection = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ title, startDate, endDate }) => {
      return postFireInspection({ aptUuid, title, startDate, endDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fireInspectionList'] });
      swalSuccessModal({ text: '점검이 등록되었습니다.' });
    },
    onError: (error) => {
      const { errorCode, message } = error.data.error;
      switch (errorCode) {
        case 'INVALID_DATE_RANGE':
          swalErrorModal({ text: '시작일은 종료일보다 이전이어야 합니다.' });
          break;
        case 'DUPLICATE_INSPECTION_PERIOD':
          swalErrorModal({ text: '해당 기간에 이미 진행 중인 점검이 있습니다.' });
          break;
        default:
          swalErrorModal({ text: message || '점검 등록에 실패했습니다.' });
      }
    },
  });

  return { mutateAsync, isPending };
};
```

**규칙:**

- errorCode별로 사용자 친화적인 메시지 제공
- default case에서 서버 메시지 또는 기본 메시지 표시
- 구조분해 할당 사용 (optional chaining 금지)

---

**생성일:** 2025-01-15
**생성자:** 조태현
**최종 수정일:** 2026-02-11
**최종 수정자:** 이은영
