import { FILTER_ALL, inputAuthor, inputTitle } from '@/constants/common.js';

export const BOARD_EDITOR_CONTENT_TYPE = {
  VOTE: 'VOTE',
  NOTICE: 'NOTICE',
  APARTMENT: 'APARTMENT',
  APARTMENT_NOTICE: 'APARTMENT_NOTICE',
  COMMUNITY: 'COMMUNITY',
  COMPLAINT: 'COMPLAINT',
};

// 게시판 설정
export const BOARD_SETTING_FORM_CONFIG = [
  {
    title: '소통공간',
    key: 'communityPolicy',
    sections: [
      { legend: '게시글 작성', key: 'post' },
      { legend: '댓글 작성', key: 'comment' },
    ],
  },
  {
    title: '민원공간',
    key: 'complaintPolicy',
    sections: [
      { legend: '게시글 작성', key: 'post' },
      { legend: '댓글 작성', key: 'comment' },
    ],
  },
];

export const BOARD_SETTING_HOUSEHOLD_INFO_OPTION_LIST = [
  { key: 'NONE', label: '미노출' },
  { key: 'DONG', label: '동만 노출' },
  { key: 'DONG_HO', label: '동호수 노출' },
];

export const BOARD_SETTING_INITIAL_VALUES = {
  communityPolicy: {
    post: { householdInfo: 'NONE', author: 'MASKING' },
    comment: { householdInfo: 'NONE', author: 'MASKING' },
  },
  complaintPolicy: {
    post: { householdInfo: 'NONE', author: 'MASKING' },
    comment: { householdInfo: 'NONE', author: 'MASKING' },
  },
};

export const BOARD_SETTING_AUTHOR_OPTION_LIST = [
  { key: 'NICKNAME', label: '닉네임' },
  { key: 'NAME', label: '실명' },
  // { key: 'ANONYMOUS', label: '익명' },
  { key: 'MASKING', label: '마스킹' },
];

export const AUTHOR_DISPLAY = {
  ANONYMOUS: '익명',
  ANONYMOUS_DONG: '익명, 동',
  ANONYMOUS_DONG_HO: '익명, 동, 호',
  NICKNAME: '닉네임',
  NICKNAME_DONG: '닉네임, 동',
  NICKNAME_DONG_HO: '닉네임, 동, 호',
  NAME: '실명',
  NAME_DONG: '실명, 동',
  NAME_DONG_HO: '실명, 동, 호',
  MASKING: '마스킹',
  MASKING_DONG: '마스킹, 동',
  MASKING_DONG_HO: '마스킹, 동, 호',
};

export const NOTICE_TYPE = {
  GENERAL: '일반',
  IMPORTANT: '필독',
  APARTMANT: '아파트먼트 공지',
};

// 공지사항
export const BOARD_NOTICE_SEARCH_INPUT_LIST = [inputTitle];

export const BOARD_NOTICE_TABLE_COLUMNS_LIST = [
  { name: '주제', key: 'categoryName', type: 'noticeCategory' },
  { name: '제목', key: 'title', type: 'title' },
  { name: '중요 여부', key: 'noticeType', type: 'noticeType' },
  { name: '조회수', key: 'viewCount', type: 'number' },
  { name: '작성일시', key: 'createdDate', type: 'dateTime' },
];

// 소통공간
export const BOARD_COMMUNITY_TAB_LIST = [
  { name: '게시글 관리', key: 'posts' },
  { name: '신고 관리', key: 'reports' },
];

export const BOARD_MEMBER_MANAGEMENT_BLACKLIST_TABLE_COLUMNS_LIST = [
  { name: '등록일시', key: 'createTime', type: 'dateTime' },
  { name: '작성자', key: 'authorText', type: 'memo' },
  { name: '사유', key: 'reason', type: 'memo' },
  { name: '', key: 'button' },
];

export const BOARD_COMMUNITY_SEARCH_INPUT_LIST = [inputTitle, inputAuthor];

