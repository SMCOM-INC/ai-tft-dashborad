import { auth } from '@/apis/axios.js';

// /////////////////////////////////////////////////////////////////////////
// 세대 정보
// /////////////////////////////////////////////////////////////////////////

/**
 * 세대 정보 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} request - { searchType: 'HOUSEHOLD_HEAD_NAME' | 'DONG' | 'HO' | 'DONG_HO', keyword: string }
 * @param {Object} pageable
 * @returns {Promise<Object>}
 */
// 세대 정보 리스트 조회
export const getHouseholdList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
}) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/apt/household`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
      },
    },
  );

  return response;
};

/**
 * 세대 정보 상세 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} householdUuid - 세대 UUID
 * @returns {Promise<Object>}
 */
export const getHouseholdDetail = async ({ aptUuid, householdUuid }) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/apt/household/${householdUuid}`,
  );

  return response;
};

/**
 * 세대 정보 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} householdUuid - 세대 UUID
 * @returns {Promise<Object>}
 */
export const deleteHousehold = async ({ aptUuid, householdUuid }) => {
  const response = await auth.delete(
    `/apartmant/apt-admin/${aptUuid}/apt/household/${householdUuid}`,
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 등록 회원 정보
// /////////////////////////////////////////////////////////////////////////

/**
 * 등록 회원 리스트 조회
 *
 * @returns {Promise<Object>}
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} pageable - 페이지네이션 정보
 * @param {Object} searchParams - 검색 조건 (searchType: 검색 타입(이름, 연락처, 동, 호, 동-호), keyword: 검색어, state: 승인상태 (WAITING, APPROVED, REJECTED))
 */
// 등록 회원 리스트 조회
export const getResidentList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  state,
}) => {
  const response = await auth.get(`/apartmant/apt-admin/${aptUuid}/resident`, {
    params: {
      page,
      size,
      searchType,
      keyword,
      state,
    },
  });

  return response;
};

/**
 * 등록 회원 상세 조회
 *
 * @returns {Promise<Object>}
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} residentUuid - 회원 UUID
 */
export const getResidentDetail = async ({ aptUuid, residentUuid }) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/resident/${residentUuid}`,
  );

  return response;
};

/**
 * 등록 회원 상세 수정
 *
 * @returns {Promise<Object>}
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} residentUuid - 회원 UUID
 * @param {Object} residentDetail - 회원 정보 {dong: 동, ho: 호, householdHeadFlag: 세대주 여부}
 */
export const patchResidentDetail = async (
  aptUuid,
  residentUuid,
  residentDetail,
) => {
  const response = await auth.patch(
    `/apartmant/apt-admin/${aptUuid}/resident/${residentUuid}`,
    residentDetail,
  );

  return response;
};

/**
 * 등록 회원 승인 상태 변경
 *
 * @returns {Promise<Object>}
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} residentUuid - 회원 UUID
 * @param {string} residentState - 회원 승인 상태 (WAITING, APPROVED, REJECTED)
 */
export const patchResidentState = async ({
  aptUuid,
  residentUuid,
  residentState,
}) => {
  const response = await auth.patch(
    `/apartmant/apt-admin/${aptUuid}/resident/${residentUuid}/state`,
    { residentState },
  );

  return response;
};

/**
 * 등록 회원 전출처리
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} residentUuid - 입주민 UUID
 * @returns {Promise<Object>}
 */
export const deleteResident = async ({ aptUuid, residentUuid }) => {
  const response = await auth.delete(
    `/apartmant/apt-admin/${aptUuid}/resident/${residentUuid}`,
  );

  return response;
};

// 등록회원 엑셀 다운로드
export const getResidentListExcel = async ({
  aptUuid,
  searchType,
  keyword,
}) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/resident/excel`,
    {
      params: { searchType, keyword },
      responseType: 'blob',
    },
  );

  return response;
};

// 세대 이름 중복 체크
export const getResidentNameDuplicationCheck = async ({
  aptUuid,
  residentUuid,
}) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/resident/${residentUuid}/household-name-duplication-check`,
  );

  return response;
};
