import {
  FILTER_ALL,
  inputCarNum,
  inputRepresentativeName,
  inputRepresentativePhone,
  inputStoreId,
  inputStoreName,
} from '@/constants/common.js';

// /////////////////////////////////////////////////////////////////////////
// 상가관리
// /////////////////////////////////////////////////////////////////////////
export const HOURS_IN_DAY = 24;
export const VALID_MINUTES = [0, 30];

const MANAGEMENT_TABLE_COLUMNS_LIST = [
  { name: '동', key: 'storeDong', type: 'text' },
  { name: '호', key: 'storeHo', type: 'text' },
  { name: '상가명', key: 'storeName', type: 'text' },
  { name: '대표 연락처', key: 'representativePhone', type: 'phone' },
  { name: '대표자 이름', key: 'representativeName', type: 'text' },
  { name: '아이디', key: 'storeId', type: 'text' },
];

export const MANAGEMENT_TABLE_COLUMNS_LIST_PREPAID = [
  ...MANAGEMENT_TABLE_COLUMNS_LIST,
  {
    name: '잔여 유료 정산시간',
    key: 'chargedParkingDiscountMinute',
    type: 'usageTime',
  },
];

export const MANAGEMENT_TABLE_COLUMNS_LIST_POSTPAID = [
  ...MANAGEMENT_TABLE_COLUMNS_LIST,
  {
    name: '당월누적 유료 정산시간',
    key: 'chargedParkingDiscountMinute',
    type: 'usageTime',
  },
];

export const MANAGEMENT_SEARCH_INPUT_LIST = [
  inputStoreName,
  inputRepresentativeName,
  inputRepresentativePhone,
  inputStoreId,
];

const MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS = [
  [
    { label: '동', key: 'storeDong' },
    { label: '호수', key: 'storeHo' },
  ],
  [
    { label: '상가명', key: 'storeName' },
    { label: '아이디', key: 'storeId' },
  ],
  [
    { label: '대표자 이름', key: 'representativeName' },
    { label: '대표 연락처', key: 'representativePhone' },
  ],
];

export const MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS_PREPAID = [
  ...MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS,
  [
    { label: '방문자당 무료 제공 시간', key: 'freeParkingDiscountMinute' },
    { label: '잔여 유료 정산 시간', key: 'chargedParkingDiscountMinute' },
  ],
];

export const MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS_POSTPAID = [
  ...MANAGEMENT_DETAIL_DEFAULTS_TABLE_HEADERS,
  [
    { label: '방문자당 무료 제공 시간', key: 'freeParkingDiscountMinute' },
    { label: '당월 누적 유료 정산 시간', key: 'chargedParkingDiscountMinute' },
  ],
];

// /////////////////////////////////////////////////////////////////////////
// 주차관리 설정
// /////////////////////////////////////////////////////////////////////////
export const SETTING_DISCOUNTS_TYPES = [
  {
    key: 'SINGLE',
    label: '단일 상가 할인',
    description:
      '방문자는 최초 1개의 상가에서만 할인 적용이 가능하며, 이후 다른 상가에서는 할인 적용이 불가능합니다.',
  },
  {
    key: 'MULTIPLE',
    label: '복수 상가 할인',
    description:
      '방문자는 2개 이상의 상가에서 할인 적용이 가능하며, 각 상가에서 개별적으로 할인 적용할 수 있습니다.',
  },
];

export const SETTING_CHARGE_TYPE = {
  PREPAID: 'PREPAID',
  POSTPAID: 'POSTPAID',
};

export const SETTING_CHARGE_TYPES = [
  {
    key: SETTING_CHARGE_TYPE.PREPAID,
    label: '선불제 (시간 충전 후 사용)',
    description:
      '유료 정산 시간을 미리 충전해두면, 방문자가 무료 주차 시간을 초과할 때, 앱의 ‘주차 시간 지급’ 기능을 통해 초과 시간만큼 충전분에서 차감되어 적용됩니다.',
  },
  {
    key: SETTING_CHARGE_TYPE.POSTPAID,
    label: '후불제 (다음 달 정산)',
    description:
      '방문자의 주차 시간이 무료 제공 시간을 초과할 경우, 초과 시간은 자동 누적되며, 해당 내역은 익월 정산됩니다.',
  },
];

export const SETTING_TURN_TYPE = {
  YES: 'YES',
  NO: 'NO',
};

export const SETTING_TURN_TYPES = [
  {
    key: SETTING_TURN_TYPE.YES,
    label: '회차 시간 제공',
    description:
      '입차 후 설정된 시간 내 출차 시, 할인 받지 않아도 회차가 가능합니다.',
  },
  {
    key: SETTING_TURN_TYPE.NO,
    label: '회차 시간 미제공',
    description: '입차 즉시 요금 계산이 시작됩니다.',
  },
];