export const BOARD_COMMUNITY_POSTS_TABLE_COLUMNS_LIST = [
  { name: '주제', key: 'categoryName', type: 'text' },
  { name: '제목', key: 'title', type: 'title' },
  { name: '작성자', key: 'authorText', type: 'authorText' },
  { name: '조회수', key: 'viewCount', type: 'number' },
  { name: '댓글수', key: 'commentCount', type: 'number' },
  { name: '추천수', key: 'likeCount', type: 'number' },
  { name: '작성일시', key: 'createdDate', type: 'dateTime' },
];

export const BOARD_COMMUNITY_REPORTS_TABLE_COLUMNS_LIST = [
  { name: '주제', key: 'categoryName', type: 'text' },
  { name: '제목', key: 'title', type: 'title' },
  { name: '작성자', key: 'authorText', type: 'authorText' },
  { name: '작성일시', key: 'createdDate', type: 'dateTime' },
  { name: '누적 신고 수', key: 'reportCount', type: 'number' },
];

export const BOARD_COMMUNITY_REPORTS_DETAIL_TABLE_COLUMNS_LIST = [
  { name: '내용', key: 'content', type: 'memo' },
  { name: '접수일', key: 'createdDate', type: 'dateTime' },
];

export const BOARD_STATUS = {
  visible: '노출중',
  hidden: '숨김',
  completed: '처리완료',
  inProgress: '처리중',
  received: '접수',
};

export const BOARD_NOTICE_FILTER = {
  filterName: '중요 여부',
  filterKey: 'noticeType',
  list: [
    FILTER_ALL,
    { key: 'GENERAL', label: '일반' },
    { key: 'IMPORTANT', label: '필독' },
  ],
};

// 민원공간
export const BOARD_COMPLAINTS_SEARCH_INPUT_LIST = [inputTitle, inputAuthor];

export const BOARD_COMPLAINTS_TABLE_COLUMNS_LIST = [
  { name: '주제', key: 'categoryName', type: 'text' },
  { name: '제목', key: 'title', type: 'title' },
  { name: '작성자', key: 'authorText', type: 'authorText' },
  { name: '처리 상태', key: 'status', type: 'complaintStatus' },
  { name: '조회수', key: 'viewCount', type: 'number' },
  { name: '댓글수', key: 'commentCount', type: 'number' },
  { name: '공감수', key: 'likeCount', type: 'number' },
  { name: '공개여부', key: 'privateFlag', type: 'privateFlag' },
  { name: '작성일시', key: 'createdDate', type: 'dateTime' },
];

export const BOARD_COMPLAINT_STATUS = [
  { label: '접수', key: 'RECEIVED', color: 'blue-10' },
  { label: '처리중', key: 'IN_PROGRESS', color: 'blue-100' },
  { label: '처리완료', key: 'COMPLETED', color: 'gray-200' },
];

export const CHIP_TYPE_COLUMNS = [
  'inParkingFlag',
  'categoryName',
  'status',
  'noticeType',
];

// 전체 공지사항
export const BOARD_GLOBAL_NOTICE_ADMIN_SEARCH_INPUT_LIST = [inputTitle];

export const BOARD_GLOBAL_NOTICE_ADMIN_TABLE_COLUMNS_LIST = [
  { name: '제목', key: 'title', type: 'title' },
  { name: '카테고리', key: 'categoryName', type: 'text' },
  { name: '구분', key: 'type', type: 'text' },
  { name: '작성일시', key: 'createdDate', type: 'text' },
];

// 단지 관리자 전체 공지사항 리스트 조회
export const APT_BOARD_GLOBAL_NOTICE_TABLE_COLUMNS_LIST = [
  { name: '제목', key: 'title', type: 'title' },
  { name: '카테고리', key: 'categoryName', type: 'text' },
  { name: '작성일시', key: 'createdDate', type: 'text' },
];
