# useForm 표준 패턴 (vee-validate + Zod)

## Schema 분리 패턴 (필수)

**모든 form schema는 별도 파일로 분리**:

### 1. Schema 파일 생성 (`src/schemas/{feature}.js`)

```javascript
// src/schemas/fireInspection.js
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

// 점검 등록 폼
export const fireInspectionCreateFormSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, '점검 제목을 입력해주세요'),
    dateRange: z.array(z.string()).length(2, '점검 기간을 선택해주세요'),
  }),
);
```

**규칙:**

- Schema 파일은 `src/schemas/` 디렉토리에 위치
- `import * as z from 'zod'` 사용
- `toTypedSchema`로 감싸서 export
- 네이밍: `{feature}{Purpose}Schema` (camelCase)

### 2. Component에서 사용

```vue
<script setup>
  import { useForm } from 'vee-validate';
  import { fireInspectionCreateFormSchema } from '@/schemas/fireInspection.js';

  const { handleSubmit, defineField, errors } = useForm({
    validationSchema: fireInspectionCreateFormSchema,
    initialValues: {
      title: '',
      dateRange: [],
    },
  });

  const [title] = defineField('title');
  const [dateRange] = defineField('dateRange');

  const onSubmit = handleSubmit(async (values) => {
    await apiCall(values);
  });
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="title" type="text" />
    <span v-if="errors.title">{{ errors.title }}</span>

    <input v-model="dateRange" type="text" />
    <span v-if="errors.dateRange">{{ errors.dateRange }}</span>

    <button type="submit">제출</button>
  </form>
</template>
```

**장점:**

- Schema 재사용 가능
- Component 코드 간결화
- Schema 관리 용이

## 기본 구조 (Schema 인라인 - 비추천)

간단한 테스트나 프로토타입이 아닌 이상 Schema는 별도 파일로 분리하세요.

```vue
<script setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import { z } from 'zod';

  // Schema 인라인 정의 (비추천)
  const schema = z.object({
    name: z.string().min(1, '이름을 입력해주세요'),
    phone: z.string().min(1, '연락처를 입력해주세요'),
  });

  const { handleSubmit, defineField, errors } = useForm({
    validationSchema: toTypedSchema(schema),
    initialValues: { name: '', phone: '' },
  });

  const [name] = defineField('name');
  const [phone] = defineField('phone');

  const onSubmit = handleSubmit(async (values) => {
    await apiCall(values);
  });
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="name" type="text" />
    <span v-if="errors.name">{{ errors.name }}</span>

    <input v-model="phone" type="text" />
    <span v-if="errors.phone">{{ errors.phone }}</span>

    <button type="submit">제출</button>
  </form>
</template>
```

## ModalBase 사용 시 (has-form prop 있음)

```vue
<script setup>
  const { handleSubmit, defineField, errors, resetForm } = useForm({
    validationSchema: toTypedSchema(schema),
  });

  const [fieldName] = defineField('fieldName');

  const onSubmit = handleSubmit(async (values) => {
    await mutation(values);
  });
</script>

<template>
  <ModalBase
    ref="modalRef"
    title="모달 제목"
    :has-form="true"
    form-id="myForm"
    @form-submit="onSubmit"
    @close-modal="resetForm"
  >
    <template #modalBody>
      <input v-model="fieldName" type="text" />
      <TextError v-if="errors.fieldName">{{ errors.fieldName }}</TextError>
    </template>
    <template #submitButton>
      <ButtonBaseNew form="myForm" type="submit" color="primary">
        제출
      </ButtonBaseNew>
    </template>
  </ModalBase>
</template>
```

## ModalBaseNew 사용 시 (form 태그 직접 작성)

`ModalBaseNew`는 단순 wrapper이므로 form을 직접 작성해야 합니다:

```vue
<script setup>
  const { handleSubmit, defineField, errors } = useForm({
    validationSchema: toTypedSchema(schema),
  });

  const [fieldName] = defineField('fieldName');

  const onSubmit = handleSubmit(async (values) => {
    await mutation(values);
    closeModal();
  });
</script>

<template>
  <ModalBaseNew>
    <div class="p-6">
      <!-- form 태그에 id 부여 -->
      <form id="myForm" @submit="onSubmit">
        <input v-model="fieldName" type="text" />
        <TextError v-if="errors.fieldName">{{ errors.fieldName }}</TextError>
      </form>

      <!-- 버튼은 form 외부 - form 속성으로 연결 -->
      <div class="flex justify-end gap-2">
        <ButtonBaseNew type="button" @click="closeModal">취소</ButtonBaseNew>
        <ButtonBaseNew form="myForm" type="submit">제출</ButtonBaseNew>
      </div>
    </div>
  </ModalBaseNew>
</template>
```

