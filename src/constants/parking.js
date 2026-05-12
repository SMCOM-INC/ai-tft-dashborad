import {
  FILTER_ALL,
  filterCarType,
  inputCarNum,
  inputCarOwnerName,
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
} from '@/constants/common.js';

// /////////////////////////////////////////////////////////////////////////
// 주차 공통
// /////////////////////////////////////////////////////////////////////////
export const REGISTRATION_TYPE = [
  { label: '세대', key: 'HOUSEHOLD' },
  { label: '업무', key: 'BUSINESS' },
];

export const REGISTRATION_TYPE_WITH_STORE = [
  ...REGISTRATION_TYPE,
  { label: '상가', key: 'STORE' },
];

export const REGULAR_CAR_TYPE = [
  { label: '정기차량', key: 'REGULAR' },
  { label: '입주민 차량', key: 'RESIDENT' },
];

export const CAR_TYPE = [
  { label: '정기차량', key: 'REGULAR' },
  { label: '입주민', key: 'REGULAR_RESIDENT' },
  { label: '방문예약', key: 'RESERVATION' },
  { label: '항상허용', key: 'ALWAYS_ALLOW' },
  { label: '일반방문', key: 'GENERAL' },
  { label: '미확인', key: 'UNKNOWN' },
  { label: '거부', key: 'REJECT' },
  { label: '블랙리스트', key: 'BLACKLIST' },
  { label: '회차', key: 'TURNING' },
];

// /////////////////////////////////////////////////////////////////////////
// 주차 설정
// /////////////////////////////////////////////////////////////////////////
export const ADMIN_PARKING_SETTING_TAB_LIST = [
  { name: '단지 기본정보', key: 'basic-info' },
  { name: '세대 방문차량', key: 'house-reservation' },
  { name: '업무 목적 관리', key: 'business' },
];

export const FREE_PARKING_TIME_MIN_OPTIONS = {
  times: { hours: [], minutes: [5, 10, 15, 20, 25, 35, 40, 45, 50, 55] },
};

export const PARKING_POLICY_EDIT_MAX_DATE = 25;

// /////////////////////////////////////////////////////////////////////////
// 정기차량
// /////////////////////////////////////////////////////////////////////////

export const REGULAR_CAR_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputCarOwnerName,
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

export const REGULAR_CAR_BUSINESS_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputCarOwnerName,
  inputContact,
];

export const REGULAR_CAR_HOUSE_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '구분', key: 'regularCarType', type: 'regularCarType' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '차주 이름', key: 'name', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '정기권 시작일', key: 'startDate', type: 'date' },
  { name: '정기권 만료일', key: 'endDate', type: 'date' },
  { name: '등록일시', key: 'createdDate', type: 'date' },
  { name: '메모', key: 'memo', type: 'memo' },
  { name: '', key: 'edit', type: 'text' },
];

export const REGULAR_CAR_BUSINESS_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '업무 목적', key: 'businessTypeName', type: 'text' },
  { name: '차주 이름', key: 'name', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '정기권 시작일', key: 'startDate', type: 'date' },
  { name: '정기권 만료일', key: 'endDate', type: 'date' },
  { name: '등록일시', key: 'createdDate', type: 'date' },
  { name: '메모', key: 'memo', type: 'memo' },
  { name: '', key: 'edit', type: 'text' },
];

// /////////////////////////////////////////////////////////////////////////
// 방문예약
// /////////////////////////////////////////////////////////////////////////
export const ADMIN_PARKING_RESERVATION_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

export const ADMIN_PARKING_RESERVATION_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '방문 목적', key: 'visitPurpose', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '입차 예정일', key: 'inParkingScheduledDate', type: 'date' },
  { name: '출차 예정일', key: 'outParkingScheduledDate', type: 'date' },
  { name: '등록일시', key: 'createdDate', type: 'date' },
  { name: '입차 여부', key: 'inParkingFlag', type: 'inParkingFlag' },
];

export const FILTER_INPARKING_FLAG = {
  filterName: '입차여부',
  filterKey: 'inParkingFlag',
  list: [
    FILTER_ALL,
    { key: 'true', label: '입차' },
    { key: 'false', label: '미입차' },
  ],
};

