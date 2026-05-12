import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import {
  APT_PORT_CONFIG_FOR_CONTENT_LIST,
  MAX_LOGO_SIZE,
} from '@/constants/apt.js';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/common.js';
import {
  ID_REGEX,
  PASSWORD_REGEX,
  PHONE_HYPHEN_REGEX,
  TIME_REGEX,
} from '@/constants/regex.js';

// /////////////////////////////////////////////////////////////////////////
// 최고관리자
// /////////////////////////////////////////////////////////////////////////

const portValidation = z
  .union([
    z
      .string()
      .refine((val) => !Number.isNaN(Number(val)), {
        message: '포트는 숫자여야 합니다.',
      })
      .transform(Number)
      .refine((val) => val >= 1 && val <= 65535, {
        message: '포트는 1 이상 65535 이하여야 합니다.',
      }),
    z
      .number()
      .int()
      .min(1, '포트는 1 이상이어야 합니다.')
      .max(65535, '포트는 65535 이하여야 합니다.'),
  ])
  .nullable()
  .optional();

// 단지 생성 form
export const masterAptFormCreationSchema = z
  .object({
    name: z
      .string({
        required_error: '단지명은 필수 입력 항목입니다.',
      })
      .min(5, '단지명을 입력해주세요. (5자 이상)'),
    logoFile: z
      .instanceof(File, {
        message: '로고 파일을 선택해주세요.',
      })
      .optional()
      .nullable()
      .refine(
        (file) => !file || file.size === 0 || file.size <= MAX_LOGO_SIZE,
        `파일 크기는 40MB 이하여야 합니다.`,
      )
      .refine(
        (file) =>
          !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
        '파일 형식은 jpg, jpeg, png, gif만 가능합니다.',
      ),
    address: z
      .string({
        required_error: '주소는 필수 입력 항목입니다.',
      })
      .min(10, '주소를 입력해주세요. (최소 10자 이상)'),
    representativePhone: z
      .string({
        required_error: '전화번호는 필수 입력 항목입니다.',
      })
      .min(9, '올바른 전화번호를 입력해주세요.')
      .max(11, '올바른 전화번호를 입력해주세요.')
      .refine((value) => !Number.isNaN(Number(value)), {
        message: '전화번호는 숫자만 입력해주세요.',
      }),
    householdCount: z
      .number({
        required_error: '세대 수는 필수 입력 항목입니다.',
        invalid_type_error: '세대 수는 숫자여야 합니다.',
      })
      .max(15000, '세대 수는 15,000 이하여야 합니다.')
      .positive('세대 수는 양수여야 합니다.'),
    parkingSpaceCount: z
      .number({
        required_error: '주차 면 수는 필수 입력 항목입니다.',
        invalid_type_error: '주차 면 수는 숫자여야 합니다.',
      })
      .max(20000, '주차 면 수는 20,000 이하여야 합니다.')
      .positive('주차 면 수는 양수여야 합니다.'),
    aptAdminId: z
      .string({
        required_error: '단지관리자 ID는 필수 입력 항목입니다.',
      })
      .regex(ID_REGEX, '단지관리자 ID는 4~41자의 영문, 숫자만 입력해주세요.'),
    initPassword: z
      .string({
        required_error: '초기 비밀번호는 필수 입력 항목입니다.',
      })
      .regex(
        PASSWORD_REGEX,
        '영문, 숫자, 특수문자(!@#^*~) 포함한 8~20자 비밀번호를 입력해주세요.',
      )
      .min(8, '초기 비밀번호는 8자 이상이어야 합니다.'),
    contentUuidList: z
      .array(z.string(), {
        required_error: '최소 하나의 서비스를 선택해주세요.',
      })
      .min(1, '최소 하나의 서비스를 선택해야 합니다.'),
    guardApiPort: portValidation,
    guardWebPort: portValidation,
    guardSshPort: portValidation,
    guardDbPort: portValidation,
    elevatorApiPort: z.any().optional(),
  })
  .refine(
    (data) => {
      const {
        contentUuidList,
        guardApiPort,
        guardWebPort,
        guardSshPort,
        guardDbPort,
      } = data;
      const { requireParkingPortsContents } = APT_PORT_CONFIG_FOR_CONTENT_LIST;

      const requiresParking = contentUuidList.some((uuid) =>
        requireParkingPortsContents.includes(uuid),
      );

      if (requiresParking) {
        if (!guardApiPort || !guardWebPort || !guardSshPort || !guardDbPort) {
          return false;
        }
      }

      return true;
    },
    {
      message: '선택된 서비스에 따라 필요한 포트 정보를 모두 입력해주세요.',
      path: ['contentUuidList'],
    },
  );