// /////////////////////////////////////////////////////////////////////////
// 입출차내역
// /////////////////////////////////////////////////////////////////////////
export const IN_OUT_HISTORY_SEARCH_INPUT_LIST = [inputCarNum];

export const IN_OUT_HISTORY_TABLE_COLUMNS_LIST = [
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '입차 게이트', key: 'inLprName', type: 'text' },
  { name: '입차 일시', key: 'inParkingDateTime', type: 'dateTime' },
  { name: '출차 일시', key: 'outParkingDateTime', type: 'dateTime' },
  { name: '주차 이용 시간', key: 'parkingMinute', type: 'usageTime' },
  { name: '적용된 할인 시간', key: 'storeDiscountMinute', type: 'usageTime' },
  { name: '구분', key: 'settlementFlag', type: 'text' },
];

export const IN_OUT_HISTORY_DETAIL_DEFAULTS_TABLE_HEADERS = [
  [
    { label: '차량번호', key: 'carNum' },
    { label: '입차 게이트', key: 'inLprName' },
  ],
  [
    { label: '입차 일시', key: 'inParkingDateTime' },
    { label: '출차 일시', key: 'outParkingDateTime' },
  ],
  [
    { label: '주차 시간', key: 'parkingMinute' },
    { label: '적용된 할인 시간', key: 'storeDiscountMinute' },
  ],
  [{ label: '구분', key: 'settlementFlag' }],
];

export const IN_OUT_HISTORY_DETAIL_DISCOUNT_STATISTICS = [
  { label: '지급 건수', key: 'storeParkingDiscountCount' },
  { label: '총 할인', key: 'totalStoreParkingDiscountMinute' },
  { label: '무료 제공', key: 'totalStoreFreeParkingDiscountMinute' },
  { label: '유료 정산', key: 'totalStorePaidParkingDiscountMinute' },
];

export const IN_OUT_HISTORY_DETAIL_DISCOUNT_TABLE_HEADERS = [
  [{ label: '적용된 할인 시간', key: 'parkingDiscountMinute' }],
  [{ label: '무료 제공 시간', key: 'freeParkingDiscountMinute' }],
  [{ label: '유료 정산 시간', key: 'paidParkingDiscountMinute' }],
];

export const IN_OUT_HISTORY_FILTER = {
  filterName: '구분',
  filterKey: 'settlementFlag',
  list: [
    FILTER_ALL,
    { key: 'NORMAL', label: '정상' },
    { key: 'EXTRA', label: '초과 주차' },
  ],
};

// /////////////////////////////////////////////////////////////////////////
// 할인내역
// /////////////////////////////////////////////////////////////////////////
export const DISCOUNT_HISTORY_SEARCH_INPUT_LIST = [inputStoreName, inputCarNum];

export const DISCOUNT_HISTORY_TABLE_COLUMNS_LIST = [
  { name: '상가명', key: 'storeName', type: 'text' },
  { name: '차량 번호', key: 'carNum', type: 'text' },
  { name: '입차 일시', key: 'inParkingDateTime', type: 'dateTime' },
  { name: '출차 일시', key: 'outParkingDateTime', type: 'dateTime' },
  {
    name: '할인 적용 일시',
    key: 'discountDateTime',
    type: 'dateTime',
  },
  { name: '총 할인 시간', key: 'totalDiscountMinute', type: 'usageTime' },
  { name: '무료 제공 시간', key: 'freeDiscountMinute', type: 'usageTime' },
  { name: '유료 정산 시간', key: 'paidDiscountMinute', type: 'usageTime' },
];

// /////////////////////////////////////////////////////////////////////////
// 충전내역
// /////////////////////////////////////////////////////////////////////////
export const CHARGE_HISTORY_SEARCH_INPUT_LIST = [inputStoreName];

export const CHARGE_HISTORY_TABLE_COLUMNS_LIST = [
  { name: '상가명', key: 'storeName', type: 'text' },
  { name: '충전 신청 일시', key: 'createdDate', type: 'dateTime' },
  { name: '충전 시간', key: 'chargeMinute', type: 'usageTime' },
  {
    name: '충전 금액',
    key: 'chargePrice',
    type: 'currency',
  },
  { name: '상태', key: 'chargeState', type: 'text' },
  { name: '관리', key: 'buttons' },
];

export const CHARGE_HISTORY_STATISTICS = [
  { label: '총 시간', key: 'totalChargeMinute', type: 'usageTime' },
  { label: '총 금액', key: 'totalChargePrice', type: 'currency' },
  { label: '충전 시간', key: 'chargeMinute', type: 'usageTime' },
  { label: '충전 금액', key: 'chargePrice', type: 'currency' },
  { label: '환불 시간', key: 'refundChargeMinute', type: 'usageTime' },
  { label: '환불 금액', key: 'refundChargePrice', type: 'currency' },
];
