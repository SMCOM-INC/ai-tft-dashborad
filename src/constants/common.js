export const inputAptName = {
  key: 'aptName',
  label: '단지명',
  value: '',
  inputType: 'text',
};

export const inputCarNum = {
  key: 'CAR_NUM',
  label: '차량 번호',
  value: '',
  inputType: 'text',
};

export const inputContact = {
  key: 'PHONE',
  label: '연락처',
  value: '',
  inputType: 'text',
};

export const inputDong = {
  key: 'DONG',
  label: '동',
  value: '',
  inputType: 'text',
};

export const inputHo = {
  key: 'HO',
  label: '호수',
  value: '',
  inputType: 'number',
};

export const inputHouseholdNumber = {
  key: 'DONG_HO',
  label: '동-호수',
  value: '',
  inputType: 'string',
};

export const inputCarOwnerName = {
  key: 'NAME',
  label: '차주 이름',
  value: '',
  inputType: 'text',
};

export const inputName = {
  key: 'NAME',
  label: '이름',
  value: '',
  inputType: 'text',
};

export const inputHouseholdHeadName = {
  key: 'HOUSEHOLD_HEAD_NAME',
  label: '세대주 이름',
  value: '',
  inputType: 'text',
};

export const inputTitle = {
  key: 'TITLE',
  label: '제목',
  value: '',
  inputType: 'text',
};

export const inputAuthor = {
  key: 'AUTHOR',
  label: '작성자',
  value: '',
  inputType: 'text',
};

export const inputStoreName = {
  key: 'STORE_NAME',
  label: '상가명',
  value: '',
  inputType: 'text',
};

export const inputRepresentativeName = {
  key: 'REPRESENTATIVE_NAME',
  label: '대표자 이름',
  value: '',
  inputType: 'text',
};

export const inputRepresentativePhone = {
  key: 'REPRESENTATIVE_PHONE',
  label: '대표자 연락처',
  value: '',
  inputType: 'text',
};

export const inputStoreId = {
  key: 'STORE_ID',
  label: '아이디',
  value: '',
  inputType: 'text',
};

export const filterCarType = {
  filterName: '차량 유형',
  filterKey: 'carTypeList',
  list: [
    { key: 'REGULAR', label: '정기차량', checked: true },
    { key: 'REGULAR_RESIDENT', label: '입주민', checked: true },
    { key: 'RESERVATION', label: '방문예약', checked: true },
    { key: 'ALWAYS_ALLOW', label: '항상허용', checked: true },
    { key: 'GENERAL', label: '일반방문', checked: true },
    { key: 'UNKNOWN', label: '미확인', checked: true },
    { key: 'REJECT', label: '거부', checked: true },
    { key: 'BLACKLIST', label: '블랙리스트', checked: true },
  ],
};

export const REGIST_TYPE_MAP = {
  house: '세대',
  business: '업무',
};

export const HOUSEHOLD_BUSINESS_TAB_LIST = [
  { name: '세대', key: 'house' },
  { name: '업무', key: 'business' },
];

export const STATE_TYPE = [
  { label: '대기', key: 'WAITING' },
  { label: '승인', key: 'APPROVED' },
  { label: '반려', key: 'REJECTED' },
];

export const RESIDENT_TYPE = [
  { label: '세대주', key: 'HEAD' },
  { label: '세대원', key: 'MEMBER' },
  { label: '소유주', key: 'OWNER' },
];

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

export const ACCEPTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

export const DATE_TYPE_FILTER_KEY_LIST = [
  'createdDate',
  'period',
  'period_3m',
  'visitDate',
];

export const OFFICE_HOURS_WEEKDAY_LIST = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
  'LUNCH_TIME',
];

export const OFFICE_HOURS_KOREAN_WEEKDAY_LIST = [
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
  '점심시간',
];

export const CONTENT_TYPES = {
  parking: '주차',
  boardNotice: '공지',
  boardCommunity: '소통',
  boardComplaints: '민원',
  community: '커뮤니티',
  apass: 'A-PASS',
  visitorPass: '방문증',
  lobbyPhone: '로비폰',
  apayQr: 'A-PAY-QR',
  apayPayment: 'A-PAY-결제금액',
  movingHouse: '이사예약',
  repair: '하자보수',
  vote: '투표',
  aptMall: '아파트몰',
  fireInspection: '소방 자가 점검',
};

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결이 끊겼습니다. 네트워크 연결을 확인해주세요.',
  INVALID_ADMIN_ID: '아이디, 또는 비밀번호가 일치하지 않습니다.',
  INVALID_PASSWORD: '비밀번호가 일치하지 않습니다. 비밀번호를 확인해주세요.',
  INTERNAL_SERVER_ERROR:
    '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export const INVALID_VALUES = [
  0,
  false,
  undefined,
  null,
  '',
  'undefined',
  'null',
];

export const FILTER_ALL = { key: 'ALL', label: '전체' };

export const QUESTION_TYPE = {
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  SUBJECTIVE: 'SUBJECTIVE',
};

export const INIT_PAGE_PATH = '/dashboard';

export const BANK_LIST = [
  { key: 'NH은행', label: 'NH은행' },
  { key: 'KB국민', label: 'KB국민' },
  { key: '신한', label: '신한' },
  { key: '우리', label: '우리' },
  { key: 'IBK기업', label: 'IBK기업' },
  { key: '하나', label: '하나' },
  { key: '우체국', label: '우체국' },
  { key: '카카오뱅크', label: '카카오뱅크' },
  { key: '토스뱅크', label: '토스뱅크' },
  { key: '케이뱅크', label: '케이뱅크' },
  { key: '새마을', label: '새마을' },
  { key: '부산', label: '부산' },
  { key: 'iM뱅크(대구)', label: 'iM뱅크(대구)' },
  { key: '신협', label: '신협' },
  { key: 'SC제일', label: 'SC제일' },
  { key: '경남', label: '경남' },
  { key: '광주', label: '광주' },
  { key: '수협', label: '수협' },
  { key: '전북', label: '전북' },
  { key: '저축은행', label: '저축은행' },
  { key: '제주', label: '제주' },
  { key: '씨티', label: '씨티' },
  { key: 'KDB산업', label: 'KDB산업' },
  { key: '산림조합', label: '산림조합' },
  { key: 'SBI저축은행', label: 'SBI저축은행' },
  { key: 'BOA', label: 'BOA' },
  { key: '중국', label: '중국' },
  { key: 'HSBC', label: 'HSBC' },
  { key: '중국공상', label: '중국공상' },
  { key: '도이치', label: '도이치' },
  { key: 'JP모건', label: 'JP모건' },
  { key: 'BNP파리바', label: 'BNP파리바' },
  { key: '중국건설', label: '중국건설' },
];
