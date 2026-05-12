import { auth } from '@/apis/axios.js';

// 아파트 상세 조회(상가 관리자)
export const getStoreAdminDetail = async () => {
  const response = await auth.get(`/apartmant/store-admin`);

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 상가관리
// /////////////////////////////////////////////////////////////////////////

// 상가리스트 조회
export const getStoreList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
}) => {
  const response = await auth.get(`/apartmant/store-admin/${aptUuid}/store`, {
    params: {
      page,
      size,
      searchType,
      keyword,
    },
  });

  return response;
};

// 상가 등록
export const postStore = async ({
  aptUuid,
  storeDong,
  storeHo,
  storeName,
  representativePhone,
  representativeName,
  storeId,
  password,
  freeParkingDiscountMinute,
}) => {
  const response = await auth.post(`/apartmant/store-admin/${aptUuid}/store`, {
    storeDong,
    storeHo,
    storeName,
    representativePhone,
    representativeName,
    storeId,
    password,
    freeParkingDiscountMinute,
  });

  return response;
};

// 상가 수정
export const patchStore = async ({
  aptUuid,
  storeUuid,
  storeName,
  representativePhone,
  representativeName,
  freeParkingDiscountMinute,
}) => {
  const response = await auth.patch(
    `/apartmant/store-admin/${aptUuid}/store/${storeUuid}`,
    {
      storeName,
      representativePhone,
      representativeName,
      freeParkingDiscountMinute,
    },
  );

  return response;
};

// 상가 삭제
export const deleteStore = async ({ aptUuid, storeUuid }) => {
  const response = await auth.delete(
    `/apartmant/store-admin/${aptUuid}/store/${storeUuid}`,
  );

  return response;
};

// 상가 상세 조회
export const getStoreDetail = async ({ aptUuid, storeUuid }) => {
  const response = await auth.get(
    `/apartmant/store-admin/${aptUuid}/store/${storeUuid}`,
    {},
  );

  return response;
};

// 상가리스트 조회 엑셀다운로드
export const getStoreListExcel = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/inout-parking/excel`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
      },
      responseType: 'blob',
    },
  );

  return response;
};

// 상가 엑셀 업로드
export const postStoreForExcel = async ({ aptUuid, formData }) => {
  const response = await auth.post(
    `/board/apt-admin/vote/${aptUuid}`,
    formData,
  );

  return response;
};

// 상가 비밀번호 초기화
export const patchInitPassword = async ({ aptUuid, storeUuid, password }) => {
  const response = await auth.patch(
    `/apartmant/store-admin/${aptUuid}/store/${storeUuid}/password`,
    { password },
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 주차관리설정
// /////////////////////////////////////////////////////////////////////////

// 상가 주차관리설정 조회
export const getStoreSettingPolicy = async ({ aptUuid }) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/store/policy`,
    {},
  );

  return response;
};

// 상가 주차관리설정 등록, 수정
export const patchStoreSettingPolicy = async ({
  aptUuid,
  parkingDiscountType,
  billingType,
  parkingPrice,
  turningMinute,
  accountNumber,
}) => {
  const response = await auth.patch(
    `/parking/store-admin/${aptUuid}/store/policy`,
    {
      parkingDiscountType,
      billingType,
      parkingPrice,
      turningMinute,
      accountNumber,
    },
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 입출차내역
// /////////////////////////////////////////////////////////////////////////

// 입출차내역 조회
export const getStoreInOutHistoryList = async ({
  aptUuid,
  page,
  size,
  keyword,
  startDateTime,
  endDateTime,
  settlementFlag,
}) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/store/inout-parking`,
    {
      params: {
        page,
        size,
        keyword,
        startDateTime,
        endDateTime,
        settlementFlag,
      },
    },
  );

  return response;
};

// 입출차내역 상세조회
export const getStoreInOutHistoryDetail = async ({
  aptUuid,
  inParkingUuid,
}) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/store/inout-parking/${inParkingUuid}`,
  );

  return response;
};

// 입출차내역 조회 엑셀다운로드
export const getStoreInOutHistoryExcel = async ({
  aptUuid,
  page,
  size,
  keyword,
  startDateTime,
  endDateTime,
  settlementFlag,
}) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/store/inout-parking/excel`,
    {
      params: {
        page,
        size,
        keyword,
        startDateTime,
        endDateTime,
        settlementFlag,
      },
      responseType: 'blob',
    },
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 할인내역
// /////////////////////////////////////////////////////////////////////////

// 할인내역 조회
export const getStoreDiscountHistoryList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
}) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/parking-discount`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        startDateTime,
        endDateTime,
      },
    },
  );

  return response;
};

// 할인내역 조회 엑셀다운로드
export const getStoreDiscountHistoryExcel = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
}) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/parking-discount/excel`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        startDateTime,
        endDateTime,
      },
      responseType: 'blob',
    },
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 충전내역
// /////////////////////////////////////////////////////////////////////////

// 충전내역 조회
export const getStoreChargeHistoryList = async ({
  aptUuid,
  page,
  size,
  keyword,
  startDateTime,
  endDateTime,
}) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/parking-minute-charge`,
    {
      params: {
        page,
        size,
        keyword,
        startDateTime,
        endDateTime,
      },
    },
  );

  return response;
};

// 충전내역 조회 엑셀다운로드
export const getStoreChargeHistoryExcel = async ({
  aptUuid,
  page,
  size,
  keyword,
  startDateTime,
  endDateTime,
}) => {
  const response = await auth.get(
    `/parking/store-admin/${aptUuid}/parking-minute-charge/excel`,
    {
      params: {
        page,
        size,
        keyword,
        startDateTime,
        endDateTime,
      },
      responseType: 'blob',
    },
  );

  return response;
};

// 충전내역 환불처리
export const patchStoreChargeRefund = async ({ aptUuid, chargeUuid }) => {
  const response = await auth.patch(
    `/parking/store-admin/${aptUuid}/parking-minute-charge/${chargeUuid}/refund`,
  );

  return response;
};

// 충전내역 입금완료처리
export const patchStoreChargeComplete = async ({ aptUuid, chargeUuid }) => {
  const response = await auth.patch(
    `/parking/store-admin/${aptUuid}/parking-minute-charge/${chargeUuid}/complete`,
  );

  return response;
};

// 충전내역 입금 취소
export const patchStoreChargeCancel = async ({ aptUuid, chargeUuid }) => {
  const response = await auth.delete(
    `/parking/store-admin/${aptUuid}/parking-minute-charge/${chargeUuid}`,
  );

  return response;
};
