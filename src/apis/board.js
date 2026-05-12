import { auth } from '@/apis/axios.js';

/**
 * 게시판 설정 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<{communityAuthorDisplay: AuthorDisplay, communityCommentAuthorDisplay: AuthorDisplay, complaintAuthorDisplay: AuthorDisplay, complaintCommentAuthorDisplay: AuthorDisplay}>}
 */
export const getBoardSetting = async (aptUuid) => {
  const response = await auth.get(`/board/apt-admin/${aptUuid}/setting`);

  return response;
};

/**
 * 게시판 설정 수정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} request - {
 *   communityAuthorDisplay: string (작성자 표시 유형, e.g. ANONYMOUS("익명"), ANONYMOUS_DONG("익명, 동"), ANONYMOUS_DONG_HO("익명, 동, 호"), NICKNAME("닉네임"), NICKNAME_DONG("닉네임, 동"), NICKNAME_DONG_HO("닉네임, 동, 호"), NAME("실명"), NAME_DONG("실명, 동"), NAME_DONG_HO("실명, 동, 호")),
 *   communityCommentAuthorDisplay: string (댓글 작성자 표시 유형, e.g. ANONYMOUS("익명"), ANONYMOUS_DONG("익명, 동"), ANONYMOUS_DONG_HO("익명, 동, 호"), NICKNAME("닉네임"), NICKNAME_DONG("닉네임, 동"), NICKNAME_DONG_HO("닉네임, 동, 호"), NAME("실명"), NAME_DONG("실명, 동"), NAME_DONG_HO("실명, 동, 호")),
 *   complaintAuthorDisplay: string (민원 작성자 표시 유형, e.g. ANONYMOUS("익명"), ANONYMOUS_DONG("익명, 동"), ANONYMOUS_DONG_HO("익명, 동, 호"), NICKNAME("닉네임"), NICKNAME_DONG("닉네임, 동"), NICKNAME_DONG_HO("닉네임, 동, 호"), NAME("실명"), NAME_DONG("실명, 동"), NAME_DONG_HO("실명, 동, 호")),
 *   complaintCommentAuthorDisplay: string (민원 댓글 작성자 표시 유형, e.g. ANONYMOUS("익명"), ANONYMOUS_DONG("익명, 동"), ANONYMOUS_DONG_HO("익명, 동, 호"), NICKNAME("닉네임"), NICKNAME_DONG("닉네임, 동"), NICKNAME_DONG_HO("닉네임, 동, 호"), NAME("실명"), NAME_DONG("실명, 동"), NAME_DONG_HO("실명, 동, 호"))
 * }
 * @returns {Promise<Object>}
 */
export const patchBoardSetting = async ({ aptUuid, data }) => {
  const response = await auth.patch(
    `/board/apt-admin/${aptUuid}/setting`,
    data,
  );

  return response;
};

// 게시판 파일 업로드
export const postBoardFile = async ({ aptUuid, formData }) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response;
};
