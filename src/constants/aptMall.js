// 공통
export const STATUS_LIST = [
  { status: 'RESERVATION', label: '예약완료', color: 'primary' },
  { status: 'CANCELED', label: '취소', color: 'error' },
];

export const APT_MALL_TYPE = {
  VISIT: '방문식사',
  TAKEOUT: '포장',
  DELIVERY: '배달',
};

// 리스트 페이지
export const APT_MALL_LIST_TABLE_COLUMNS_LIST = [
  { name: '시설명', key: 'aptMallName', type: 'text' },
  { name: '신청일', key: 'createdDate', type: 'dateTime' },
  { name: '동', key: 'dong', type: 'text' },
  { name: '호', key: 'ho', type: 'text' },
  { name: '방문 일시', key: 'orderDateTime', type: 'dateTime' },
  { name: '인원수', key: 'personCount', type: 'text' },
  { name: '결제 금액', key: 'orderPrice', type: 'text' },
  { name: '예약구분', key: 'aptMallOrderType', type: 'text' },
  { name: '예약상태', key: 'aptMallOrderState', type: 'text' },
  { name: '상세보기', key: 'detail', type: 'text' },
];

// 상세 모달
export const DETAIL_TABLE_HEADERS = [
  [{ label: '시설명', key: 'aptMallName' }],
  [{ label: '신청일', key: 'createdDate' }],
  [{ label: '동', key: 'dong' }],
  [{ label: '호', key: 'ho' }],
  [{ label: '방문 일시', key: 'orderDateTime' }],
  [{ label: '인원수', key: 'personCount' }],
  [{ label: '고객 요청사항', key: 'orderNote' }],
  [{ label: '메뉴 상세', key: 'menu' }],
  [{ label: '결제 금액', key: 'orderPrice' }],
  [{ label: '예약구분', key: 'aptMallOrderType' }],
  [{ label: '예약상태', key: 'aptMallOrderState' }],
  [{ label: '취소일시', key: 'canceledDateTime' }],
  [{ label: '취소사유', key: 'canceledReason' }],
];
