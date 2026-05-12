import { auth } from '@/apis/axios.js';

// /////////////////////////////////////////////////////////////////////////
// 최고관리자
// /////////////////////////////////////////////////////////////////////////

// 단지관리 > 단지 테이블 리스트 조회
export const getMasterAptList = async ({
  page,
  size,
  sort,
  keyword,
  contentUuidList,
}) => {
  const response = await auth.get(`/apartmant/middle-admin/apt`, {
    params: { page, size, sort, keyword, contentUuidList },
  });

  return response;
};

/**
 * 단지관리 > 전체 서비스 리스트 조회
 *
 * @returns {Promise<Object>} * [{ uuid: string, name: string }]
 */
export const getAptContentList = async () => {
  const response = await auth.get(`/apartmant/middle-admin/content`);

  return response;
};

/**
 * 단지관리 > 단지 상세 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getMasterAptDetail = async (aptUuid) => {
  const response = await auth.get(`/apartmant/middle-admin/apt/${aptUuid}`);

  return response;
};

/**
 * 단지 관리 > 단지 등록
 *
 * @param {Object} formData - {
 *   name: string,
 *   address: string,
 *   logoFile: multipartFile,
 *   contentUuidList: string[],
 *   aptAdminId: string,
 *   initPassword: string,
 *   representativePhone: number,
 *   householdCount: number,
 *   parkingSpaceCount: number,
 *   guardApiPort: number,
 *   guardWebPort: number,
 *   guardSshPort: number,
 *   guardDbPort: number
 * }
 * @returns {Promise<Object>}
 */
export const postMasterApt = async (formData) => {
  const response = await auth.post(`/apartmant/middle-admin/apt`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};

/**
 * 단지 관리 > 단지 기본정보 수정
 *
 * @param {string} uuid - 아파트 UUID
 * @param {Object} formData - { name: string, address: string, logoFile: multipartFile, contentUuidList: string[], aptAdminId: string, initPassword: string, representativePhone: number, householdCount: number, parkingSpaceCount: number }
 * @returns {Promise<Object>}
 */
export const putMasterAptDetail = async (uuid, formData) => {
  const response = await auth.put(
    `/apartmant/middle-admin/apt/${uuid}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response;
};

/**
 * 단지 관리 > 단지관리자 비밀번호 초기화
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} password - 새로운 비밀번호
 * @returns {Promise<Object>}
 */
export const patchMasterAptPassword = async (aptUuid, password) => {
  const response = await auth.patch(
    `/apartmant/middle-admin/${aptUuid}/admin/init-password`,
    {
      password,
    },
  );
  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 단지 관리자
// /////////////////////////////////////////////////////////////////////////

/**
 * 헤더 > 아파트 리스트 조회
 *
 * @returns {Promise<Object>}
 */
export const getAptList = async () => {
  const response = await auth.get(`/apartmant/middle-admin/apt/list`);

  return response;
};

/**
 * 공통 > 아파트 상세 조회 (단지 관리자)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getAptDetail = async () => {
  const response = await auth.get(`/apartmant/apt-admin`);

  return response;
};

/**
 * 단지관리 > 관리사무소 운영시간 조회
 *
 * @param {string} uuid - 아파트 UUID
 * @returns {Promise<Array<Object>>} - [{ uuid: string, dayType: DayType, startTime: LocalTime, endTime: LocalTime, openFlag: boolean }]
 */
export const getAptOfficeHours = async (uuid) => {
  const response = await auth.get(`/apartmant/apt-admin/office/${uuid}`);

  return response;
};

/**
 * 단지관리 > 관리사무소 운영시간 수정
 *
 * @param {string} uuid - 아파트 UUID
 * @param {Array<Object>} formData - [{ dayType: DayType (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY), startTime: LocalTime, endTime: LocalTime, openFlag: boolean }]
 * @returns {Promise<Object>}
 */
export const putAptOfficeHours = async (uuid, formData) => {
  const response = await auth.put(
    `/apartmant/apt-admin/office/${uuid}`,
    formData,
  );

  return response;
};

/**
 * 단지관리 > 아파트 부서별 연락처 조회
 *
 * @param {string} uuid - 아파트 UUID
 * @returns {Promise<Array<Object>>} - [{ uuid: string, name: string, phone: string }]
 */
export const getAptDepartmentContact = async (uuid) => {
  const response = await auth.get(`/apartmant/apt-admin/department/${uuid}`);

  return response;
};

/**
 * 단지관리 > 아파트 부서별 연락처 수정
 *
 * @param {string} uuid - 아파트 UUID
 * @param {Array<Object>} formData - [{ name: string, phone: string }]
 * @returns {Promise<Object>}
 */
export const putAptDepartmentContact = async ({
  aptUuid,
  departmentContact,
}) => {
  const response = await auth.put(
    `/apartmant/apt-admin/department/${aptUuid}`,
    departmentContact,
  );

  return response;
};

/**
 * 단지관리 > 아파트 동 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getAptDongList = async (aptUuid) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/apt/household/dong`,
  );

  return response;
};

/**
 * 단지관리 > 아파트 동 라인 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} dongUuid - 동 UUID
 * @returns {Promise<Object>}
 */
export const getAptDongLineList = async (aptUuid, dongUuid) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/apt/household/${dongUuid}/line`,
  );

  return response;
};

/**
 * 단지관리 > 아파트 동 라인 호 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} dongUuid - 동 UUID
 * @param {string} lineUuid - 라인 UUID
 * @returns {Promise<Object>}
 */
export const getAptDongLineHoList = async (aptUuid, dongUuid, lineUuid) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/apt/household/${dongUuid}/${lineUuid}/ho`,
  );

  return response;
};

/**
 * 단지관리 > 아파트 동 일괄 생성
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { dongName: string, maxLine: string, maxFloor: string, removeHo: string[] }
 * @returns {Promise<Object>}
 */
export const postAptDongBundle = async (aptUuid, data) => {
  const response = await auth.post(
    `/apartmant/apt-admin/${aptUuid}/apt/household/dong/batch`,
    data,
  );

  return response;
};

/**
 * 단지관리 > 아파트 호 생성
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { dongName: string, lineName: string, floorName: string }
 * @returns {Promise<Object>}
 */
export const postAptHo = async (aptUuid, data) => {
  const response = await auth.post(
    `/apartmant/apt-admin/${aptUuid}/apt/household`,
    data,
  );

  return response;
};
