import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';

import { AUTH_TYPE } from '@/constants/vote.js';

const voteAuthTypeArray = AUTH_TYPE.map((type) => type.key);

// 전자투표 그룹 생성
export const voteCreateGroupFormSchema = toTypedSchema(
  z.object({
    groupName: z
      .string({
        required_error: '이름을 입력해주세요',
        invalid_type_error: '이름을 올바르게 입력해주세요',
      })
      .trim()
      .min(1, { message: '1자 이상 입력해주세요' }),
  }),
);

const voteTitleSchema = {
  title: z
    .string({
      required_error: '제목을 입력해주세요',
      invalid_type_error: '제목을 올바르게 입력해주세요',
    })
    .trim()
    .min(1, '1자 이상 입력해주세요')
    .max(50, '50자 이내로 입력해주세요'),
};

const voteTypeSchema = {
  voteType: z.enum(['REPRESENT', 'NORMAL', 'AGAINST'], {
    required_error: '유형을 선택해주세요',
  }),
};

// 전자투표 투표 생성
export const voteCreateVoteFormSchema = toTypedSchema(
  z.object({
    ...voteTitleSchema,
    ...voteTypeSchema,
  }),
);

// 전자투표 투표명 수정
export const voteEditVoteFormSchema = toTypedSchema(
  z.object({
    ...voteTitleSchema,
  }),
);

// 전자투표 투표 저장 : 기본정보
export const voteSaveVoteFormDefaultSchema = toTypedSchema(
  z.object({
    ...voteTitleSchema,
    ...voteTypeSchema,
    voteAuthType: z.enum(voteAuthTypeArray, {
      required_error: '유형을 선택해주세요',
    }),
    voteManagerName: z
      .string({
        required_error: '담당자 이름을 입력해주세요',
        invalid_type_error: '담당자 이름을 올바르게 입력해주세요',
      })
      .trim()
      .min(1, '1자 이상 입력해주세요')
      .max(10, '10자 이내로 입력해주세요'),
    voteManagerPosition: z
      .string({
        required_error: '담당자 직책을 입력해주세요',
        invalid_type_error: '담당자 직책을 올바르게 입력해주세요',
      })
      .trim()
      .min(1, '1자 이상 입력해주세요')
      .max(20, '20자 이내로 입력해주세요'),
  }),
);

// 전자투표 투표 저장 : 질문항목
export const voteSaveVoteFormQuestionSchema = toTypedSchema(
  z.object({
    questionForm: z
      .array(
        z.object({
          content: z.string().trim().min(1, '1자 이상 입력해주세요'),
          options: z
            .array(
              z.object({
                content: z.string().trim().min(1, '1자 이상 입력해주세요'),
              }),
            )
            .min(2, '최소 두 개 이상의 옵션을 추가해주세요'),
        }),
      )
      .min(1, '최소 한 개의 질문을 추가해주세요'),
  }),
);

// 전자투표 투표 제출/완성
export const voteSubmitSchema = toTypedSchema(
  z
    .object({
      openVoteDate: z.date({
        required_error: '시작 날짜를 선택해주세요',
        invalid_type_error: '시작 날짜를 선택해주세요',
      }),
      openVoteHours: z.string({
        required_error: '시간을 선택해주세요',
      }),
      openVoteMinutes: z.string({
        required_error: '분을 선택해주세요',
      }),
      closeVoteDate: z.date({
        required_error: '종료 날짜를 선택해주세요',
        invalid_type_error: '종료 날짜를 선택해주세요',
      }),
      closeVoteHours: z.string({
        required_error: '시간을 선택해주세요',
      }),
      closeVoteMinutes: z.string({
        required_error: '분을 선택해주세요',
      }),
    })
    .superRefine((data, context) => {
      // 입력한 시작일시
      const openDateTime = new Date(data.openVoteDate);
      openDateTime.setHours(
        Number(data.openVoteHours),
        Number(data.openVoteMinutes),
        0,
      );

      // 입력한 종료일시
      const closeDateTime = new Date(data.closeVoteDate);
      closeDateTime.setHours(
        Number(data.closeVoteHours),
        Number(data.closeVoteMinutes),
        0,
      );

      const ONE_HOURS_IN_MS = 60 * 60 * 1000;
      const currentOneHourLater = new Date(
        new Date().getTime() + ONE_HOURS_IN_MS,
      );

      // 시작일시 검증
      if (openDateTime <= currentOneHourLater) {
        context.addIssue({
          path: ['openVoteDate'],
          code: z.ZodIssueCode.custom,
          message: '현재부터 1시간 이후를 선택해주세요.',
        });
      }

      // 종료일시 검증
      if (closeDateTime <= openDateTime) {
        context.addIssue({
          path: ['closeVoteDate'],
          code: z.ZodIssueCode.custom,
          message: '시작일시보다 커야 합니다',
        });
      }
    }),
);

// 전자투표 리스트 > 투표 삭제 확인문구
export const voteDeleteVoteConfirmSchema = toTypedSchema(
  z.object({
    confirmationText: z
      .string({
        required_error: '확인 문구를 입력해 주세요.',
      })
      .trim()
      .min(1, { message: '확인 문구를 입력해 주세요.' })
      .refine(
        (val) => {
          return val === '삭제하기';
        },
        {
          message: `입력한 값이 일치하지 않습니다.`,
        },
      ),
  }),
);

// 전자투표 수정 > 날짜 변경 확인문구
export const voteDateEditConfirmSchema = toTypedSchema(
  z.object({
    confirmationText: z
      .string({
        required_error: '확인 문구를 입력해 주세요.',
      })
      .min(1, { message: '확인 문구를 입력해 주세요.' })
      .trim()
      .refine(
        (val) => {
          return val === '변경하기';
        },
        {
          message: `입력한 값이 일치하지 않습니다.`,
        },
      ),
  }),
);

// 전자투표 문자 예약 발송
export const getVoteSmsReservationSchema = (openTime, closeTime) =>
  toTypedSchema(
    z
      .object({
        reservationDate: z.date({
          required_error: '예약 날짜를 선택해주세요',
          invalid_type_error: '유효한 날짜를 선택해주세요',
        }),
        reservationHours: z.string({
          required_error: '시간을 선택해주세요',
          invalid_type_error: '시간을 선택해주세요',
        }),
        reservationMinutes: z.string({
          required_error: '분을 선택해주세요',
          invalid_type_error: '분을 선택해주세요',
        }),
      })
      .superRefine((data, context) => {
        const { reservationDate, reservationHours, reservationMinutes } = data;

        // 선택된 예약 일시를 Date 객체로 생성
        const selectedDate = new Date(reservationDate);
        selectedDate.setHours(
          Number(reservationHours),
          Number(reservationMinutes),
          0,
        );

        const open = new Date(openTime);
        const close = new Date(closeTime);

        const currentTime = new Date();

        if (selectedDate < open) {
          context.addIssue({
            path: ['reservationDate'],
            code: z.ZodIssueCode.custom,
            message: '예약 일시는 투표 시작 시간 이후여야 합니다.',
          });
        }

        if (selectedDate <= currentTime) {
          context.addIssue({
            path: ['reservationDate'],
            code: z.ZodIssueCode.custom,
            message: '예약 일시는 현재 시간 이후를 선택해주세요.',
          });
        }

        if (selectedDate >= close) {
          context.addIssue({
            path: ['reservationDate'],
            code: z.ZodIssueCode.custom,
            message: '예약 일시는 투표 종료 시간보다 빨라야 합니다.',
          });
        }
      }),
  );
