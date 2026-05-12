import {
  inputContact,
  inputDong,
  inputHo,
  inputHouseholdNumber,
} from '@/constants/common.js';

export const VOTE_TYPE = {
  REPRESENT: '선거투표',
  NORMAL: '일반투표',
  AGAINST: '찬반투표',
};

export const VOTER_STATE = {
  PENDING: '미완료',
  VOTED: '완료',
  UN_VOTED: '투표불참',
};

// 투표 상태
export const VOTE_STATE = {
  PENDING: 'PENDING',
  PROGRESS: 'PROGRESS',
  CLOSE: 'CLOSE',
};

export const VOTERS_FILTER_STATE = {
  filterName: '상태',
  filterKey: 'statusSearchType',
  list: [
    { key: 'VOTED', label: '완료' },
    { key: 'PENDING', label: '미완료' },
    { key: 'UN_VOTED', label: '투표불참' },
  ],
};

export const AUTH_TYPE = [
  { key: 'PASS', label: 'PASS' },
  { key: 'NAME_PHONE', label: '이름 + 휴대폰' },
];

// 투표 유형 데이터
export const TYPES = [
  {
    key: 'REPRESENT',
    label: '선거투표',
    description:
      '입주자대표회의 임원, 동대표 등 아파트 운영진을 선출하기 위한 투표',
  },
  {
    key: 'NORMAL',
    label: '일반투표',
    description:
      '아파트 관리규약 개정, 공용시설 이용방안 등 공동체 생활에 관한 일반 사항을 결정하는 투표',
  },
  {
    key: 'AGAINST',
    label: '찬반투표',
    description:
      '공사 진행, 예산 사용 등 중요 안건에 대해 찬성/반대를 결정하는 투표',
  },
];

// 리스트 페이지
export const LIST_SEARCH_INPUT_LIST = [
  {
    key: 'VOTE_GROUP_NAME',
    label: '그룹명',
    inputType: 'text',
  },
  {
    key: 'VOTE_NAME',
    label: '투표명',
    inputType: 'text',
  },
];

export const LIST_ERROR_MODAL_MESSAGE = {
  EDIT: {
    STATE_LIMIT: '투표가 진행중이거나 종료됐을 때는 수정이 불가능합니다.',
    TIME_LIMIT: '투표 시작이 1시간 미만일 때는 수정이 불가능합니다.',
  },
  DELETE: {
    STATE_LIMIT: '투표가 진행중일 때는 삭제가 불가능합니다.',
    TIME_LIMIT: '투표 시작이 1시간 미만일 때는 삭제가 불가능합니다.',
  },
  NONE: '조건을 만족하지 않아 작업을 진행할 수 없습니다.',
};

// 상세페이지 : 기본
export const DETAIL_TABS_LIST = [
  { name: '기본', key: 'content' },
  { name: '참여자', key: 'voters' },
];

export const DETAIL_DEFAULTS_TABLE_HEADERS = [
  [{ label: '그룹명', key: 'groupName' }],
  [{ label: '제목', key: 'title' }],
  [
    { label: '투표 유형', key: 'voteType' },
    { label: '인증 유형', key: 'voteAuthType' },
  ],
  [
    { label: '기간', key: 'date' },
    { label: '상태', key: 'voteStatus' },
  ],
  [
    { label: '총 참여인원', key: 'fullVoterCount' },
    { label: '참여율', key: 'voteRate' },
  ],
  [
    { label: '참여 인원', key: 'votedCount' },
    { label: '불참 인원', key: 'notVotedCount' },
  ],
  [
    { label: '담당자 이름', key: 'voteManagerName' },
    { label: '담당자 직책', key: 'voteManagerPosition' },
  ],
];

// 상세페이지 : 투표 참여자
export const DETAIL_VOTERS_SEARCH_INPUT_LIST = [
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

// 상세페이지 : 투표 참여자
export const DETAIL_VOTERS_TABLE_COLUMNS_LIST = [
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '이름', key: 'name', type: 'text' },
  { name: '연락처', key: 'phone', type: 'phone' },
  { name: '참여상태', key: 'voterStatus', type: 'text' },
  { name: '서명보기', key: 'sign', type: 'text' },
];

// 등록페이지 : 투표 대상자 확인하기
export const VOTER_COLUMN_LIST = [
  { key: 'name', label: '이름' },
  { key: 'dong', label: '동' },
  { key: 'ho', label: '호' },
  { key: 'phone', label: '연락처' },
];

// 메시지 예약발송 안내 문구
export const VOTE_SMS_RESERVATION_INFO_TEXT = [
  '전체 참여자의 연락처로 카카오 알림톡을 발송합니다.',
  '이미 투표에 참여한 인원에게는 메시지가 발송되지 않습니다.',
  '모든 메시지에는 참여 링크가 포함되어 있습니다.',
  '메시지 예약내역 및 삭제는 예약하기 창에서 확인 가능합니다',
];
