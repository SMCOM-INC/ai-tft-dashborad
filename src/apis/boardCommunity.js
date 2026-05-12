import { auth } from '@/apis/axios.js';

// 소통 게시판 리스트 조회
export const getCommunityList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  categoryUuidList,
  startDate,
  endDate,
}) => {
  const response = await auth.get(`/board/apt-admin/${aptUuid}/community`, {
    params: {
      page,
      size,
      searchType,
      keyword,
      categoryUuidList,
      startDate,
      endDate,
    },
  });

  return response;
};

/**
 * 소통 게시판 상세 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 UUID
 * @returns {Promise<Object>}
 */
export const getCommunityDetail = async (aptUuid, communityUuid) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}`,
  );

  return response;
};

/**
 * 소통 게시판 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 UUID
 * @returns {Promise<Object>}
 */
export const deleteCommunityPost = async ({ aptUuid, communityUuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}`,
  );

  return response;
};

/**
 * 소통 게시판 카테고리 조회
 *
 * @returns {Promise<Object>}
 */
// 소통 게시판 카테고리 리스트 조회
export const getCommunityCategoryList = async ({ aptUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/community/category`,
  );

  return response;
};

/**
 * 소통 게시판 카테고리 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const postCommunityCategory = async (aptUuid) => {
  const response = await auth.post(
    `/board/middle-admin/${aptUuid}/community/category/base`,
  );

  return response;
};

/**
 * 소통 게시판 게시글 댓글 목록 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 게시글 UUID
 * @returns {Promise<Object>}
 */
export const getCommunityCommentList = async ({ aptUuid, communityUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}/comment`,
  );

  return response;
};

/**
 * 소통 게시판 게시글 댓글 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 UUID
 * @param {Object} request - { content: string, communityCommentFileUuid?: string }
 * @returns {Promise<Object>}
 */
export const postCommunityComment = async ({ aptUuid, communityUuid, request }) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}/comment`,
    request,
  );

  return response;
};

/**
 * 소통 게시판 게시글 댓글 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 UUID
 * @param {string} commentUuid - 댓글 UUID
 * @param {Object} request - { content: string, communityCommentFileUuid?: string }
 * @returns {Promise<Object>}
 */
export const patchCommunityComment = async ({
  aptUuid,
  communityUuid,
  commentUuid,
  request,
}) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}/comment/${commentUuid}`,
    request,
  );

  return response;
};

/**
 * 소통 게시판 게시글 댓글 삭제
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 UUID
 * @param {string} commentUuid - 댓글 UUID
 */
export const deleteCommunityComment = async ({
  aptUuid,
  communityUuid,
  commentUuid,
}) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}/comment/${commentUuid}`,
  );

  return response;
};

/**
 * 소통 게시판 게시글 대댓글 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 UUID
 * @param {string} commentUuid - 댓글 UUID
 * @param {Object} request - { content: string, communityCommentFileUuid?: string }
 * @returns {Promise<Object>}
 */
export const postCommunityCommentReply = async ({
  aptUuid,
  communityUuid,
  commentUuid,
  request,
}) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}/comment/${commentUuid}`,
    request,
  );

  return response;
};

// 소통 게시판 신고 게시글 리스트 조회
export const getCommunityReportList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  categoryUuidList,
  startDate,
  endDate,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/community/report`,
    {
      params: {
        page,
        size,
        searchType,
        keyword,
        categoryUuidList,
        startDate,
        endDate,
      },
    },
  );

  return response;
};

/**
 * 소통 게시판 신고 게시글 상세
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid - 소통 게시판 게시글 UUID
 * @param {Object} pageable - 페이지네이션 정보
 * @returns {Promise<Object>}
 */
export const getCommunityReportDetail = async (
  aptUuid,
  communityUuid,
  pageable,
) => {
  const queryParams = {
    page: pageable.page || 0,
    size: pageable.size || 10,
    sort: pageable.sort || '',
    direction: pageable.direction || 'DESC',
  };

  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/community/${communityUuid}/report`,
    {
      params: queryParams,
    },
  );

  return response;
};
