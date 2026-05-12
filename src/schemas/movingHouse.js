import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { TIME_REGEX } from '@/constants/regex.js';

// 이사예약 등록
export const movingHouseReservationFormSchema = toTypedSchema(
  z.object({
    moveType: z.enum(['MOVE_IN', 'MOVE_OUT'], {
      required_error: '이사유형은 필수 입력 항목입니다.',
    }),
    residentName: z
      .string({
        required_error: '이름은 필수 입력 항목입니다.',
      })
      .min(1, { message: '이름을 입력해주세요.' }),
    emergencyPhone: z
      .string({
        required_error: '비상 연락처는 필수 입력 항목입니다.',
      })
      .min(9, '올바른 전화번호를 입력해주세요.')
      .max(11, '올바른 전화번호를 입력해주세요.')
      .refine((value) => !Number.isNaN(Number(value)), {
        message: '전화번호는 숫자만 입력해주세요.',
      }),
    dong: z
      .string({
        required_error: '동 이름은 필수 입력 항목입니다.',
      })
      .min(1, '동 이름을 입력해주세요. (최소 1자 이상)'),
    ho: z
      .string({
        required_error: '호수는 필수 입력 항목입니다.',
      })
      .min(1, '호수를 입력해주세요. (최소 1자 이상)'),
    moveDate: z
      .date({
        required_error: '이사날짜를 선택해주세요',
        invalid_type_error: '이사날짜를 선택해주세요',
      })
      .refine(
        (value) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today;
        },
        {
          message: '오늘 이후의 날짜만 선택 가능합니다',
        },
      ),
    moveReservationTimeUuid: z
      .string({
        required_error: '이사시간을 선택해주세요',
      })
      .uuid('이사시간을 선택해주세요'),
    depositDate: z.date({
      required_error: '입금일자를 선택해주세요',
      invalid_type_error: '입금일자를 선택해주세요',
    }),
    depositorName: z
      .string({
        required_error: '입금자명은 필수 입력 항목입니다.',
      })
      .min(1, { message: '입금자명을 입력해주세요.' }),
    memo: z
      .string()
      .max(200, '메모는 최대 200자까지 입력 가능합니다.')
      .optional(),
  }),
);

const moveReservationTimeSchema = z.object({
  uuid: z.string().uuid().optional().nullable(),
  name: z
    .string({ required_error: '시간대 이름을 입력해주세요' })
    .min(1, '시간대 이름을 입력해주세요')
    .max(20, '시간대 이름은 최대 20자까지 입력 가능합니다'),
  startTime: z.string().regex(TIME_REGEX, '올바른 시간 형식이 아닙니다.'),
  endTime: z.string().regex(TIME_REGEX, '올바른 시간 형식이 아닙니다.'),
});

export const moveHouseSettingFormSchema = toTypedSchema(
  z.object({
    moveReservationTimeList: z
      .array(moveReservationTimeSchema)
      .min(1, '최소 1개의 시간대를 등록해주세요'),
    depositBank: z
      .string({ required_error: '은행을 선택해주세요' })
      .min(1, '은행을 선택해주세요'),
    depositAccount: z
      .string({ required_error: '계좌번호를 입력해주세요' })
      .min(1, '계좌번호를 입력해주세요')
      .regex(/^[0-9-]+$/, '계좌번호는 숫자와 하이픈(-)만 입력해주세요'),
    depositAccountHolder: z
      .string({ required_error: '예금주를 입력해주세요' })
      .min(1, '예금주를 입력해주세요'),
    moveReservationText: z.string().max(100).optional().nullable(),
    moveReservationPrice: z
      .number({
        required_error: '가격(숫자)을 입력해주세요',
        invalid_type_error: '가격(숫자)을 입력해주세요',
      })
      .int('가격은 정수여야 합니다')
      .min(0, '가격은 0 이상이어야 합니다'),
  }),
);
