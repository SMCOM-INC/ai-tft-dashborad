import { auth } from '@/apis/axios.js';

/**
 * 블랙리스트 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} blackListUuidList  - 블랙리스트 UUID
 * @returns {Promise<Object>}
 */
export const deleteMemberBlackList = async ({ aptUuid, blackListUuidList }) => {
  const response = await auth.delete(`/board/apt-admin/${aptUuid}/black-list`, {
    params: {
      blackListUuidList,
    },
  });

  return response;
};

/**
 * 게시판 블랙리스트 목록 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} queryParams - 쿼리 파라미터 (page, size, sort)
 * @returns {Promise<Object>}
 */
export const getMemberBlackList = async (aptUuid, queryParams) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/black-list`,
    queryParams,
  );

  return response;
};

/**
 * 게시판 블랙리스트 목록 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} communityUuid  - 소통공간 UUID
 * @returns {Promise<Object>}
 */
export const postMemberBlackListAdd = async ({
  aptUuid,
  communityUuid,
  reason,
}) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/black-list/${communityUuid}`,
    {
      aptUuid,
      communityUuid,
      reason,
    },
  );

  return response;
};