## 한글 IME 이슈 해결

한글 입력 시 v-model이 제대로 동작하지 않는 경우:

```vue
<script setup>
  const [confirmationText] = defineField('confirmationText');

  // setFieldValue로 직접 설정
  const onInput = (event) => {
    setFieldValue('confirmationText', event.target.value);
  };
</script>

<template>
  <input :value="confirmationText" type="text" @input="onInput" />
</template>
```

## 확인 모달과 함께 사용

```javascript
const onSubmit = handleSubmit((values) => {
  swalConfirmModal({
    text: '저장하시겠습니까?',
    callback: async () => {
      await mutation(values);
    },
  });
});
```

## values 직접 사용 vs defineField

**defineField 사용 (권장):**

- 실시간 양방향 바인딩 필요할 때
- 필드별 에러 표시 필요할 때

```javascript
const [name] = defineField('name');
// template: v-model="name"
```

**values 직접 사용:**

- 읽기 전용으로 값만 확인할 때
- 여러 필드를 한번에 처리할 때

```javascript
const { values, handleSubmit } = useForm({ ... });
// values.name으로 접근
```

## Zod Schema Best Practices

### String Type 에러 메시지 (필수)

**string 필드는 required_error와 invalid_type_error 모두 작성**:

```javascript
// ✅ Good - 두 에러 메시지 모두 명시
export const fireInspectionCreateFormSchema = toTypedSchema(
  z.object({
    title: z
      .string({
        required_error: '점검 제목을 입력해주세요',
        invalid_type_error: '점검 제목은 문자열이어야 합니다',
      })
      .min(1, '점검 제목을 입력해주세요'),

    description: z
      .string({
        required_error: '설명을 입력해주세요',
        invalid_type_error: '설명은 문자열이어야 합니다',
      })
      .optional(),
  }),
);

// ❌ Bad - 에러 메시지 누락
export const schema = toTypedSchema(
  z.object({
    title: z.string().min(1, '점검 제목을 입력해주세요'),
    description: z.string().optional(),
  }),
);
```

**에러 메시지 가이드:**

- `required_error`: 필수 입력 누락 시 표시 (사용자 친화적 메시지)
- `invalid_type_error`: 타입 불일치 시 표시 (일반적으로 개발 단계에서 발견)
- `.min(1)` 등 추가 validation은 별도 메시지 작성

### Schema와 Form Fields 동기화

```javascript
// ✅ Good - Schema matches form fields exactly
const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().min(1, '연락처를 입력해주세요'),
  email: z.string().email('이메일 형식이 올바르지 않습니다').optional(),
});

const { defineField } = useForm({ validationSchema: toTypedSchema(schema) });
const [name] = defineField('name');
const [phone] = defineField('phone');
const [email] = defineField('email');
```

### Feature Flag 처리

항상 true인 flag는 schema에서 제거하고 API 호출 시 추가:

```javascript
// ❌ Bad
const schema = z
  .object({
    useFlag: z.boolean(),
    depositBank: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.useFlag && !data.depositBank) {
      ctx.addIssue({ message: '은행을 선택해주세요', path: ['depositBank'] });
    }
  });

// ✅ Good
const schema = z.object({
  depositBank: z.string().min(1, '은행을 선택해주세요'),
});

const onSubmit = handleSubmit(async (values) => {
  await apiCall({ ...values, useFlag: true });
});
```

### 조건부 필수 필드

```javascript
const schema = z
  .object({
    type: z.enum(['INDIVIDUAL', 'BUSINESS']),
    businessNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'BUSINESS' && !data.businessNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '사업자번호를 입력해주세요',
        path: ['businessNumber'],
      });
    }
  });
```

### z.coerce.string() 주의

```javascript
// ❌ Wrong - undefined가 ""로 변환됨
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

## 디버깅

폼 제출이 안 될 때:

```javascript
const onSubmit = handleSubmit(
  async (values) => {
    console.log('✅ Validation passed:', values);
  },
  (errors) => {
    console.log('❌ Validation failed:', errors);
  },
);
```

## 체크리스트

- [ ] `useFormSubmit` 대신 `useForm` 사용
- [ ] schema는 `toTypedSchema(zodSchema)` 로 감싸기
- [ ] `handleSubmit`으로 제출 핸들러 감싸기
- [ ] form 태그에 `@submit="onSubmit"` 연결
- [ ] 버튼이 form 외부에 있으면 `form="formId"` 속성 추가
- [ ] 에러 표시: `errors.fieldName` 사용
- [ ] 폼 리셋: `resetForm()` 호출

---

**생성일:** 2025-01-15
**생성자:** 조태현
**최종 수정일:** 2025-02-06
**최종 수정자:** 이은영
