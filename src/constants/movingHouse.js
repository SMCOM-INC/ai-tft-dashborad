import {
  inputDong,
  inputHo,
  inputHouseholdNumber,
} from '@/constants/common.js';

export const MOVING_HOUSE_SETTINGS_TAB_LIST = [
  { name: '기본 설정', key: 'default' },
  { name: '휴무 지정', key: 'dayOff' },
];

export const MOVING_HOUSE_PRICE_TYPE = [
  { label: '사용', key: 'active' },
  { label: '사용안함', key: 'inActive' },
];

export const MOVING_HOUSE_MOVING_TYPE = [
  { label: '전입', key: 'in' },
  { label: '전출', key: 'out' },
];

export const MOVING_HOUSE_MOVING_TIME_OPTION_LIST = [
  { key: 'am', label: '오전 09:00 - 11:00' },
  { key: 'pm', label: '오후 12:00 - 15:00' },
];

export const MOVING_HOUSE_TABLE_COLUMNS_LIST = [
  { key: 'movingDate', name: '이사 날짜' },
  { key: 'movingTime', name: '이사 시간' },
  { key: 'dong', name: '동' },
  { key: 'ho', name: '호' },
  { key: 'line', name: '라인세트' },
  { key: 'movingType', name: '이사유형' },
  { key: 'state', name: '접수상태' },
  { key: 'createdDate', name: '접수일시' },
  { key: 'number', name: '접수번호' },
];

export const MOVING_HOUSE_STATUS_LIST = [
  { status: 'WAITING', label: '접수대기', color: 'gray-100' },
  { status: 'COMPLETED', label: '처리완료', color: 'blue-10' },
  { status: 'CANCELED', label: '접수취소', color: 'gray-40' },
];

export const MOVING_HOUSE_DETAIL_RESIDENT_INFO_COLUMNS_LIST = [
  { key: 'name', name: '이름' },
  { key: 'phone', name: '연락처' },
  { key: 'householderFlag', name: '세대주 여부' },
  { key: 'depositor', name: '입금자명' },
];

export const MOVING_HOUSE_LIST_SEARCH_INPUT_LIST = {
  inputs: [
    inputDong,
    inputHo,
    inputHouseholdNumber,
    {
      key: 'number',
      label: '접수번호',
      value: '',
      inputType: 'text',
    },
  ],
  filters: [
    {
      filterName: '이사시간',
      filterKey: 'movingTime',
      inputType: 'checkbox',
      list: [
        { key: 'am', label: '오전', checked: true },
        { key: 'pm', label: '오후', checked: true },
      ],
    },
    {
      filterName: '유형',
      filterKey: 'movingType',
      inputType: 'checkbox',
      list: [
        { key: 'in', label: '전입', checked: true },
        { key: 'out', label: '전출', checked: true },
      ],
    },
    {
      filterName: '접수상태',
      filterKey: 'status',
      inputType: 'checkbox',
      list: [...MOVING_HOUSE_STATUS_LIST],
    },
  ],
};

export const MOVING_HOUSE_CALENDAR_SEARCH_INPUT_LIST = {
  inputs: [
    inputDong,
    inputHo,
    inputHouseholdNumber,
    {
      key: 'number',
      label: '접수번호',
      value: '',
      inputType: 'text',
    },
  ],
};

export const MOVING_HOUSE_EDIT_DEFAULT_FIELD = [
  { type: 'dong', label: '동' },
  { type: 'ho', label: '호' },
  { type: 'line', label: '라인세트' },
];

export const MOVING_HOUSE_DETAIL_TOAST_MESSAGE = {
  confirmed: '예약이 확정되었습니다.',
  edited: '예약이 수정되었습니다.',
  canceled: '예약이 취소되었습니다.',
};
