// 데이터가 존재하는 기간 (임시 고정값)
export const AI_DEFAULT_DATE_RANGE = ['2026-03-01', '2026-03-31'];

// AI 콜센터 LNB 메뉴
export const AI_CALL_CENTER_LNB_MENU = [
  { label: '대시보드', path: '/dashboard' },
  { label: '상담기록', path: '/calls' },
  { label: '품질평가', path: '/evaluation' },
];

// 평가 점수 구간 (under_70 ~ 95_100)
export const AI_EVALUATION_SCORE_RANGES = [
  { key: 'under_70', label: '70점 미만' },
  { key: '70_74', label: '70 ~ 74' },
  { key: '75_79', label: '75 ~ 79' },
  { key: '80_84', label: '80 ~ 84' },
  { key: '85_89', label: '85 ~ 89' },
  { key: '90_94', label: '90 ~ 94' },
  { key: '95_100', label: '95 ~ 100' },
];

// 평가 점수 카드 정의 (max 점수 포함)
export const AI_EVALUATION_SCORE_CARDS = [
  { key: 'avgScoreTotal', label: '종합 평균', max: 100 },
  { key: 'avgScoreSpeed', label: '신속성', max: 30 },
  { key: 'avgScoreAccuracy', label: '정확성', max: 40 },
  { key: 'avgScoreProfessionalism', label: '전문성/태도', max: 30 },
];

// 상담기록 테이블 컬럼
export const AI_CALLS_TABLE_COLUMNS = [
  { name: '관리번호', key: 'id' },
  { name: '통화일시', key: 'date' },
  { name: '통화시간(초)', key: 'duration' },
  { name: '대분류', key: 'categoryMain' },
  { name: '중분류', key: 'categorySub' },
  { name: '소분류', key: 'categoryDetail' },
  { name: '요약', key: 'summary' },
  { name: '신속성', key: 'scoreSpeed' },
  { name: '정확성', key: 'scoreAccuracy' },
  { name: '전문성', key: 'scoreProfessionalism' },
  { name: '종합점수', key: 'scoreTotal' },
];

// 통화시간(초) 구간 필터 — [min, max) 반열림 구간 (추후 API 전환 시 동일 key 사용)
export const AI_CALLS_DURATION_RANGES = [
  { key: '0-30', label: '30초 미만', min: 0, max: 30 },
  { key: '30-60', label: '30~60초', min: 30, max: 60 },
  { key: '60-180', label: '60~180초', min: 60, max: 180 },
  { key: '180-', label: '180초 이상', min: 180, max: Infinity },
];

// 카테고리 도넛 색상 팔레트
export const AI_CATEGORY_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];
