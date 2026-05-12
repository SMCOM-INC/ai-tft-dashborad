import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import {
  CAR_NUM_REGEX,
  PHONE_REGEX,
  PHONE_REGEX_LENGTH,
} from '@/constants/regex.js';

const baseSchema = {
  dong: z
    .string({ required_error: '동을 입력해주세요.' })
    .trim()
    .min(1, '동을 입력해주세요.'),
  ho: z
    .string({ required_error: '호를 입력해주세요.' })
    .trim()
    .min(1, '호수를 입력해주세요.'),
};

// /////////////////////////////////////////////////////////////////////////
// 주차관리 설정
// /////////////////////////////////////////////////////////////////////////
export const createAptHouseholdMileagePolicySchema = z.object({
  baseMileage: z
    .number({
      required_error: '월 기본 마일리지는 필수 입력 항목입니다.',
      invalid_type_error: '월 기본 마일리지는 숫자여야 합니다.',
    })
    .min(0, { message: '월 기본 마일리지는 최소 0 이상이여야 합니다.' }),
  hourAmount: z
    .number({
      required_error: '시간당 과금 금액은 필수 입력 항목입니다.',
      invalid_type_error: '시간당 과금 금액은 숫자여야 합니다.',
    })
    .min(0, { message: '시간당 과금 금액은 최소 0 이상이여야 합니다.' }),
});

export const updateAptHouseholdMileagePolicySchema = z.object({
  monthBaseMileage: z
    .number({
      required_error: '월 기본 마일리지는 필수 입력 항목입니다.',
      invalid_type_error: '월 기본 마일리지는 숫자여야 합니다.',
    })
    .min(0, { message: '월 기본 마일리지는 최소 0 이상이여야 합니다.' }),
  hourlyPrice: z
    .number({
      required_error: '시간당 과금 금액은 필수 입력 항목입니다.',
      invalid_type_error: '시간당 과금 금액은 숫자여야 합니다.',
    })
    .min(0, { message: '시간당 과금 금액은 최소 0 이상이여야 합니다.' }),
});

// /////////////////////////////////////////////////////////////////////////
// 정기차량
// /////////////////////////////////////////////////////////////////////////

// 정기차량 기본 스키마
const regularCarFormBase = z.object({
  carNum: z
    .string({
      required_error: '차량 번호는 필수 입력 항목입니다.',
    })
    .min(1, { message: '차량 번호는 필수 입력 항목입니다.' })
    .refine((data) => CAR_NUM_REGEX.test(data), {
      message: '차량 번호는 올바른 형식이어야 합니다.',
    }),
  phone: z
    .string({
      required_error: '전화번호는 필수 입력 항목입니다.',
    })
    .min(1, { message: '전화번호는 필수 입력 항목입니다.' })
    .regex(PHONE_REGEX, '전화번호는 올바른 형식이어야 합니다.'),
  name: z
    .string({
      required_error: '이름은 필수 입력 항목입니다.',
    })
    .min(1, { message: '이름은 필수 입력 항목입니다.' })
    .max(20, { message: '이름은 20자 이하여야 합니다.' }),
  memo: z.string().optional(),
  startDate: z.date({
    required_error: '시작 날짜는 필수 입력 항목입니다.',
    invalid_type_error: '시작 날짜는 필수 입력 항목입니다.',
  }),
  endDate: z.date({
    required_error: '종료 날짜는 필수 입력 항목입니다.',
    invalid_type_error: '종료 날짜는 필수 입력 항목입니다.',
  }),
});

// 정기차량 세대 스키마
const regularCarFormBaseWithHousehold = regularCarFormBase.extend({
  regularCarType: z.enum(['RESIDENT', 'REGULAR'], {
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_enum_value') {
        return { message: '정기차량 유형은 필수 입력 항목입니다.' };
      }
      return { message: ctx.defaultError };
    },
  }),
  dong: z.string({
    required_error: '동은 필수 입력 항목입니다.',
  }),
  ho: z.string({
    required_error: '호수는 필수 입력 항목입니다.',
  }),
});

// 정기차량 업무 스키마
const regularCarFormBaseWithBusiness = regularCarFormBase.extend({
  businessTypeUuid: z.string({
    required_error: '업무 목적은 필수 입력 항목입니다.',
  }),
});