// /////////////////////////////////////////////////////////////////////////
// 항상허용
// /////////////////////////////////////////////////////////////////////////
export const ADMIN_PARKING_ALWAYS_ALLOW_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

export const ADMIN_PARKING_ALWAYS_ALLOW_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '방문 목적', key: 'visitPurpose', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '메모', key: 'memo', type: 'memo' },
  { name: '등록일시', key: 'createdDate', type: 'dateTime' },
];

// /////////////////////////////////////////////////////////////////////////
// 마일리지
// /////////////////////////////////////////////////////////////////////////
export const ADMIN_PARKING_MILEAGE_SEARCH_INPUT_LIST = [
  inputDong,
  inputHouseholdNumber,
];

export const ADMIN_PARKING_MILEAGE_HOUSE_TABLE_COLUMNS_LIST = [
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  {
    name: '사용한 기본 마일리지',
    key: 'useMileageHourText',
  },
  {
    name: '남은 기본 마일리지',
    key: 'remainingMileageHourText',
  },
  { name: '예상 청구 금액', key: 'billingAmount' },
];

export const ADMIN_PARKING_MILEAGE_STORE_TABLE_COLUMNS_LIST = [
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '상가 이름', key: 'storeName', type: 'text' },
  { name: '사용한 기본 마일리지', key: 'usedBasicMileage', type: 'usageTime' },
  {
    name: '남은 기본 마일리지',
    key: 'remainingBasicMileage',
    type: 'usageTime',
  },
  { name: '예상 청구 금액', key: 'estimatedCharge', type: 'currency' },
];

export const PARKING_MILEAGE_DETAIL_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '차량 타입', key: 'carType', type: 'text' },
  { name: '입차 시간', key: 'inParkingDateTime', type: 'text' },
  { name: '출차 시간', key: 'outParkingDateTime', type: 'text' },
  { name: '사용 마일리지', key: 'useMileageHourText', type: 'text' },
  { name: '이월 여부', key: 'memo', type: 'text' },
];

export const PARKING_MILEAGE_FILTER_HOURS = {
  filterName: '잔여 마일리지',
  filterKey: 'hours',
  inputType: 'radio',
  apiFetch: {
    useApi: false,
    queryKey: '',
  },
  list: [
    FILTER_ALL,
    { key: '0', label: '0시간 이하' },
    { key: '600', label: '10시간 이하' },
    { key: '1200', label: '20시간 이하' },
    { key: '1800', label: '30시간 이하' },
    { key: '2400', label: '40시간 이하' },
    { key: '3000', label: '50시간 이하' },
    { key: '6000', label: '100시간 이하' },
  ],
};

// /////////////////////////////////////////////////////////////////////////
// 입출차내역
// /////////////////////////////////////////////////////////////////////////
export const ADMIN_PARKING_IN_OUT_HISTORY_FILTERS = [
  {
    filterName: '구분',
    filterKey: 'registTypeList',
    list: [
      { key: 'HOUSEHOLD', label: '세대', checked: true },
      { key: 'STORE', label: '상가', checked: true },
      { key: 'BUSINESS', label: '업무', checked: true },
    ],
  },
  filterCarType,
];

export const ADMIN_PARKING_IN_OUT_HISTORY_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

// /////////////////////////////////////////////////////////////////////////
// 미출차내역
// /////////////////////////////////////////////////////////////////////////
export const ADMIN_PARKING_OUT_HISTORY_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

export const ADMIN_PARKING_IN_OUT_HISTORY_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '입차 게이트', key: 'lprName', type: 'text' },
  { name: '구분', key: 'registType', type: 'registType' },
  { name: '차량 유형', key: 'carType', type: 'carType' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '방문 목적', key: 'visitPurposeName', type: 'text' },
  { name: '업무 목적', key: 'businessTypeName', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '입차 일시', key: 'inParkingTime', type: 'dateTime' },
  { name: '출차 일시', key: 'outParkingTime', type: 'dateTime' },
  { name: '주차 이용 시간', key: 'parkingMinutes', type: 'usageTime' },
  { name: '', key: 'edit', type: 'text' },
];

