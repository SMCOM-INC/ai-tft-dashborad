import IconHouse from '@assets/icons/icon-dashboard-house.svg';
import IconParking from '@assets/icons/icon-dashboard-parking.svg';

export const DASHBOARD_HEADER_APT_INFO = [
  {
    key: 'householdCount',
    icon: IconHouse,
    label: '세대수',
  },
  {
    key: 'parkingSpaceCount',
    icon: IconParking,
    label: '주차면수',
  },
  {
    key: 'regularCount',
    label: '정기권 등록 차량',
  },
];

export const DASHBOARD_HEADER_STATS = [
  {
    key: 'waitingResidentCount',
    label: '미승인 회원수',
    unit: '명',
    pagePath: '/member/member-info?page=0&state=WAITING',
  },
  {
    key: 'notOutParkingCount',
    label: '미출차 방문차',
    unit: '대',
    pagePath: '/parking/notout-history',
  },
  {
    key: 'blackListCount',
    label: '블랙리스트 차량',
    unit: '대',
    pagePath: '/parking/restriction/blacklist',
  },
  {
    key: 'reservationCount',
    label: '오늘 방문예약 입차율',
    unit: '%',
    pagePath: '/parking/reservation',
  },
];

export const DASHBOARD_CHARTS_CAR_TYPE = [
  { key: 'REGULAR', label: '정기차량', color: '#2563EB' },
  { key: 'REGULAR_RESIDENT', label: '입주민', color: '#12C273' },
  { key: 'RESERVATION', label: '방문예약', color: '#FFC800' },
  { key: 'ALWAYS_ALLOW', label: '항상허용', color: '#FF5900' },
  { key: 'GENERAL', label: '일반 방문', color: '#8B5CF6' },
  { key: 'BLACKLIST', label: '블랙리스트', color: '#EC4899' },
];

export const DASHBOARD_CHARTS_CAR_TYPE_WIDTH_PARKING_COUNT = [
  ...DASHBOARD_CHARTS_CAR_TYPE,
  { key: 'UNKNOWN', label: '미확인', color: '#9DA4AE' },
];

export const DASHBOARD_ERROR_MESSAGES = {
  API_ERROR: '데이터를 조회할 수 없습니다.',
  SERVICE_UNAVAILABLE: `해당 단지에 추가되지 않은 서비스입니다. <br/> 아파트먼트에 문의해주세요.`,
};

export const DASHBOARD_PARKING_TYPE_IN = 'IN';
export const DASHBOARD_PARKING_TYPE_OUT = 'OUT';

export const DASHBOARD_PARKING_TYPE_OPTIONS = [
  { value: DASHBOARD_PARKING_TYPE_IN, label: '입차' },
  { value: DASHBOARD_PARKING_TYPE_OUT, label: '출차' },
];

export const DASHBOARD_CHART_X_AXIS_LABEL_STYLE = {
  colors: '#6C727E',
  fontSize: '14px',
  fontWeight: 400,
};

export const DASHBOARD_CHART_Y_AXIS_LABEL_STYLE = {
  colors: '#9DA4AE',
  fontSize: '14px',
  fontWeight: 400,
};