// 정기차량 월패드 알림 스키마 확장 옵션
const withWallPadAlarm = {
  parkingWallPadAlarm: z.boolean({
    required_error: '입출차 시 월패드 알림을 선택해주세요.',
  }),
};

// 정기차량 날짜 검증 로직을 일반 함수로 정의
const createValidDate = (schema) => {
  // 항상 적용되는 조건: 종료일이 시작일보다 이후여야 함
  return schema.refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    {
      message: '종료일이 시작일보다 이전일 수 없습니다.',
      path: ['endDate'],
    },
  );
};

// 정기차량 스키마 팩토리 함수
export const getRegularCarFormSchema = ({
  type = 'base',
  withAlarm = false,
}) => {
  // 기본 스키마 선택
  let regularBaseSchema;
  switch (type) {
    case 'house':
      regularBaseSchema = regularCarFormBaseWithHousehold;
      break;
    case 'business':
      regularBaseSchema = regularCarFormBaseWithBusiness;
      break;
    default:
      regularBaseSchema = regularCarFormBase;
  }

  // 알람 추가
  if (withAlarm && type === 'house') {
    regularBaseSchema = regularBaseSchema.extend(withWallPadAlarm);
  }

  // 날짜 검증 적용
  return createValidDate(regularBaseSchema);
};

// /////////////////////////////////////////////////////////////////////////
// 방문예약
// /////////////////////////////////////////////////////////////////////////

// 방문예약 form
export const visitReservationFormSchema = z.object({
  carNum: z
    .string({
      required_error: '차량 번호는 필수 입력 항목입니다.',
    })
    .min(1, { message: '차량 번호는 필수 입력 항목입니다.' })
    .refine((data) => CAR_NUM_REGEX.test(data), {
      message: '차량 번호는 올바른 형식이어야 합니다.',
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
  inoutParkingScheduledDate: z
    .union([
      z.array(
        z.date({
          required_error: '기간을 선택해주세요',
          invalid_type_error: '기간을 선택해주세요',
        }),
      ),
      z.date({
        required_error: '기간을 선택해주세요',
        invalid_type_error: '기간을 선택해주세요',
      }),
    ])
    .nullish()
    .refine((value) => value !== null && value !== undefined, {
      message: '기간을 선택해주세요',
    })
    .refine(
      (value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Array.isArray(value)) {
          return value[0] >= today;
        }
        return value >= today;
      },
      {
        message: '오늘 이후의 날짜만 선택 가능합니다',
      },
    ),
  phone: z
    .string({
      required_error: '전화번호는 필수 입력 항목입니다.',
    })
    .min(9, '올바른 전화번호를 입력해주세요.')
    .max(11, '올바른 전화번호를 입력해주세요.')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: '전화번호는 숫자만 입력해주세요.',
    }),
  visitPurposeUuid: z
    .string({
      required_error: '방문 목적은 필수 입력 항목입니다.',
    })
    .min(1, { message: '방문 목적을 선택해주세요.' }),
});

// 방문예약 form with 월패드 알림 추가
export const visitReservationFormSchemaWithWallPadAlarm =
  visitReservationFormSchema.extend({
    parkingWallPadAlarm: z.boolean({
      required_error: '입출차 시 월패드 알림을 선택해주세요.',
    }),
  });

// /////////////////////////////////////////////////////////////////////////
// 항상허용
// /////////////////////////////////////////////////////////////////////////

// 항상허용 form
export const alwaysAllowFormSchema = z.object({
  carNum: z
    .string({
      required_error: '차량 번호는 필수 입력 항목입니다.',
    })
    .min(1, { message: '차량 번호는 필수 입력 항목입니다.' })
    .refine((data) => CAR_NUM_REGEX.test(data), {
      message: '차량 번호는 올바른 형식이어야 합니다.',
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
  phone: z
    .string({
      required_error: '전화번호는 필수 입력 항목입니다.',
    })
    .min(9, '올바른 전화번호를 입력해주세요.')
    .max(11, '올바른 전화번호를 입력해주세요.')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: '전화번호는 숫자만 입력해주세요.',
    }),
  visitPurposeUuid: z
    .string({
      required_error: '방문 목적은 필수 입력 항목입니다.',
    })
    .min(1, { message: '방문 목적을 선택해주세요.' }),
  memo: z.string().optional(),
});

