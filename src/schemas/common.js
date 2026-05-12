import { z } from 'zod';

export const reconfirmStringInputSchema = (fieldId, placeholder) => {
  return z.object({
    [fieldId]: z
      .string({
        required_error: '확인 문구를 입력해 주세요.',
      })
      .min(1, { message: '확인 문구를 입력해 주세요.' })
      .refine((val) => val === placeholder, {
        message: `입력한 값이 일치하지 않습니다.`,
      }),
  });
};
