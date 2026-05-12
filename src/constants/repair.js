import {
  FILTER_ALL,
  inputDong,
  inputHo,
  inputHouseholdNumber,
} from '@/constants/common.js';

export const REPAIR_STATUS_LIST_COLOR = [
  { state: 'WAITING', label: '접수대기', color: 'gray-100', disabled: false },
  { state: 'RECEIVED', label: '접수완료', color: 'orange-10', disabled: false },
  { state: 'COMPLETED', label: '처리완료', color: 'blue-10', disabled: false },
  { state: 'IMPOSSIBLE', label: '처리불가', color: 'red-10', disabled: false },
];

export const REPAIR_STATUS_LIST = REPAIR_STATUS_LIST_COLOR.map((item) => {
  return { key: item.state, label: item.label };
});

export const REPAIR_TABLE_COLUMNS_LIST = [
  { name: '접수 번호', key: 'receiptNum', type: 'text' },
  { name: '접수 일시', key: 'createdDate', type: 'dateTime' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '이름', key: 'residentName', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '접수상태', key: 'state', type: 'repairStatus' },
  { name: '방문 예정 일시', key: 'visitDateTime', type: 'dateTime' },
];

export const REPAIR_SEARCH_INPUT_LIST = [
  inputDong,
  inputHo,
  inputHouseholdNumber,
  {
    key: 'RECEIPT',
    label: '접수번호',
    value: '',
    inputType: 'text',
  },
];

export const REPAIR_DETAIL_INFO_CELL_COLUMN = [
  [
    { key: 'receiptNum', label: '접수번호' },
    { key: 'createdDate', label: '접수일시' },
  ],
  [
    { key: 'dongHo', label: '동호수' },
    { key: 'residentName', label: '작성자' },
  ],
  [
    { key: 'phone', label: '연락처' },
    { key: 'emergencyPhone', label: '비상연락처' },
  ],
  [{ key: 'state', label: '접수상태' }],
];

export const REPAIR_DETAIL_CONTENTS_CELL_COLUMN = [
  [{ key: 'location', label: '위치', type: 'text' }],
  [{ key: 'content', label: '접수내용', type: 'text' }],
  [{ key: 'requirement', label: '기타요청사항', type: 'urlDecode' }],
];

export const REPAIR_ANSWER_CELL_COLUMN = [
  { key: 'state', label: '접수상태', type: 'repairStatus' },
  { key: 'visitDateTime', label: '방문예정일시', type: 'dateTime' },
  { key: 'adminComment', label: '접수내용', type: 'urlDecode' },
];

export const REPAIR_FILTER_RECEIPT_STATE = {
  filterName: '접수상태',
  filterKey: 'state',
  list: [FILTER_ALL, ...REPAIR_STATUS_LIST],
};
