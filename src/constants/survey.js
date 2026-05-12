import {
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
} from '@/constants/common.js';

// 설문 상태
export const SURVEY_STATE = {
  PENDING: 'PENDING',
  PROGRESS: 'PROGRESS',
  CLOSE: 'CLOSE',
};

export const PARTICIPANT_STATE = {
  PARTICIPATED: 'PARTICIPATED',
  PENDING: 'PENDING',
  NOT_PARTICIPATED: 'NOT_PARTICIPATED',
};

export const PARTICIPANT_STATE_LABEL = {
  PARTICIPATED: '완료',
  PENDING: '미완료',
  NOT_PARTICIPATED: '설문불참',
};

export const PARTICIPANTS_FILTER_STATE = {
  filterName: '상태',
  filterKey: 'statusSearchType',
  list: [
    { key: PARTICIPANT_STATE.PARTICIPATED, label: '완료' },
    { key: PARTICIPANT_STATE_LABEL.PENDING, label: '미완료' },
    { key: PARTICIPANT_STATE_LABEL.NOT_PARTICIPATED, label: '설문불참' },
  ],
};

// 인증 유형
export const AUTH_TYPE = [
  { key: 'NONE', label: '미지정' },
  { key: 'PASS', label: 'PASS' },
  { key: 'NAME_PHONE', label: '이름 + 휴대폰' },
];

// 리스트 페이지 에러 메시지
export const LIST_ERROR_MODAL_MESSAGE = {
  EDIT: {
    STATE_LIMIT: '설문이 진행중이거나 종료됐을 때는 수정이 불가능합니다.',
    TIME_LIMIT: '설문 시작이 1시간 미만일 때는 수정이 불가능합니다.',
  },
  DELETE: {
    STATE_LIMIT: '설문이 진행중일 때는 삭제가 불가능합니다.',
    TIME_LIMIT: '설문 시작이 1시간 미만일 때는 삭제가 불가능합니다.',
  },
  NONE: '조건을 만족하지 않아 작업을 진행할 수 없습니다.',
};

// 리스트 페이지 검색 입력
export const LIST_SEARCH_INPUT_LIST = [
  {
    key: 'GROUP_NAME',
    label: '그룹명',
    inputType: 'text',
  },
  {
    key: 'SURVEY_NAME',
    label: '설문명',
    inputType: 'text',
  },
];

// 메시지 예약발송 안내 문구
export const SMS_RESERVATION_INFO_TEXT = [
  '전체 참여자의 연락처로 카카오 알림톡을 발송합니다.',
  '이미 설문에 참여한 인원에게는 메시지가 발송되지 않습니다.',
  '모든 메시지에는 참여 링크가 포함되어 있습니다.',
  '메시지 예약내역 및 삭제는 예약하기 창에서 확인 가능합니다',
];

// 상세페이지 탭 리스트
export const DETAIL_TABS_LIST = [
  { name: '기본', key: 'content' },
  { name: '참여자', key: 'participants' },
];

export const DETAIL_DEFAULTS_TABLE_HEADERS = [
  [{ label: '그룹명', key: 'groupName' }],
  [
    { label: '제목', key: 'title' },
    { label: '인증방식', key: 'authType' },
  ],
  [
    { label: '기간', key: 'date' },
    { label: '상태', key: 'state' },
  ],
  [
    { label: '총 참여인원', key: 'totalRespondentCount' },
    { label: '참여율', key: 'participationRate' },
  ],
  [
    { label: '참여 인원', key: 'participantCount' },
    { label: '불참 인원', key: 'nonParticipantCount' },
  ],
];

// 상세페이지 : 설문 참여자
export const DETAIL_PARTICIPANT_SEARCH_INPUT_LIST = [
  {
    key: 'NAME',
    label: '이름',
    inputType: 'text',
  },
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
];

// 상세페이지 : 설문 참여자
export const DETAIL_PARTICIPANT_TABLE_COLUMNS_LIST = [
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '이름', key: 'name', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '참여상태', key: 'state', type: 'text' },
];

// 상세페이지 : 설문 참여자
export const PARTICIPANT_COLUMN_LIST = [
  { key: 'name', label: '이름' },
  { key: 'dong', label: '동' },
  { key: 'ho', label: '호' },
  { key: 'phone', label: '연락처' },
];
