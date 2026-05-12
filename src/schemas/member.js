import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';

// 입주민 정보 form
export const residentInfoFormSchema = z.object({
  name: z
    .string({
      required_error: '이름은 필수 입력 항목입니다.',
    })
    .min(1, '이름을 입력해주세요.'),
  dong: z
    .string({
      required_error: '동 이름은 필수 입력 항목입니다.',
    })
    .min(1, '동 이름을 입력해주세요.'),
  ho: z
    .string({
      required_error: '호수는 필수 입력 항목입니다.',
    })
    .min(1, '호수를 입력해주세요.'),
  householdHeadFlag: z
    .enum(['householdHead', 'householdMember'], {
      required_error: '세대주 여부는 필수 입력 항목입니다.',
    })
    .transform((val) => val === 'householdHead'),
  testFlag: z.boolean({
    required_error: '관리자 계정 여부 필드는 필수 입력 항목입니다.',
    invalid_type_error: '관리자 계정 여부 필드는 불리언이어야 합니다.',
  }),
});

// 회원 상태 변경 확인 (대기 상태로 되돌리기)
export const residentWaitingConfirmInputSchema = (residentName) =>
  toTypedSchema(
    z.object({
      confirmationText: z
        .string({
          required_error: '회원 이름을 입력해 주세요.',
        })
        .trim()
        .min(1, { message: '회원 이름을 입력해 주세요.' })
        .refine(
          (val) => {
            return val === residentName;
          },
          {
            message: '회원 이름을 정확히 입력해주세요.',
          },
        ),
    }),
  );

// 회원 전출 처리 확인
export const memberDeleteConfirmInputSchema = (residentName) =>
  toTypedSchema(
    z.object({
      confirmationText: z
        .string({
          required_error: '회원 이름을 입력해 주세요.',
        })
        .trim()
        .min(1, { message: '회원 이름을 입력해 주세요.' })
        .refine(
          (val) => {
            return val === residentName;
          },
          {
            message: '회원 이름을 정확히 입력해주세요.',
          },
        ),
    }),
  );
