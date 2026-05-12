import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import { FIRE_INSPECTION_QUESTION_TEMPLATE } from '@/constants/fireInspection.js';
import { MOBILE_PHONE_HYPHEN_REGEX } from '@/constants/regex.js';

// 점검 생성 폼
export const fireInspectionCreateFormSchema = toTypedSchema(
  z.object({
    title: z
      .string({
        required_error: '점검 제목을 입력해주세요',
        invalid_type_error: '점검 제목은 문자열이어야 합니다',
      })
      .min(1, '점검 제목을 입력해주세요'),
    dateRange: z
      .array(z.string(), {
        required_error: '점검 기간을 선택해주세요',
        invalid_type_error: '시작일과 종료일을 선택해주세요',
      })
      .min(2, '시작일과 종료일을 선택해주세요')
      .max(2, '시작일과 종료일을 선택해주세요'),
  }),
);

// 점검 삭제 폼
export const fireInspectionDeleteFormSchema = ({ inspectionTitle }) =>
  toTypedSchema(
    z.object({
      confirmationText: z
        .string({
          required_error: '점검 제목을 입력해주세요',
          invalid_type_error: '점검 제목은 문자열이어야 합니다',
        })
        .trim()
        .min(1, { message: '점검 제목을 입력해주세요' })
        .refine((val) => val === inspectionTitle, {
          message: '입력한 값이 점검 제목과 일치하지 않습니다.',
        }),
    }),
  );

// 모든 점검 질문 가져오기
const getAllInspectionQuestions = () => {
  return FIRE_INSPECTION_QUESTION_TEMPLATE.sections.flatMap((section) =>
    section.groups.flatMap((group) => group.questions),
  );
};

// 미입력 점검 항목 개수 계산
const getUncheckedItemsCount = (data) => {
  const allQuestions = getAllInspectionQuestions();

  const uncheckedItems = allQuestions.filter((question) => {
    const answer = data[question.questionId];
    return !answer;
  });

  return uncheckedItems.length;
};

// 세대별 점검 수기등록 폼
export const fireInspectionTableRegisterInfoFormSchema = toTypedSchema(
  z.object({
    inspector: z
      .string({
        required_error: '점검자를 입력해주세요.',
        invalid_type_error: '점검자를 입력해주세요.',
      })
      .min(1, '점검자를 입력해주세요.'),
    submissionType: z
      .string({
        required_error: '구분을 선택해주세요.',
        invalid_type_error: '구분을 선택해주세요.',
      })
      .min(1, '구분을 선택해주세요.'),
    inspectorPhone: z
      .string({
        required_error: '연락처를 입력해주세요.',
        invalid_type_error: '연락처를 입력해주세요.',
      })
      .min(1, '연락처를 입력해주세요.')
      .regex(
        MOBILE_PHONE_HYPHEN_REGEX,
        '휴대폰 번호를 입력해주세요.(010,016,017,018,019로 시작)',
      ),
    submissionDateTime: z.date({
      required_error: '점검일을 선택해주세요.',
      invalid_type_error: '점검일을 선택해주세요.',
    }),
    inspectionQuestions: z
      .record(z.string(), z.string())
      .default({})
      .refine(
        (data) => getUncheckedItemsCount(data) === 0,
        (data) => ({
          message: `점검 결과에서 아직 입력되지 않은 항목이 ${getUncheckedItemsCount(data)}개 있습니다.`,
        }),
      ),
  }),
);
