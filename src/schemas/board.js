import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import {
  BOARD_SETTING_AUTHOR_OPTION_LIST,
  BOARD_SETTING_HOUSEHOLD_INFO_OPTION_LIST,
} from '@/constants/board.js';

export const boardCommentInputSchema = z
  .object({
    content: z
      .string()
      .max(500, { message: '댓글 내용은 최대 500자까지 입력할 수 있습니다.' })
      .optional(),
    imageFileUuid: z.string().optional().nullable(),
  })
  .refine((data) => data.content?.trim() || data.imageFileUuid, {
    message: '댓글 내용 또는 이미지 중 하나는 필수입니다.',
    path: ['content'],
  });

// /////////////////////////////////////////////////////////////////////////
// 전체 공지사항
// /////////////////////////////////////////////////////////////////////////

const imageFileUuidValidation = z
  .array(z.string().min(1, '이미지 파일을 선택해주세요.'))
  .optional()
  .nullable();

const attachmentFileValidation = z
  .array(
    z
      .instanceof(File, {
        message: '파일을 선택해주세요.',
      })
      .refine(
        (file) => file.size <= 20 * 1024 * 1024, // 20MB
        {
          message: '파일 크기는 20MB 이하여야 합니다.',
        },
      )
      .refine((file) => file.type === 'application/pdf', {
        message: '파일 형식은 pdf만 가능합니다.',
      }),
  )
  .max(5, '최대 5개의 파일만 첨부할 수 있습니다.')
  .optional()
  .nullable();

export const globalNoticeFormCreationSchema = toTypedSchema(
  z
    .object({
      categoryUuid: z.string().min(1, '카테고리를 선택해주세요.'),
      content: z.any().optional(),
      apartmantNoticeType: z.enum(
        [
          'RESIDENT_ALL_NOTICE',
          'RESIDENT_INDIVIDUAL_NOTICE',
          'APT_ADMIN_ALL_NOTICE',
          'APT_ADMIN_INDIVIDUAL_NOTICE',
        ],
        {
          required_error: '공지 타입을 선택해주세요.',
        },
      ),
      title: z
        .string()
        .nullable()
        .transform((val) => val || '')
        .pipe(
          z
            .string()
            .trim()
            .min(1, '제목을 입력해주세요.')
            .max(50, '50자 이내로 입력해주세요'),
        ),

      selectedApartments: z
        .array(
          z.object({
            aptUuid: z.string(),
            aptName: z.string(),
          }),
        )
        .optional(),
      selectedServices: z.array(z.string()), // 서비스 UUID 배열
      uploadFile: attachmentFileValidation,
      imageFileUuidList: imageFileUuidValidation,
      thumbnailImage: z.any().optional().nullable(), // 썸네일 이미지는 선택사항
      pushFlag: z.boolean({
        required_error: '푸시 알림 전송 여부는 필수 입력 항목입니다.',
      }),
    })
    .refine(
      (data) => {
        // 값이 있는지 체크
        if (!data.content) return false;

        // Delta 객체면 실제 내용 있는지 체크
        if (data.content?.ops && Array.isArray(data.content.ops)) {
          return data.content.ops.some(
            (op) =>
              (op.insert &&
                typeof op.insert === 'string' &&
                op.insert.trim() !== '' &&
                op.insert !== '\n') ||
              typeof op.insert === 'object', // 이미지나 기타 객체 삽입인 경우
          );
        }

        // 문자열이면 빈 문자열 아닌지 체크
        if (typeof data.content === 'string') {
          return data.content.trim().length > 0;
        }

        return false;
      },
      { message: '공지사항 본문 내용을 입력해주세요.', path: ['content'] },
    )
    .refine(
      (data) => {
        // INDIVIDUAL_NOTICE: 아파트 필수 선택
        if (data.apartmantNoticeType?.includes('INDIVIDUAL_NOTICE')) {
          return data.selectedApartments && data.selectedApartments.length > 0;
        }

        // ALL_NOTICE: 아파트 선택은 선택사항 (블랙리스트용)
        // 서비스만 필수이므로 아파트는 검증하지 않음
        return true;
      },
      {
        message: '대상 아파트를 선택해주세요.',
        path: ['selectedApartments'],
      },
    )
    .refine(
      (data) => {
        // ALL_NOTICE: 서비스 필수
        if (data.apartmantNoticeType?.includes('ALL_NOTICE')) {
          return data.selectedServices && data.selectedServices.length > 0;
        }

        return true; // INDIVIDUAL_NOTICE는 서비스 선택 불필요
      },
      {
        message: '대상 서비스를 선택해주세요.',
        path: ['selectedServices'],
      },
    ),
);

