import { auth } from '@/apis/axios.js';

// /////////////////////////////////////////////////////////////////////////
// 블랙리스트
// /////////////////////////////////////////////////////////////////////////

// 블랙리스트 목록 조회
export const getBlackListList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDate,
  endDate,
}) => {
  const response = await auth.get(`/parking/apt-admin/blacklist/${aptUuid}`, {
    params: {
      aptUuid,
      page,
      size,
      searchType,
      keyword,
      startDate,
      endDate,
    },
  });

  return response;
};

// 블랙리스트 등록
export const postBlackList = async ({ aptUuid, carNum, reason }) => {
  const response = await auth.post(`/parking/apt-admin/blacklist/${aptUuid}`, {
    carNum,
    reason,
  });

  return response;
};

// 블랙리스트 삭제
export const deleteBlackList = async ({ blacklistUuid }) => {
  const response = await auth.delete(
    `/parking/apt-admin/blacklist/${blacklistUuid}`,
  );

  return response;
};

// /////////////////////////////////////////////////////////////////////////
// 거부
// /////////////////////////////////////////////////////////////////////////

// 거부 차량 목록 조회
export const getRejectList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDate,
  endDate,
}) => {
  const response = await auth.get(`/parking/apt-admin/reject/list/${aptUuid}`, {
    params: {
      aptUuid,
      page,
      size,
      searchType,
      keyword,
      startDate,
      endDate,
    },
  });

  return response;
};

/**
 * 거부 차량 상세 조회
 *
 * @param {string} rejectUuid - 거부 차량 UUID
 * @returns {Promise<Object>}
 */
export const getRejectDetail = async (rejectUuid) => {
  const response = await auth.get(`/parking/apt-admin/reject/${rejectUuid}`);

  return response;
};

// 거부 차량 삭제
export const deleteReject = async ({ rejectUuid }) => {
  const response = await auth.delete(`/parking/apt-admin/reject/${rejectUuid}`);

  return response;
};
/**
 * 거부 차량 상태 승인
 *
 * @param {string} rejectUuid - 거부 차량 UUID
 * @returns {Promise<Object>}
 */
export const patchRejectApproval = async (rejectUuid) => {
  const response = await auth.patch(
    `/parking/apt-admin/reject/${rejectUuid}/approve`,
  );

  return response;
};

/**
 * 거부 차량 상태 반려
 *
 * @param {string} rejectUuid - 거부 차량 UUID
 * @returns {Promise<Object>}
 */
export const patchRejectRelease = async (rejectUuid, { declineReason }) => {
  const response = await auth.patch(
    `/parking/apt-admin/reject/${rejectUuid}/reject`,
    { declineReason },
  );

  return response;
};
