import { auth } from '@/apis/axios.js';

/**
 * 전체 공지사항 리스트 조회
 *
 * @param {Object} pageable - 페이지네이션 정보
 * @param {Object} searchParams - 검색 조건 (keyword: 검색어, startDate: 시작 날짜, endDate: 종료 날짜)
 * @returns {Promise<Object>}
 */
export const getGlobalNoticeList = async (pageable, searchParams) => {
  const queryParams = {
    page: pageable.page || 0,
    size: pageable.size || 10,
    sort: pageable.sort || '',
    keyword: searchParams.keyword,
  };

  const response = await auth.get('/board/middle-admin/apartmant-notice', {
    params: queryParams,
  });

  return response;
};

/**
 * 전체 공지사항 상세 조회
 *
 * @param {string} globalNoticeUuid - 전체 공지사항 UUID
 * @returns {Promise<Object>}
 */
export const getGlobalNoticeDetail = async (globalNoticeUuid) => {
  const response = await auth.get(
    `board/middle-admin/apartmant-notice/${globalNoticeUuid}`,
  );

  return response;
};

/**
 * 전체 공지사항 등록
 *
 * @param {Object} formData - {
 *   title: string,
 *   content: string,
 *   noticeType: 'GENERAL' | 'IMPORTANT',
 *   uploadFile: multipartFile[],
 *   imageFile: multipartFile[],
 *   pushFlag: boolean,
 *   targetAptUuids: string[] - 대상 아파트 UUID 목록
 * }
 * @returns {Promise<Object>}
 */
export const postGlobalNoticePost = async (formData) => {
  const response = await auth.post(
    '/board/middle-admin/apartmant-notice',
    formData,
  );

  return response;
};

/**
 * 전체 공지사항 수정
 *
 * @param {string} globalNoticeUuid - 전체 공지사항 UUID
 * @param {Object} formData - {
 *   title: string,
 *   content: string,
 *   noticeType: 'GENERAL' | 'IMPORTANT',
 *   uploadFile: multipartFile[],
 *   imageFile: multipartFile[],
 *   targetAptUuids: string[] - 대상 아파트 UUID 목록
 * }
 * @returns {Promise<Object>}
 */
export const patchGlobalNoticePost = async (globalNoticeUuid, formData) => {
  const response = await auth.patch(
    `/board/middle-admin/apartmant-notice/${globalNoticeUuid}`,
    formData,
  );

  return response;
};

/**
 * 전체 공지사항 삭제
 *
 * @param {string|string[]} apartmantNoticeUuidList - 전체 공지사항 UUID 또는 UUID 배열
 * @returns {Promise<Object>}
 */
export const deleteGlobalNoticePost = async (apartmantNoticeUuidList) => {
  const response = await auth.delete('/board/middle-admin/apartmant-notice', {
    params: {
      apartmantNoticeUuidList,
    },
  });

  return response;
};

/**
 * 전체 공지사항 푸시 알림 재전송
 *
 * @param {string} globalNoticeUuid - 전체 공지사항 UUID
 * @returns {Promise<Object>}
 */
export const postGlobalNoticePushAlarmResend = async (globalNoticeUuid) => {
  const response = await auth.post(
    `/board/global-notice/${globalNoticeUuid}/push-resend`,
  );

  return response;
};

/**
 * 전체 공지사항 대상 아파트 목록 조회
 *
 * @returns {Promise<Object>}
 */
export const getGlobalNoticeTargetAptList = async () => {
  const response = await auth.get('/board/global-notice/target-apts');

  return response;
};

/**
 * 전체 공지사항 카테고리 목록 조회
 * @returns {Promise<Object>}
 */
export const getGlobalNoticeCategories = async () => {
  const response = await auth.get(
    '/board/middle-admin/apartmant-notice/category',
  );
  return response;
};

/**
 * 단지관리자용 전체 공지사항 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} pageable - 페이지네이션 정보
 * @param {Object} searchParams - 검색 조건 (keyword: 검색어)
 * @returns {Promise<Object>}
 */
export const getAptAdminGlobalNoticeList = async (
  aptUuid,
  pageable,
  searchParams,
) => {
  const queryParams = {
    page: pageable.page || 0,
    size: pageable.size || 10,
    keyword: searchParams.keyword || '',
  };

  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/apartmant-notice`,
    {
      params: queryParams,
    },
  );

  return response;
};

/**
 * 단지관리자용 전체 공지사항 상세 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} apartmantNoticeUuid - 전체 공지사항 UUID
 * @returns {Promise<Object>}
 */
export const getAptAdminGlobalNoticeDetail = async (
  aptUuid,
  apartmantNoticeUuid,
) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/apartmant-notice/${apartmantNoticeUuid}`,
  );

  return response;
};

/**
 * 최신 전체 공지사항 조회 (썸네일 포함)
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getLatestGlobalNoticeWithThumbnail = async (aptUuid) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/apartmant-notice/top1-thumbnail`,
  );

  return response;
};