// 항상허용 form with 월패드 알림
export const alwaysAllowFormSchemaWithWallPadAlarm =
  alwaysAllowFormSchema.extend({
    parkingWallPadAlarm: z.boolean({
      required_error: '입출차 시 월패드 알림을 선택해주세요.',
    }),
  });

// /////////////////////////////////////////////////////////////////////////
// 입출차내역, 미출차내역
// /////////////////////////////////////////////////////////////////////////

// 입출차내역 form
export const inOutHistoryFormSchema = toTypedSchema(
  z
    .object({
      carNum: z
        .string({
          required_error: '차량 번호는 필수 입력 항목입니다.',
        })
        .min(1, { message: '차량 번호는 필수 입력 항목입니다.' })
        .refine((data) => CAR_NUM_REGEX.test(data), {
          message: '차량 번호는 올바른 형식이어야 합니다.',
        }),
      openDate: z.date({
        required_error: '입차 일시를 선택해주세요',
        invalid_type_error: '입차 일시를 선택해주세요',
      }),
      openHours: z.string({
        required_error: '시간을 선택해주세요',
        invalid_type_error: '시간을 선택해주세요',
      }),
      openMinutes: z.string({
        required_error: '분을 선택해주세요',
        invalid_type_error: '분을 선택해주세요',
      }),
      closeDate: z.date({
        required_error: '출차 일시를 선택해주세요',
        invalid_type_error: '출차 일시를 선택해주세요',
      }),
      closeHours: z.string({
        required_error: '시간을 선택해주세요',
        invalid_type_error: '시간을 선택해주세요',
      }),
      closeMinutes: z.string({
        required_error: '분을 선택해주세요',
        invalid_type_error: '분을 선택해주세요',
      }),
      entranceGate: z
        .string({
          required_error: '입차 게이트는 필수 입력 항목입니다.',
        })
        .min(1, { message: '입차 게이트를 선택해주세요.' }), // 입차 게이트
      departureGate: z
        .string({
          required_error: '출차 게이트는 필수 입력 항목입니다.',
        })
        .min(1, { message: '출차 게이트를 선택해주세요.' }), // 출차 게이트
      dong: z
        .string()
        // .min(1, { message: '동(은) 필수 입력 항목입니다.' })
        .optional(), // 동
      ho: z
        .string()
        // .min(1, { message: '호수(은) 필수 입력 항목입니다.' })
        .optional(), // 호수
      visitPurposeUuid: z
        .string()
        .min(1, { message: '방문 목적을 선택해주세요.' })
        .optional(),

      registType: z.enum(['HOUSEHOLD', 'BUSINESS']), // 구분
      carType: z.enum(
        [
          'REGULAR', // 정기
          'REGULAR_RESIDENT', // 입주민
          'RESERVATION',
          'ALWAYS_ALLOW',
          'GENERAL',
        ],
        {
          errorMap: () => ({ message: '올바른 차량 유형을 선택하세요.' }),
        },
      ), // 차량 유형
      phone: z.string().optional(),
      businessTypeUuid: z
        .string()
        .min(1, { message: '업무 목적을 선택해주세요.' })
        .optional(),
      memo: z.string().optional(), // 메모
    })
    .superRefine((data, ctx) => {
      const openDateTime = new Date(
        data.openDate.getFullYear(),
        data.openDate.getMonth(),
        data.openDate.getDate(),
        parseInt(data.openHours, 10),
        parseInt(data.openMinutes, 10),
      );
      const closeDateTime = new Date(
        data.closeDate.getFullYear(),
        data.closeDate.getMonth(),
        data.closeDate.getDate(),
        parseInt(data.closeHours, 10),
        parseInt(data.closeMinutes, 10),
      );

      if (data.registType === 'HOUSEHOLD') {
        if (!data.dong || data.dong.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '동(은) 필수 입력 항목입니다.',
            path: ['dong'],
          });
        }
        if (!data.ho || data.ho.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '호수(은) 필수 입력 항목입니다.',
            path: ['ho'],
          });
        }
      }

      if (
        data.registType === 'HOUSEHOLD' &&
        !['REGULAR', 'REGULAR_RESIDENT'].includes(data.carType) &&
        !data.visitPurposeUuid
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '방문 목적은 필수 입력 항목입니다.',
          path: ['visitPurposeUuid'],
        });
      }
      if (data.registType === 'BUSINESS' && !data.businessTypeUuid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '업무 목적은 필수 입력 항목입니다.',
          path: ['businessTypeUuid'],
        });
      }

      if (data.phone && !PHONE_REGEX_LENGTH.test(data.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '전화번호는 올바른 형식이어야 합니다.',
          path: ['phone'],
        });
      }

      if (closeDateTime < openDateTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '출차 일시는 입차 일시보다 이후여야 합니다.',
          path: ['closeDate'],
        });
      }
      if (openDateTime.getTime() === closeDateTime.getTime()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '출차 일시는 입차 일시와 같을 수 없습니다.',
          path: ['closeDate'],
        });
      }
      if (
        openDateTime.getFullYear() !== closeDateTime.getFullYear() ||
        openDateTime.getMonth() !== closeDateTime.getMonth()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '입차 일시와 출차 일시의 년월이 같아야 합니다.',
          path: ['closeDate'],
        });
      }
    }),
);

