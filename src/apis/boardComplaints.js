import { auth } from '@/apis/axios.js';

// 민원공간 리스트 조회
export const getComplaintList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDate,
  endDate,
  status,
  categoryUuidList,
}) => {
  const response = await auth.get(`/board/apt-admin/${aptUuid}/complaint`, {
    params: {
      page,
      size,
      searchType,
      keyword,
      startDate,
      endDate,
      status,
      categoryUuidList,
    },
  });

  return response;
};

/**
 * 민원공간 상세 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @returns {Promise<Object>}
 */
export const getComplaintDetail = async (aptUuid, complaintUuid) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}`,
  );

  return response;
};

/**
 * 민원공간 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @returns {Promise<Object>}
 */
export const deleteComplaintPost = async ({ aptUuid, complaintUuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}`,
  );

  return response;
};

/**
 * 민원공간 상태 변경
 *
 * @returns {Promise<Object>}
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @param {string} status - 민원 상태 (RECEIVED, IN_PROGRESS, COMPLETED)
 */
export const patchComplaintState = async (aptUuid, complaintUuid, status) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}/status`,
    status,
  );

  return response;
};

/**
 * 민원공간 카테고리 조회
 *
 * @returns {Promise<Object>}
 */
// 민원공간 카테고리 리스트 조회
export const getComplaintCategoryList = async ({ aptUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/complaint/category`,
  );

  return response;
};

/**
 * 민원공간 게시글 댓글 목록 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @returns {Promise<Object>}
 */
export const getComplaintCommentList = async (aptUuid, complaintUuid) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}/comment`,
  );

  return response;
};

/**
 * 민원공간 게시글 댓글 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @param {Object} request - { content: string, complaintCommentFileUuid?: string }
 * @returns {Promise<Object>}
 */
export const postComplaintComment = async (aptUuid, complaintUuid, request) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}/comment`,
    request,
  );

  return response;
};

/**
 * 민원공간 게시글 댓글 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @param {string} commentUuid - 댓글 UUID
 * @param {Object} request - { content: string, complaintCommentFileUuid?: string }
 * @returns {Promise<Object>}
 */
export const patchComplaintComment = async ({
  aptUuid,
  complaintUuid,
  commentUuid,
  request,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}/comment/${commentUuid}`,
    request,
  );

  return response;
};

/**
 * 민원 게시글 댓글 삭제
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @param {string} commentUuid - 댓글 UUID
 */
export const deleteComplaintComment = async (
  aptUuid,
  complaintUuid,
  commentUuid,
) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}/comment/${commentUuid}`,
  );

  return response;
};

/**
 * 민원공간 게시글 대댓글 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} complaintUuid - 민원 UUID
 * @param {string} commentUuid - 댓글 UUID
 * @param {Object} request - { content: string, complaintCommentFileUuid?: string }
 * @returns {Promise<Object>}
 */
export const postComplaintCommentReply = async ({
  aptUuid,
  complaintUuid,
  commentUuid,
  request,
}) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/complaint/${complaintUuid}/comment/${commentUuid}`,
    request,
  );

  return response;
};