export const globalNoticeFormUpdateSchema = toTypedSchema(
  z
    .object({
      categoryUuid: z.string().min(1, '카테고리를 선택해주세요.'),
      title: z
        .string({
          required_error: '제목은 필수 입력 항목입니다.',
        })
        .min(1, '제목을 입력해주세요.'),
      content: z.any(), // 타입 체크 없이 통과 (폼 제출 시 별도 검증)
      apartmantNoticeType: z.enum(
        [
          'RESIDENT_ALL_NOTICE',
          'RESIDENT_INDIVIDUAL_NOTICE',
          'APT_ADMIN_ALL_NOTICE',
          'APT_ADMIN_INDIVIDUAL_NOTICE',
        ],
        {
          required_error: '공지 타입을 선택해주세요.',
        },
      ),
      selectedApartments: z
        .array(
          z.object({
            aptUuid: z.string(),
            aptName: z.string(),
          }),
        )
        .optional(),
      selectedServices: z.array(z.string()).optional(), // 서비스 UUID 배열
      uploadFile: attachmentFileValidation,
      imageFileUuidList: imageFileUuidValidation,
      thumbnailImage: z.any().optional().nullable(), // 썸네일 이미지는 선택사항
    })
    .refine(
      (data) => {
        // INDIVIDUAL_NOTICE: 아파트만 필수
        if (data.apartmantNoticeType?.includes('INDIVIDUAL_NOTICE')) {
          return data.selectedApartments && data.selectedApartments.length > 0;
        }

        // ALL_NOTICE: 아파트는 선택사항(블랙리스트용)
        return true;
      },
      {
        message: '대상 아파트를 선택해주세요.',
        path: ['selectedApartments'], // 에러가 selectedApartments 필드에 표시되도록
      },
    )
    .refine(
      (data) => {
        // ALL_NOTICE: 서비스 필수
        if (data.apartmantNoticeType?.includes('ALL_NOTICE')) {
          return data.selectedServices && data.selectedServices.length > 0;
        }

        return true; // INDIVIDUAL_NOTICE는 서비스 선택 불필요
      },
      {
        message: '대상 서비스를 선택해주세요.',
        path: ['selectedServices'], // 에러가 selectedServices 필드에 표시되도록
      },
    ),
);

// /////////////////////////////////////////////////////////////////////////
// 공지사항
// /////////////////////////////////////////////////////////////////////////

export const noticeFormCreationSchema = z
  .object({
    title: z
      .string({
        required_error: '제목은 필수 입력 항목입니다.',
      })
      .min(1, '제목을 입력해주세요.'),
    noticeType: z.enum(['GENERAL', 'IMPORTANT'], {
      required_error: '공지 유형은 필수 입력 항목입니다.',
    }),
    categoryUuid: z
      .string({
        required_error: '카테고리를 선택해주세요.',
      })
      .min(10, '카테고리를 선택해주세요.'),
    pushFlag: z.boolean({
      required_error: '푸시 알림 전송 여부는 필수 입력 항목입니다.',
    }),
    content: z.any().optional(),
  })
  .refine(
    (data) => {
      if (!data.content) return false;

      // Delta 객체면 실제 내용 있는지 체크
      if (data.content?.ops && Array.isArray(data.content.ops)) {
        return data.content.ops.some(
          (op) =>
            (op.insert &&
              typeof op.insert === 'string' &&
              op.insert.trim() !== '' &&
              op.insert !== '\n') ||
            typeof op.insert === 'object',
        );
      }

      // 문자열이면 빈 문자열 아닌지 체크
      if (typeof data.content === 'string') {
        return data.content.trim().length > 0;
      }

      return false;
    },
    { message: '공지사항 본문 내용을 입력해주세요.', path: ['content'] },
  );

export const noticeFormUpdateSchema = z
  .object({
    title: z
      .string({
        required_error: '제목은 필수 입력 항목입니다.',
      })
      .min(1, '제목을 입력해주세요.'),
    noticeType: z.enum(['GENERAL', 'IMPORTANT'], {
      required_error: '공지 유형은 필수 입력 항목입니다.',
    }),
    categoryUuid: z
      .string({
        required_error: '카테고리를 선택해주세요.',
      })
      .min(10, '카테고리를 선택해주세요.'),
    content: z.any().optional(),
  })
  .refine(
    (data) => {
      if (!data.content) return false;

      // Delta 객체면 실제 내용 있는지 체크
      if (data.content?.ops && Array.isArray(data.content.ops)) {
        return data.content.ops.some(
          (op) =>
            (op.insert &&
              typeof op.insert === 'string' &&
              op.insert.trim() !== '' &&
              op.insert !== '\n') ||
            typeof op.insert === 'object',
        );
      }

      // 문자열이면 빈 문자열 아닌지 체크
      if (typeof data.content === 'string') {
        return data.content.trim().length > 0;
      }

      return false;
    },
    { message: '공지사항 본문 내용을 입력해주세요.', path: ['content'] },
  );

// /////////////////////////////////////////////////////////////////////////
// 게시판 블랙리스트
// /////////////////////////////////////////////////////////////////////////

export const boardBlackListFormSchema = toTypedSchema(
  z.object({
    reason: z
      .string({
        required_error: '사유는 필수 입력 항목입니다.',
      })
      .min(1, { message: '사유는 필수 입력 항목입니다.' })
      .max(250, { message: '사유는 최대 250자까지 입력할 수 있습니다.' }),
  }),
);

// /////////////////////////////////////////////////////////////////////////
// 게시판 정책 설정
// /////////////////////////////////////////////////////////////////////////

const householdInfoKeys = BOARD_SETTING_HOUSEHOLD_INFO_OPTION_LIST.map(
  (option) => option.key,
);
const authorKeys = BOARD_SETTING_AUTHOR_OPTION_LIST.map((option) => option.key);

const policySchema = z.object({
  householdInfo: z.enum(householdInfoKeys),
  author: z.enum(authorKeys),
});

export const boardSettingFormSchema = toTypedSchema(
  z.object({
    communityPolicy: z.object({
      post: policySchema,
      comment: policySchema,
    }),
    complaintPolicy: z.object({
      post: policySchema,
      comment: policySchema,
    }),
  }),
);