// 입출차내역 동호 수정 form
export const inOutHistoryDongHoFormSchema = (carType) => {
  if (carType === 'UNKNOWN') {
    return toTypedSchema(
      z.object({
        ...baseSchema,
        visitPurposeUuid: z
          .string({ required_error: '방문 목적을 선택해주세요.' })
          .min(1, { message: '방문 목적을 선택해주세요.' }),
      }),
    );
  }

  return toTypedSchema(z.object(baseSchema));
};

// 미출차내역 form
export const notOutHistoryFormSchema = (gateInfo) => {
  return toTypedSchema(
    z
      .object({
        outLprUuid: z
          .string({
            required_error: '출차 게이트는 필수 입력 항목입니다.',
          })
          .min(1, { message: '출차 게이트를 선택해주세요.' }),
        closeDate: z.date({
          required_error: '출차 일시를 선택해주세요',
          invalid_type_error: '출차 일시를 선택해주세요',
        }),
        closeHours: z.string({
          required_error: '시간을 선택해주세요',
          invalid_type_error: '시간을 선택해주세요',
        }),
        closeMinutes: z.string({
          required_error: '분을 선택해주세요',
          invalid_type_error: '분을 선택해주세요',
        }),
      })
      .superRefine((data, ctx) => {
        const openDateTime = new Date(gateInfo.inParkingTime);
        const closeDateTime = new Date(
          data.closeDate.getFullYear(),
          data.closeDate.getMonth(),
          data.closeDate.getDate(),
          parseInt(data.closeHours, 10),
          parseInt(data.closeMinutes, 10),
        );

        if (closeDateTime < openDateTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '출차 일시는 입차 일시보다 이후여야 합니다.',
            path: ['closeDate'],
          });
        }
        if (openDateTime.getTime() === closeDateTime.getTime()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '출차 일시는 입차 일시와 같을 수 없습니다.',
            path: ['closeDate'],
          });
        }
      }),
  );
};

// /////////////////////////////////////////////////////////////////////////
// 블랙리스트
// /////////////////////////////////////////////////////////////////////////

// 블랙리스트 form
export const blackListCarFormSchema = toTypedSchema(
  z.object({
    carNum: z
      .string({
        required_error: '차량 번호는 필수 입력 항목입니다.',
      })
      .min(1, { message: '차량 번호는 필수 입력 항목입니다.' })
      .refine((data) => CAR_NUM_REGEX.test(data), {
        message: '차량 번호는 올바른 형식이어야 합니다.',
      }),
    reason: z
      .string({
        required_error: '사유는 필수 입력 항목입니다.',
      })
      .min(1, { message: '사유는 필수 입력 항목입니다.' })
      .max(250, { message: '사유는 최대 250자까지 입력할 수 있습니다.' }),
  }),
);
