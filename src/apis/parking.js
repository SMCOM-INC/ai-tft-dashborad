import { auth } from '@/apis/axios.js';

/**
 * 전체 방문목적 리스트 조회
 *
 * @returns {Promise<Object>}
 */
export const getVisitPurposeList = async () => {
  const response = await auth.get('/parking/apt-admin/visit-purpose');

  return response;
};

/**
 * 전체 업무구분 리스트 조회
 *
 * @returns {Promise<Object>}
 */
export const getBusinessTypeList = async () => {
  const response = await auth.get('/parking/apt-admin/business-type');

  return response;
};

/**
 * 단지 방문목적 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getAptVisitPurposeList = async (aptUuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/apt-visit-purpose`,
  );

  return response;
};

/**
 * 단지 방문목적 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { visitPurposeUuidList: string[] }
 * @returns {Promise<Object>}
 */
export const patchVisitPurposeList = async (aptUuid, data) => {
  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/apt-visit-purpose`,
    data,
  );

  return response;
};

/**
 * 단지 업무구분 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getAptBusinessTypeList = async ({ aptUuid }) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/apt-business-type`,
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 입출차 데이터 동기화
// /////////////////////////////////////////////////////////////////////////

/**
 * 입출차 재전송 데이터 개수 조회
 *
 * @returns {Promise<Array<Object>>}
 * @param {string} aptUuid - 아파트 UUID
 */
export const getInOutHistoryResend = async ({ aptUuid }) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/inout-parking/re-send/count`,
  );
  return response;
};

/**
 * 입출차 내역 재전송
 *
 * @returns {Promise<Object>}
 * @param {string} aptUuid - 아파트 UUID
 */
export const postInOutHistoryResend = async ({ aptUuid }) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/inout-parking/re-send`,
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 주차 관리 설정
// /////////////////////////////////////////////////////////////////////////

// /////////////////////////
// 단지 기본정보
// /////////////////////////

/**
 * 주차 정책 조회 (현재 달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getParkingPolicyCurrentMonth = async (aptUuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/parking-policy/current-month`,
  );

  return response;
};

/**
 * 주차 정책 조회 (다음달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getParkingPolicyNextMonth = async (aptUuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/parking-policy/next-month`,
  );

  return response;
};

/**
 * 주차 정책 수정 (다음달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { freeParkingMinute: 30, freeParkingStartTime: '22:00:00', freeParkingEndTime: '07:00:00', freeParkingMinuteFlag: boolean, freeParkingTimeFlag: boolean }
 * @returns {Promise<Object>}
 */
export const putParkingPolicyAptAdmin = async (aptUuid, data) => {
  const response = await auth.put(
    `/parking/apt-admin/${aptUuid}/parking-policy`,
    data,
  );

  return response;
};

/**
 * 중간 관리자 주차 정책 등록 (이번달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { freeParkingMinute: 30, freeParkingStartTime: '22:00:00', freeParkingEndTime: '07:00:00', freeParkingMinuteFlag: boolean, freeParkingTimeFlag: boolean }
 * @returns {Promise<Object>}
 */
export const postParkingPolicyMiddleAdmin = async (aptUuid, data) => {
  const response = await auth.post(
    `/parking/middle-admin/${aptUuid}/parking-policy`,
    data,
  );

  return response;
};

/**
 * 마일리지 미차감 기간 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getFreeParkingDateList = async (aptUuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/parking-policy/free-parking-date`,
  );

  return response;
};

/**
 * 마일리지 미차감 기간 추가
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { freeParkingStartDate: "2024-07-01", freeParkingEndDate: "2024-07-10" }
 * @returns {Promise<Object>}
 */
export const postCreateFreeParkingDate = async ({
  aptUuid,
  freeParkingStartDate,
  freeParkingEndDate,
}) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/parking-policy/free-parking-date`,
    { freeParkingStartDate, freeParkingEndDate },
  );

  return response;
};

/**
 * 마일리지 미차감 기간 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} uuid - 무료 주차 기간 UUID
 * @returns {Promise<Object>}
 */
export const deleteFreeParkingDate = async (aptUuid, uuid) => {
  const response = await auth.delete(
    `/parking/apt-admin/${aptUuid}/parking-policy/free-parking-date/${uuid}`,
  );

  return response;
};

// /////////////////////////
// 세대 방문차량
// /////////////////////////

/**
 * 마일리지 정책 조회(주차 운영 시작 달)
 * @returns {Promise<Object>}
 */
export const getFirstMonth = async (aptUuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/household/mileage/policy/first-month`,
  );

  return response;
};

/**
 * 마일리지 정책 조회 (현재 달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getAptHouseholdMileagePolicyCurrentMonth = async (aptUuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/household/mileage/policy/current-month`,
  );
  return response;
};

/**
 * 마일리지 정책 조회 (다음달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getAptHouseholdMileagePolicyNextMonth = async (aptUuid) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/household/mileage/policy/next-month`,
  );
  return response;
};

/**
 * 단지 관리자 마일리지 정책 수정 (다음달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { baseMileage: 0, hourAmount: 0 }
 * @returns {Promise<Object>}
 */
export const putHouseholdMileagePolicyAptAdmin = async (aptUuid, data) => {
  const response = await auth.put(
    `/parking/apt-admin/${aptUuid}/household/mileage/policy`,
    data,
  );

  return response;
};

/**
 * 중간 관리자 마일리지 정책 수정 (이번달)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { baseMileage: 0, hourAmount: 0 }
 * @returns {Promise<Object>}
 */
export const postHouseholdMileagePolicyMiddleAdmin = async (aptUuid, data) => {
  const response = await auth.post(
    `/parking/middle-admin/${aptUuid}/household/mileage/policy`,
    data,
  );

  return response;
};

// /////////////////////////
// 업무 목적 관리
// /////////////////////////

/**
 * 단지 업무 목적 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { businessTypeUuidList: string[] }
 * @returns {Promise<Object>}
 */
export const patchBusinessTypeList = async (aptUuid, data) => {
  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/apt-business-type`,
    data,
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 미사용
// /////////////////////////////////////////////////////////////////////////

/**
 * 아파트 LPR 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getLprList = async (aptUuid) => {
  const response = await auth.get(`/parking/apt-admin/${aptUuid}/lpr`);

  return response;
};
