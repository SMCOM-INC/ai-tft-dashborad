import {
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
  inputName,
} from '@/constants/common.js';

// 세대정보
export const ADMIN_MEMBER_HOUSEHOLD_INFO_SEARCH_HOUSE_INPUT_LIST = [
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

export const ADMIN_MEMBER_HOUSEHOLD_INFO_HOUSE_TABLE_COLUMNS_LIST = [
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  {
    name: '등록 구성원 수',
    key: 'householdResidentCount',
    type: 'residentCount',
  },
];

export const ADMIN_MEMBER_HOUSEHOLD_INFO_DETAIL_TABLE_COLUMNS_LIST = [
  { name: '이름', key: 'name', type: 'text' },
  { name: '세대주 여부', key: 'residentType', type: 'householdHeadFlag' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '등록일', key: 'createdDate', type: 'date' },
  { name: '', key: 'button' },
];

export const ADMIN_MEMBER_HOUSEHOLD_INFO_DETAIL_PARKING_INFO = [
  {
    title: '잔여 기본 마일리지',
    value: 'remainingMileage',
  },
  {
    title: '사용한 기본 마일리지',
    value: 'useMileage',
  },
  {
    title: '추가 충전 마일리지',
    value: 'chargeMileage',
  },
];

// 등록회원
export const ADMIN_MEMBER_MEMBERINFO_SEARCH_HOUSE_INPUT_LIST = [
  inputName,
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

export const ADMIN_MEMBER_MEMBERINFO_HOUSE_TABLE_COLUMNS_LIST = [
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '이름', key: 'name', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '세대주 여부', key: 'type' },
  { name: '로그인 수', key: 'loginCount' },
  { name: '승인 상태', key: 'state', type: 'approvalState' },
  { name: '등록일', key: 'createdDate' },
];

export const ADMIN_MEMBER_MEMBERINFO_DETAIL_BASIC_INFO_LIST = [
  { label: '이름', key: 'name' },
  { label: '휴대폰 번호', key: 'phone' },
  {
    label: '세대주 여부',
    key: 'residentType',
  },
  {
    label: '승인상태',
    key: 'state',
  },
  {
    label: '등록일',
    key: 'createdDate',
  },
  {
    label: '관리자 계정 여부',
    key: 'testFlag',
  },
];

export const ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_TYPES = {
  APPROVED: 'APPROVED',
  WAITING: 'WAITING',
  REJECTED: 'REJECTED',
};

export const ADMIN_MEMBER_MEMBERINFO_DETAIL_ACTION_NAMES = {
  APPROVED: '승인',
  WAITING: '대기',
  REJECTED: '반려',
};

export const FILTER_APPROVAL_STATE = {
  filterName: '승인상태',
  filterKey: 'state',
  list: [
    { key: 'ALL', label: '전체', checked: true },
    { key: 'WAITING', label: '대기', checked: false },
    { key: 'APPROVED', label: '승인', checked: false },
    { key: 'REJECTED', label: '반려', checked: false },
  ],
};
