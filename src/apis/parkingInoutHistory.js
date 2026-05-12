import { auth } from '@/apis/axios.js';

/**
 * 입출차 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} pageable - 페이지네이션 정보
 * @param {Object} searchParams - 검색 조건 (searchType: 검색 타입(차량번호, 휴대폰번호, 동, 호, 동-호), keyword: 검색어, registTypeList: 등록 유형 목록, carTypeList: 차량 유형 목록, visitPurposeUuidList: 방문 목적 UUID 목록, businessTypeUuidList: 업무 목적 UUID 목록, startDate: 시작 날짜, endDate: 종료 날짜)
 * @returns {Promise<Object>}
 */
export const getInOutHistoryList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
  registTypeList,
  carTypeList,
  visitPurposeUuidList,
  businessTypeUuidList,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/inout-parking`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        startDateTime,
        endDateTime,
        registTypeList,
        carTypeList,
        visitPurposeUuidList,
        businessTypeUuidList,
      },
    },
  );

  return response;
};

// 입출차 리스트 엑셀 다운로드
export const getInOutHistoryListExcel = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDateTime,
  endDateTime,
  registTypeList,
  carTypeList,
  visitPurposeUuidList,
  businessTypeUuidList,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/inout-parking/excel`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        startDateTime,
        endDateTime,
        registTypeList,
        carTypeList,
        visitPurposeUuidList,
        businessTypeUuidList,
      },
      responseType: 'blob',
    },
  );

  return response;
};

/**
 * 입출차 상세 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} uuid - 입출차 UUID
 * @returns {Promise<Object>}
 */
export const getInOutHistoryDetail = async (aptUuid, uuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/inout-parking/${uuid}`,
  );

  return response;
};

/**
 * 입출차 생성
 * @returns {Promise<Object>}
 */
export const postInOutHistory = async ({ aptUuid, convertedSubmitValue }) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/inout-parking`,
    convertedSubmitValue,
  );

  return response;
};

/**
 * 입출차 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} uuid - 입출차 UUID
 * @param {Object} request - 수정 정보 (carNum: 차량번호, registType: 등록 유형 (HOUSEHOLD, STORE, BUSINESS), dong: 동, ho: 호, visitPurposeUuid: 방문 목적 UUID, businessTypeUuid: 업무 유형 UUID, phone: 전화번호, memo: 메모)
 * @returns {Promise<Object>}
 */
export const patchInOutHistory = async (aptUuid, uuid, request) => {
  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/inout-parking/${uuid}`,
    request,
  );

  return response;
};

// 입출차 동호수 수정(일반 차량)
export const patchInOutHistoryGeneralCar = async ({
  aptUuid,
  uuid,
  dong,
  ho,
}) => {
  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/inout-parking/general-car/${uuid}/household`,
    { dong, ho },
  );

  return response;
};

// 입출차 동호수 수정(미확인 차량)
export const patchInOutHistoryUnknownCar = async ({
  aptUuid,
  uuid,
  dong,
  ho,
  visitPurposeUuid,
}) => {
  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/inout-parking/unknown-car/${uuid}/household`,
    { dong, ho, visitPurposeUuid },
  );

  return response;
};

// 입출차 삭제
export const deleteInOutHistory = async ({ aptUuid, uuid }) => {
  const response = await auth.delete(
    `/parking/apt-admin/${aptUuid}/inout-parking/${uuid}`,
  );

  return response;
};