export const ADMIN_PARKING_OUT_HISTORY_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '게이트', key: 'lprName', type: 'text' },
  { name: '구분', key: 'registType', type: 'registType' },
  { name: '차량 유형', key: 'carType', type: 'carType' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '방문 목적', key: 'visitPurposeName', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '입차 일시', key: 'inParkingTime', type: 'dateTime' },
  { name: '', key: 'edit', type: 'text' },
];

export const ADMIN_PARKING_IN_OUT_HISTORY_DETAIL_BASIC_INFO_LIST = [
  { label: '차량 번호', key: 'carNum', type: 'text' },
  { label: '구분', key: 'registType', type: 'registType' },
  { label: '게이트', key: 'gate', type: 'text' },
  {
    label: '동',
    key: 'dong',
    type: 'text',
  },
  {
    label: '호',
    key: 'ho',
    type: 'text',
  },
  {
    label: '차량 유형',
    key: 'carType',
    type: 'text',
  },
  {
    label: '방문 목적',
    key: 'visitPurpose',
    type: 'text',
  },
  {
    label: '업무 목적',
    key: 'businessType',
    type: 'text',
  },
  {
    label: '연락처',
    key: 'phone',
    type: 'phone',
  },
  {
    label: '입차 일시',
    key: 'inParkingTime',
    type: 'dateTime',
  },
  {
    label: '출차 일시',
    key: 'outParkingTime',
    type: 'dateTime',
  },
  {
    label: '주차 이용 시간',
    key: 'parkingMinutes',
    type: 'parkingUsageTime',
  },
  {
    label: '메모',
    key: 'memo',
    type: 'memo',
  },
];

// /////////////////////////////////////////////////////////////////////////
// 주차거부, 블랙리스트
// /////////////////////////////////////////////////////////////////////////
export const ADMIN_PARKING_RESTRICTIONS_TAB_LIST = [
  { name: '주차 거부', key: 'parking-reject' },
  { name: '블랙리스트', key: 'blacklist' },
];

export const ADMIN_PARKING_RESTRICTIONS_REJECT_SEARCH_INPUT_LIST = [
  inputCarNum,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

export const ADMIN_PARKING_RESTRICTIONS_REJECT_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum' },
  { name: '동', key: 'dong' },
  { name: '호', key: 'ho' },
  { name: '거부 일시', key: 'createdDate' },
  {
    name: '거부해제 요청 여부',
    key: 'releaseRequest',
  },
];

export const ADMIN_PARKING_RESTRICTIONS_REJECT_DETAIL_BASIC_INFO_LIST = [
  { label: '차량 번호', key: 'carNum' },
  { label: '거부 일시', key: 'rejectCreatedDate' },
  {
    label: '동',
    key: 'dong',
  },
  {
    label: '호',
    key: 'ho',
  },
  {
    label: '거부자',
    key: 'name',
  },
  { label: '거부 사유', key: 'reason', type: 'memo' },
];

export const ADMIN_PARKING_RESTRICTIONS_REJECT_RELEASE_DETAIL_INFO_LIST = [
  { label: '거부 해제 요청 일시', key: 'releaseRequestCreatedDate' },
  { label: '거부 해제 요청자', key: 'releaseRequestName' },
  {
    label: '거부 해제 요청 반려 사유',
    key: 'releaseRequestReason',
    type: 'memo',
  },
];

export const ADMIN_PARKING_RESTRICTIONS_REJECT_RELEASE_TABLE_COLUMNS_LIST = [
  { name: '거부 해제 일시', key: 'createdDate', type: 'dateTime' },
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '승인 상태', key: 'state', type: 'approvalState' },
];

export const ADMIN_PARKING_RESTRICTIONS_BLACKLIST_SEARCH_INPUT_LIST = [
  inputCarNum,
];

export const ADMIN_PARKING_RESTRICTIONS_BLACKLIST_TABLE_COLUMNS_LIST = [
  { name: '등록일시', key: 'createdDate', type: 'dateTime' },
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '사유', key: 'reason', type: 'memo' },
];
