import { inputAptName } from '@/constants/common.js';

export const MASTER_APT_TABLE_COLUMNS_LIST = [
  { name: '등록일', key: 'createdDate', type: 'fullDateTime' },
  { name: '단지 ID', key: 'aptId', type: 'text' },
  { name: '단지명', key: 'name', type: 'text' },
  { name: '주소', key: 'address', type: 'text' },
  { name: '세대 수', key: 'householdCount', type: 'number' },
  { name: '주차 면수', key: 'parkingSpaceCount', type: 'number' },
  { name: '사용 서비스', key: 'contentList', type: 'contentList' },
];

export const MASTER_APT_SEARCH_INPUT_LIST = [inputAptName];

export const APT_DETAILS_BASIC_INFO_LIST = [
  { label: '단지명', key: 'aptName', type: 'text' },
  { label: '단지 ID', key: 'aptId', type: 'text' },
  { label: '주소', key: 'address', type: 'text' },
  {
    label: '대표 연락처',
    key: 'aptTel',
    type: 'phone',
  },
  {
    label: '세대 수',
    key: 'householdCount',
    type: 'number',
  },
  {
    label: '주차 면 수',
    key: 'parkingSpaceCount',
    type: 'number',
  },
  {
    label: '사용중 서비스',
    key: 'contentList',
    type: 'contentList',
  },
];

export const ADMIN_APT_INFO_TAB_LIST = [
  { name: '기본정보', key: 'basic-info' },
  { name: '부서별 연락처', key: 'department-info' },
  { name: '관리사무소 운영시간', key: 'admin-office-hours' },
];

export const ADMIN_APT_HARDWARE_TAB_LIST = [
  { name: 'A-PASS 권한', key: 'apass-auth' },
  { name: 'A-PASS 단말', key: 'apass-device' },
  { name: 'LPR', key: 'lpr' },
];

export const ADMIN_APT_TABLE_COLUMNS_LIST = [
  { name: 'LPR 위치 설명', key: 'lprName', type: 'text' },
  { name: 'LPR 아이디', key: 'lprId', type: 'text' },
  { name: '방문증', key: 'visitorPass', type: 'useFlag' },
  { name: '입구', key: 'entrance', type: 'useFlag' },
  { name: 'IoTPass', key: 'iotPass', type: 'useFlag' },
  { name: '대시보드', key: 'dashboard', type: 'useFlag' },
  { name: '키오스크', key: 'kiosk', type: 'useFlag' },
  { name: '차단기', key: 'barrier', type: 'useFlag' },
  { name: '방문증 IP', key: 'visitorPassIP', type: 'text' },
  { name: '입구 IP', key: 'entranceIP', type: 'text' },
  { name: 'IoTPass IP', key: 'iotPassIP', type: 'text' },
  { name: '대시보드 IP', key: 'dashboardIP', type: 'text' },
  { name: '키오스크 IP', key: 'kioskIP', type: 'text' },
  { name: '차단기 IP', key: 'barrierIP', type: 'text' },
];

export const MAX_LOGO_SIZE = 20 * 1024 * 1024; // 20 MB

export const APT_PORT_CONFIG_FOR_CONTENT_LIST = {
  requireParkingPortsContents: [
    'e2d4f6a8-b0c2-4a6e-8d0f-1c3e5g7i9k1m',
    '4701b556-b179-4571-9c38-d4fd934612c2',
    'b2d4f6h8-j0l2-n4p6-r8t0-v2x4z6b8d0f2',
  ],
  requireElevatorPortsContents: ['m2o4q6s8-u0w2-y4a6-c8e0-g2i4k6m8o0q2'],
};

export const APARTMANT_CONTENT_LIST = {
  parking: [
    {
      uuid: '4701b556-b179-4571-9c38-d4fd934612c2',
      name: '주차',
      key: 'parking',
    },
    {
      uuid: 'b2d4f6h8-j0l2-n4p6-r8t0-v2x4z6b8d0f2',
      name: '시간권',
      key: 'parking-coupon',
    },
  ],
  board: [
    {
      uuid: 'b5d7f9h1-j3l5-n7p9-r1t3-v5x7z9b1d3f5',
      name: '소통',
      key: 'community',
    },
    {
      uuid: 'g6i8k0m2-o4q6-s8u0-w2y4-a6c8e0g2i4k6',
      name: '민원',
      key: 'complaints',
    },
  ],
  repair: [
    {
      uuid: '92b7d739-5265-43df-b5c8-830e9fb6ca0e',
      name: '하자보수',
      key: 'repair',
    },
  ],
  moving: [
    {
      uuid: '2cbdbf0d-ceed-4289-b3f7-81d6331e64da',
      name: '이사예약',
      key: 'moving',
    },
  ],
  vote: [
    {
      uuid: '666dbf0d-ceed-4289-b3f7-81d6331e64da',
      name: '전자투표',
      key: 'vote',
    },
  ],
};
