import { NOTICE_TYPE } from '@/constants/board.js';

const findNoticeType = (key) => {
  return NOTICE_TYPE[key];
};

// householdInfo + author 조합 -> API enum 값 매핑
const AUTHOR_DISPLAY_MAP = {
  'NONE|ANONYMOUS': 'ANONYMOUS',
  'DONG|ANONYMOUS': 'ANONYMOUS_DONG',
  'DONG_HO|ANONYMOUS': 'ANONYMOUS_DONG_HO',
  'NONE|NICKNAME': 'NICKNAME',
  'DONG|NICKNAME': 'NICKNAME_DONG',
  'DONG_HO|NICKNAME': 'NICKNAME_DONG_HO',
  'NONE|NAME': 'NAME',
  'DONG|NAME': 'NAME_DONG',
  'DONG_HO|NAME': 'NAME_DONG_HO',
  'NONE|MASKING': 'MASKING',
  'DONG|MASKING': 'MASKING_DONG',
  'DONG_HO|MASKING': 'MASKING_DONG_HO',
};

// API enum 값 -> householdInfo + author 역매핑 (자동 생성)
const REVERSE_AUTHOR_DISPLAY_MAP = Object.fromEntries(
  Object.entries(AUTHOR_DISPLAY_MAP).map(([key, value]) => {
    const [householdInfo, author] = key.split('|');
    return [value, { householdInfo, author }];
  }),
);

const DEFAULT_AUTHOR_DISPLAY = { householdInfo: 'NONE', author: 'ANONYMOUS' };

// API enum 값 -> { householdInfo, author } 객체로 분해
const deconstructAuthorDisplay = (enumValue) => {
  return REVERSE_AUTHOR_DISPLAY_MAP[enumValue] || DEFAULT_AUTHOR_DISPLAY;
};

// { householdInfo, author } -> API enum 값으로 조합
const combinedAuthorDisplay = (householdInfo, author) => {
  return AUTHOR_DISPLAY_MAP[`${householdInfo}|${author}`] || 'ANONYMOUS';
};

export { findNoticeType, deconstructAuthorDisplay, combinedAuthorDisplay };