// 단지 수정 form
export const masterAptFormUpdateSchema = z.object({
  name: z
    .string({
      required_error: '단지명은 필수 입력 항목입니다.',
    })
    .min(5, '단지명을 입력해주세요. (5자 이상)'),
  logoFile: z
    .union([z.instanceof(File), z.literal(null), z.literal(undefined)])
    .optional()
    .refine(
      (file) => {
        if (
          file === null ||
          file === undefined ||
          (file instanceof File && file.size === 0)
        ) {
          return true;
        }
        return (
          file instanceof File &&
          file.size > 0 &&
          file.size <= MAX_LOGO_SIZE &&
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        );
      },
      {
        message: '파일 형식은 40MB 이하의 jpg, jpeg, png, gif만 가능합니다.',
      },
    ),
  address: z
    .string({
      required_error: '주소는 필수 입력 항목입니다.',
    })
    .min(10, '주소를 입력해주세요. (최소 10자 이상)'),
  representativePhone: z
    .string({
      required_error: '전화번호는 필수 입력 항목입니다.',
    })
    .min(9, '올바른 전화번호를 입력해주세요.')
    .max(11, '올바른 전화번호를 입력해주세요.')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: '전화번호는 숫자만 입력해주세요.',
    }),
  householdCount: z
    .number({
      required_error: '세대 수는 필수 입력 항목입니다.',
      invalid_type_error: '세대 수는 숫자여야 합니다.',
    })
    .max(15000, '세대 수는 15,000 이하여야 합니다.')
    .positive('세대 수는 양수여야 합니다.'),
  parkingSpaceCount: z
    .number({
      required_error: '주차 면 수는 필수 입력 항목입니다.',
      invalid_type_error: '주차 면 수는 숫자여야 합니다.',
    })
    .max(20000, '주차 면 수는 20,000 이하여야 합니다.')
    .positive('주차 면 수는 양수여야 합니다.'),
  contentUuidList: z
    .array(z.string(), {
      required_error: '최소 하나의 서비스를 선택해주세요.',
    })
    .min(1, '최소 하나의 서비스를 선택해야 합니다.'),
  guardApiPort: portValidation,
  guardWebPort: portValidation,
  guardSshPort: portValidation,
  guardDbPort: portValidation,
  elevatorApiPort: z.any().optional(),
});

// 단지 비밀번호 수정 form
export const masterAptPasswordFormSchema = z.object({
  initialPassword: z
    .string({
      required_error: '초기 비밀번호는 필수 입력 항목입니다.',
    })
    .regex(
      PASSWORD_REGEX,
      '영문, 숫자, 특수문자(!@#^*~) 포함한 8~20자 비밀번호를 입력해주세요.',
    )
    .min(8, '초기 비밀번호는 8자 이상이어야 합니다.'),
});

// /////////////////////////////////////////////////////////////////////////
// 단지관리자
// /////////////////////////////////////////////////////////////////////////

// 단지관리설정 > 호수 개별 추가
export const createHouseholdAddHouseValidationSchema = z.object({
  dongName: z.string().optional(),
  lineName: z.string().optional(),
  floorName: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      const trimmedVal = (val ?? '').trim();
      if (trimmedVal.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '층수는 필수 입력 항목입니다.',
        });
        return;
      }
      if (!/^[1-9]\d*$/.test(trimmedVal)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '층수는 숫자만 입력 가능합니다.',
        });
      }
    }),
});

// 단지관리설정 > 동호수 등록하기
export const createHouseholdBatchDongValidationSchema = (dongList) =>
  z.object({
    dongName: z
      .string({
        required_error: '동 이름은 필수 입력 항목입니다.',
      })
      .min(1, '동 이름을 입력해주세요. (최소 1자 이상)')
      .refine((value) => !dongList.includes(value), {
        message: '이미 등록되어있는 동입니다.',
      }),
    maxFloor: z
      .string({
        required_error: '최대 층수는 필수 입력 항목입니다.',
        invalid_type_error: '최대 층수는 숫자여야 합니다.',
      })
      .refine(
        (value) =>
          !Number.isNaN(value) && Number(value) > 0 && Number(value) <= 100,
        {
          message: '최대 층수는 100 이하여야 합니다.',
        },
      ),
    maxLine: z
      .string({
        required_error: '최대 라인수는 필수 입력 항목입니다.',
        invalid_type_error: '최대 라인수는 숫자여야 합니다.',
      })
      .refine(
        (value) =>
          !Number.isNaN(value) && Number(value) > 0 && Number(value) <= 50,
        {
          message: '최대 라인수는 50 이하여야 합니다.',
        },
      ),
    removeHo: z.array(z.string()).optional().default([]),
  });

// 우리 아파트 정보 > 부서별 연락처
export const aptOfficeContactFormSchema = toTypedSchema(
  z.object({
    departmentContact: z.array(
      z.object({
        name: z
          .string({
            required_error: '부서 이름은 필수 입력 항목입니다.',
            invalid_type_error: '부서 이름은 문자열이여야 합니다.',
          })
          .min(1, { message: '부서 이름은 최소 1글자 이상이여야 합니다.' })
          .max(20, {
            message: '부서 이름은 최대 20자까지 입력할 수 있습니다.',
          }),
        phone: z
          .string({
            required_error: '전화번호는 필수 입력 항목입니다.',
          })
          .min(1, { message: '전화번호는 필수 입력 항목입니다.' })
          .refine((data) => PHONE_HYPHEN_REGEX.test(data), {
            message: '전화번호는 올바른 형식이어야 합니다.',
          }),
      }),
    ),
  }),
);

// 우리 아파트 정보 > 관리사무소 운영시간
export const aptOfficeHoursFormSchema = z.object({
  officeHours: z.array(
    z.object({
      dayType: z.nativeEnum([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
        'LUNCH_TIME',
      ]),
      startTime: z
        .string({
          required_error: '시작 시간은 필수 입력 항목입니다.',
          invalid_type_error: '시작 시간은 문자열이어야 합니다.',
        })
        .min(1, { message: '시작 시간은 비어선 안 됩니다.' })
        .refine((data) => TIME_REGEX.test(data), {
          message: '시작 시간은 HH:mm 형식이어야 합니다.',
        }),
      endTime: z
        .string({
          required_error: '종료 시간은 필수 입력 항목입니다.',
          invalid_type_error: '종료 시간은 문자열이어야 합니다.',
        })
        .min(1, { message: '종료 시간은 비어선 안 됩니다.' })
        .refine((data) => TIME_REGEX.test(data), {
          message: '종료 시간은 HH:mm 형식이어야 합니다.',
        }),
      openFlag: z.boolean({
        required_error: '운영 여부는 필수 입력 항목입니다.',
        invalid_type_error: '운영 여부는 boolean 값이어야 합니다.',
      }),
    }),
  ),
});
