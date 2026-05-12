import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';

import {
  ACCOUNT_REGEX,
  KOREAN_ENGLISH_NUMBER_REGEX,
  KOREAN_ENGLISH_REGEX,
  NUMBER_REGEX,
  STRING_TRIM_REGEX,
} from '@/constants/regex.js';

// 주차관리설정 등록, 수정
export const storeParkingSettingForm = toTypedSchema(
  z
    .object({
      parkingDiscountType: z.string({
        required_error: '할인 방식을 선택해주세요',
      }),
      billingType: z.string({
        required_error: '유료 정산 시간 처리 방식을 선택해주세요',
      }),
      bank: z
        .string()
        .optional()
        .nullable()
        .refine((val) => !val || KOREAN_ENGLISH_REGEX.test(val), {
          message: '은행명은 한글과 영문만 입력 가능합니다',
        })
        .refine((val) => !val || (val.length >= 2 && val.length < 20), {
          message: '은행명은 2자 이상 20자 미만으로 입력해주세요',
        }),
      accountHolder: z
        .string()
        .optional()
        .nullable()
        .refine((val) => !val || KOREAN_ENGLISH_REGEX.test(val), {
          message: '예금주명은 한글과 영문만 입력 가능합니다',
        })
        .refine((val) => !val || (val.length >= 2 && val.length < 30), {
          message: '예금주명은 2자 이상 30자 미만으로 입력해주세요',
        }),
      account: z
        .string()
        .optional()
        .nullable()
        .refine((val) => !val || ACCOUNT_REGEX.test(val), {
          message:
            '계좌번호는 숫자만 입력하거나 숫자-숫자 형식으로 입력해주세요',
        })
        .refine((val) => !val || (val.length >= 8 && val.length < 20), {
          message: '계좌번호는 8자 이상 20자 미만으로 입력해주세요',
        }),
      parkingPrice: z
        .number({
          required_error: '초과 요금 정산 기준을 입력해주세요',
          invalid_type_error: '초과 요금 정산 기준을 입력해주세요',
        })
        .refine((val) => NUMBER_REGEX.test(val), {
          message: '초과 요금 정산 기준은 숫자만 입력 가능합니다',
        }),
      turningCarPolicy: z.string({
        required_error: '초기 요금 방식을 선택해주세요',
      }),
      turningMinute: z
        .number({
          required_error: '무료 회차 제공 시간을 입력해주세요',
          invalid_type_error: '무료 회차 제공 시간을 입력해주세요',
        })
        .optional()
        .nullable()
        .refine((val) => !val || NUMBER_REGEX.test(val), {
          message: '무료 회차 제공 시간은 숫자만 입력 가능합니다',
        }),
    })
    .superRefine((data, ctx) => {
      // 유료 정산 시간 처리 방식이 'PREPAID'일 때 관련 필드 검증
      if (data.billingType === 'PREPAID') {
        if (!data.bank || data.bank.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '계좌 정보를 올바르게 입력해주세요',
            path: ['bank'],
          });
        }
        if (!data.accountHolder || data.accountHolder.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '계좌 정보를 올바르게 입력해주세요',
            path: ['accountHolder'],
          });
        }
        if (!data.account || data.account.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '계좌 정보를 올바르게 입력해주세요',
            path: ['account'],
          });
        }
      }

      // 초기 요금 방식이 'YES'일 때 무료 회차 제공 시간 필드 검증
      if (data.turningCarPolicy === 'YES') {
        if (!data.turningMinute) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '무료 회차 제공 시간을 입력해주세요',
            path: ['turningMinute'],
          });
        }
      }
    })
    .transform((data) => {
      // 조건에 따라 필드 제거
      const result = { ...data };

      // PREPAID가 아닐 경우 계좌 관련 필드 제거
      if (data.billingType !== 'PREPAID') {
        delete result.bank;
        delete result.accountHolder;
        delete result.account;
      }

      // YES가 아닐 경우 무료 회차 제공 시간 필드 제거
      if (data.turningCarPolicy !== 'YES') {
        delete result.turningMinute;
      }

      return result;
    }),
);

// 상가 등록 및 수정 공통 form
const storeManagementForm = {
  storeName: z
    .string({
      required_error: '상가명을 입력해주세요',
    })
    .min(2, { message: '상가명은 2자 이상 30자 미만으로 입력해주세요.' })
    .max(30, { message: '상가명은 30자 미만으로 입력해주세요.' })
    .regex(STRING_TRIM_REGEX, {
      message: '상가명을 올바르게 입력해주세요',
    }),
  representativePhone: z
    .string({
      required_error: '대표 연락처를 입력해주세요',
    })
    .min(1, { message: '대표 연락처를 1자 이상 30자 미만으로 입력해주세요.' })
    .max(30, {
      message: '대표 연락처를 30자 미만으로 입력해주세요.',
    })
    .regex(NUMBER_REGEX, {
      message: '대표 연락처는 숫자만 입력 가능합니다.',
    }),
  representativeName: z
    .string({
      required_error: '대표자 이름을 입력해주세요',
    })
    .min(2, { message: '대표 연락처를 2자 이상 30자 미만으로 입력해주세요.' })
    .max(30, { message: '대표 연락처를 30자 미만으로 입력해주세요.' })
    .regex(KOREAN_ENGLISH_NUMBER_REGEX, {
      message: '대표 이름은 한글, 영문 대소문자, 숫자만 입력 가능합니다.',
    }),
  freeParkingDiscountHours: z.number({
    required_error: '무료제공시간을 선택해주세요',
    invalid_type_error: '무료제공시간을 선택해주세요',
  }),
  freeParkingDiscountMinutes: z.number({
    required_error: '무료제공시간을 선택해주세요',
    invalid_type_error: '무료제공시간을 선택해주세요',
  }),
};

// 상가 등록
export const storeManagementAddForm = toTypedSchema(
  z.object({
    storeDong: z
      .string({
        required_error: '동을 입력해주세요',
      })
      .min(1, { message: '동은 1자 이상 30자 미만으로 입력해주세요.' })
      .max(30, { message: '동은 10자 미만으로 입력해주세요.' })
      .regex(KOREAN_ENGLISH_NUMBER_REGEX, {
        message: '동은 한글, 영문 대소문자, 숫자만 입력 가능합니다.',
      }),
    storeHo: z
      .string({
        required_error: '호수를 입력해주세요',
      })
      .min(1, { message: '호수는 1자 이상 30자 미만으로 입력해주세요.' })
      .max(30, { message: '호수는 30자 미만으로 입력해주세요.' })
      .regex(KOREAN_ENGLISH_NUMBER_REGEX, {
        message: '호수는 한글, 영문 대소문자, 숫자만 입력 가능합니다.',
      }),
    ...storeManagementForm,
  }),
);

// 상가 수정
export const storeManagementEditForm = toTypedSchema(
  z.object({ ...storeManagementForm }),
);

// 상가 삭제
export const storeManagementDeleteConfirmForm = (expectedString) => {
  return toTypedSchema(
    z.object({
      storeName: z
        .string({
          required_error: '확인 문구를 입력해주세요',
        })
        .min(2, { message: '2자 이상 30자 미만으로 입력해주세요.' })
        .max(30, { message: '30자 미만으로 입력해주세요.' })
        .refine((val) => val === expectedString, {
          message: '확인 문구를 정확하게 입력해주세요',
        }),
    }),
  );
};
