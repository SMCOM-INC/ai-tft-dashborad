export const LNB_MASTER_ADMIN_LIST = [
  { label: '단지 관리', path: '/master/apt-management' },
  { label: '전체 공지 사항', path: '/master/global-notice' },
];

export const LNB_APT_ADMIN_LIST = [
  {
    id: 'dashboard',
    title: '대시보드',
    list: [{ label: '주차 현황', path: '/dashboard' }],
  },
  {
    id: 'apt',
    title: '단지 관리',
    hasSetting: true,
    list: [{ label: '우리 아파트 정보', path: '/apt/apt-info' }],
  },
  {
    id: 'member',
    title: '회원 관리',
    hasSetting: false,
    list: [
      { label: '등록 회원 정보', path: '/member/member-info' },
      { label: '세대 정보', path: '/member/household-info' },
    ],
  },
  {
    id: 'parking',
    title: '주차 관리',
    hasSetting: true,
    list: [
      { label: '정기 차량', path: '/parking/regular' },
      { label: '방문예약', path: '/parking/reservation' },
      { label: '항상허용 차량', path: '/parking/always-allow' },
      {
        label: '마일리지 사용내역',
        path: '/parking/mileage',
      },
      { label: '입출차 내역', path: '/parking/inout-history' },
      { label: '미출차 내역', path: '/parking/notout-history' },
      {
        label: '주차 거부 · 블랙리스트',
        path: '/parking/restriction',
      },
    ],
  },
  {
    id: 'board',
    title: '게시판 관리',
    hasSetting: true,
    list: [
      { id: 'boardNotice', label: '공지사항', path: '/board/notice' },
      { id: 'boardCommunity', label: '소통공간', path: '/board/community' },
      { id: 'boardComplaints', label: '민원공간', path: '/board/complaints' },
      {
        id: 'boardBlackList',
        label: '게시판 블랙리스트',
        path: '/board/blacklist',
      },
    ],
  },
  {
    id: 'repair',
    title: '하자보수 관리',
    hasSetting: false,
    list: [
      {
        label: '접수내역',
        path: '/repair/list',
      },
    ],
  },
  {
    id: 'vote',
    title: '투표•설문',
    hasSetting: false,
    list: [
      {
        label: '전자투표',
        path: '/vote/list',
      },
      {
        label: '설문조사',
        path: '/survey/list',
      },
    ],
  },
  {
    id: 'aptMall',
    title: '아파트몰 관리',
    hasSetting: false,
    list: [{ label: '예약 관리', path: '/aptMall/list' }],
  },
  {
    id: 'movingHouse',
    title: '이사 예약 관리',
    hasSetting: true,
    list: [{ label: '이사 스케쥴', path: '/movingHouse/calendar' }],
  },
  {
    id: 'fireInspection',
    title: '소방 자가 점검 관리',
    hasSetting: false,
    list: [{ label: '소방 자가 점검', path: '/fireInspection' }],
  },
];

export const LNB_STORE_ADMIN_LIST = [
  {
    id: 'parking',
    title: '상가 주차 관리',
    list: [
      { label: '상가 관리', path: '/store/management' },
      { label: '입출차 내역', path: '/store/inout-history' },
      { label: '할인 내역', path: '/store/discount-history' },
      { label: '충전 내역', path: '/store/charge-history' },
      { label: '주차 관리 설정', path: '/store/setting' },
    ],
  },
];
