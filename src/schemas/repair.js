import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { ACCEPTED_IMAGE_TYPES } from '@/constants/common.js';
import { DATE_TIME_REGEX, PHONE_REGEX } from '@/constants/regex.js';

const imageListSchema = z
  .array(
    z
      .instanceof(File, {
        message: '파일을 선택해주세요.',
      })
      .refine(
        (file) => file.size <= 10 * 1024 * 1024, // 10MB
        {
          message: '파일 크기는 10MB 이하여야 합니다.',
        },
      )
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: '파일 형식은 jpg, jpeg, png, gif만 가능합니다.',
      }),
  )
  .max(5, '최대 5개의 이미지 파일만 첨부할 수 있습니다.')
  .optional()
  .default([]);

// 하자보수 접수
export const repairFormSchema = toTypedSchema(
  z
    .object({
      phone: z
        .string({
          required_error: '전화번호는 필수 입력 항목입니다.',
        })
        .min(1, { message: '전화번호는 필수 입력 항목입니다.' })
        .refine((data) => PHONE_REGEX.test(data), {
          message: '전화번호는 올바른 형식이어야 합니다.',
        }),
      residentUuid: z
        .string({
          required_error: '입주민 정보를 검색해주세요.',
        })
        .min(10, '입주민 정보를 검색해주세요.'),
      dong: z.string({
        required_error: '입주민 정보를 검색해주세요.',
      }),
      ho: z.string({
        required_error: '입주민 정보를 검색해주세요.',
      }),
      name: z
        .string({
          required_error: '입주민 정보를 검색해주세요.',
        })
        .min(1, { message: '입주민 정보를 검색해주세요.' }),
      emergencyPhone: z
        .string()
        .refine((data) => (data ? PHONE_REGEX.test(data) : true), {
          message: '전화번호는 올바른 형식이어야 합니다.',
        })
        .optional(),
      content: z
        .string({
          required_error: '접수 내용은 필수 입력 항목입니다.',
        })
        .min(1, '접수 내용을 입력해주세요.')
        .max(200, '접수 내용은 200자 이하여야 합니다.'),
      location: z
        .string({
          required_error: '위치 정보는 필수 입력 항목입니다.',
        })
        .min(1, '위치 정보를 입력해주세요.')
        .max(200, '위치 정보는 200자 이하여야 합니다.'),
      requirement: z
        .string({
          required_error: '요청 사항은 필수 입력 항목입니다.',
        })
        .max(200, '요청 사항은 200자 이하여야 합니다.')
        .optional(),
      fileList: imageListSchema,
    })
    .transform((data) => {
      // undefined, null, 빈 문자열 제거
      return Object.fromEntries(
        Object.entries(data).filter(
          ([, value]) => value !== undefined && value !== null && value !== '',
        ),
      );
    }),
);

// 하자보수 접수 회원 정보 조회
export const getMemberInfoByPhoneSchema = z.object({
  phone: z
    .string({
      required_error: '전화번호는 필수 입력 항목입니다.',
    })
    .min(9, '올바른 전화번호를 입력해주세요.')
    .max(11, '올바른 전화번호를 입력해주세요.')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: '전화번호는 숫자만 입력해주세요.',
    }),
});

// 하자보수 상태 선택
export const repairStateSelectorSchema = z
  .object({
    repairUuid: z.string({
      required_error: '접수 번호는 필수 입력 항목입니다.',
      invalid_type_error: '접수 번호는 문자열이어야 합니다.',
    }),
    state: z.string({
      required_error: '접수 상태는 필수 입력 항목입니다.',
      invalid_type_error: '접수 상태는 문자열이어야 합니다.',
    }),
    adminComment: z
      .string({
        required_error: '관리자 메모는 필수 입력 항목입니다.',
        invalid_type_error: '관리자 메모는 문자열이어야 합니다.',
      })
      .nullable()
      .optional(),
    visitDateTime: z
      .string({
        required_error: '방문 예정일은 필수 입력 항목입니다.',
      })
      .transform((val) => val || '')
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !['WAITING', 'RECEIVED', 'COMPLETED', 'IMPOSSIBLE'].includes(data.state)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          '접수 상태는 접수대기, 접수완료, 처리완료, 처리불가 중 하나여야 합니다.',
        path: ['state'],
      });
    }

    if (
      (data.state === 'RECEIVED' || data.state === 'IMPOSSIBLE') &&
      (data.adminComment === null ||
        data.adminComment === '' ||
        data.adminComment === undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '비고는 필수 입력 항목입니다.',
        path: ['adminComment'],
      });
    }

    if (
      data.state === 'RECEIVED' &&
      (data.visitDateTime === null || data.visitDateTime === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '방문 예정일을 입력해주세요.',
        path: ['visitDateTime'],
      });
    } else if (
      data.state === 'RECEIVED' &&
      data.visitDateTime !== null &&
      data.visitDateTime !== ''
    ) {
      if (!DATE_TIME_REGEX.test(data.visitDateTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '방문 예정일을 입력해주세요.',
          path: ['visitDateTime'],
        });
      }
    }
  });
