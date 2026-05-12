import { auth } from '@/apis/axios.js';

// 정기차량 리스트 조회
export const getRegularList = async ({
  aptUuid,
  type,
  page,
  size,
  searchType,
  keyword,
  businessTypeUuidList,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/regular/${type}`,
    { params: { page, size, searchType, keyword, businessTypeUuidList } },
  );

  return response;
};

// 정기등록 차량 등록
export const postRegular = async (params, type) => {
  const endpoint = type === 'HOUSEHOLD' ? 'household' : 'business';
  const response = await auth.post(
    `/parking/apt-admin/${params.aptUuid}/regular/${endpoint}`,
    params,
  );

  return response;
};

// 정기등록 차량 수정
export const patchRegular = async (params, type) => {
  const { aptUuid, uuid, ...updateData } = params;
  const endpoint = type === 'HOUSEHOLD' ? 'household' : 'business';

  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/regular/${endpoint}/${uuid}`,
    updateData,
  );

  return response;
};

/**
 * 세대 정기등록 차량 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} request - 등록 정보 (carNum: 차량번호, dong: 동, ho: 호, name: 이름, memo: 메모, phone: 전화번호, regularCarType: 정기등록 차량 유형(RESIDENT or REGULAR), registType: 등록 유형(HOUSEHOLD, STORE, or BUSINESS), startDate: 시작일(YYYY-MM-DD), endDate: 종료일(YYYY-MM-DD))
 * @returns {Promise<Object>}
 */
export const postHouseholdRegular = async ({
  aptUuid,
  registType,
  carNum,
  phone,
  name,
  startDate,
  endDate,
  memo,
  regularCarType,
  dong,
  ho,
  notificationFlag,
}) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/regular/household`,
    {
      carNum,
      dong,
      ho,
      name,
      memo,
      phone,
      regularCarType,
      registType,
      startDate,
      endDate,
      notificationFlag,
    },
  );

  return response;
};

/**
 * 업무 정기등록 차량 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} request - 등록 정보 (carNum: 차량번호, name: 이름, phone: 전화번호, regularCarType: 정기등록 차량 유형(RESIDENT or REGULAR), businessTypeUuid: 업무 목적 UUID, startDate: 시작일(YYYY-MM-DD), endDate: 종료일(YYYY-MM-DD))
 * @returns {Promise<Object>}
 */
export const postBusinessRegular = async ({
  aptUuid,
  registType,
  carNum,
  phone,
  name,
  startDate,
  endDate,
  memo,
  businessTypeUuid,
}) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/regular/business`,
    {
      registType,
      carNum,
      phone,
      name,
      startDate,
      endDate,
      memo,
      businessTypeUuid,
    },
  );

  return response;
};

/**
 * 세대 정기등록 차량 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} request - 수정 정보 (carNum: 차량번호, dong: 동, ho: 호, name: 이름, memo: 메모, phone: 전화번호, regularCarType: 정기등록 차량 유형(RESIDENT or REGULAR), registType: 등록 유형(HOUSEHOLD, STORE, or BUSINESS), startDate: 시작일(YYYY-MM-DD), endDate: 종료일(YYYY-MM-DD))
 * @returns {Promise<Object>}
 */
export const patchHouseholdRegular = async ({
  aptUuid,
  uuid,
  registType,
  carNum,
  phone,
  name,
  startDate,
  endDate,
  memo,
  regularCarType,
  dong,
  ho,
  notificationFlag,
}) => {
  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/regular/household/${uuid}`,
    {
      registType,
      carNum,
      phone,
      name,
      startDate,
      endDate,
      memo,
      regularCarType,
      dong,
      ho,
      notificationFlag,
    },
  );

  return response;
};

/**
 * 업무 정기등록 차량 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} request - 수정 정보 (carNum: 차량번호, name: 이름, phone: 전화번호, regularCarType: 정기등록 차량 유형(RESIDENT or REGULAR), businessTypeUuid: 업무 목적 UUID, startDate: 시작일(YYYY-MM-DD), endDate: 종료일(YYYY-MM-DD))
 * @returns {Promise<Object>}
 */
export const patchEditBusinessRegular = async ({
  aptUuid,
  uuid,
  registType,
  carNum,
  phone,
  name,
  startDate,
  endDate,
  memo,
  businessTypeUuid,
}) => {
  const response = await auth.patch(
    `/parking/apt-admin/${aptUuid}/regular/business/${uuid}`,
    {
      registType,
      carNum,
      phone,
      name,
      startDate,
      endDate,
      memo,
      businessTypeUuid,
    },
  );

  return response;
};

// 정기차량 엑셀 다운로드
export const getRegularListExcel = async ({
  aptUuid,
  type,
  searchType,
  keyword,
  businessTypeUuidList,
}) => {
  const response = await auth.get(
    `/parking/apt-admin/${aptUuid}/regular/${type}/excel`,
    {
      params: { searchType, keyword, businessTypeUuidList },
      responseType: 'blob',
    },
  );

  return response;
};

/**
 * 정기등록 차량 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string[]} regularUuidList - 정기등록 차량 UUID 리스트
 * @returns {Promise<Object>}
 */
export const deleteRegular = async ({ aptUuid, regularUuidList }) => {
  const response = await auth.delete(`/parking/apt-admin/${aptUuid}/regular`, {
    params: { regularUuidList },
  });

  return response;
};
