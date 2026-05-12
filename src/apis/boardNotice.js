import { auth } from '@/apis/axios.js';

// 공지사항 리스트 조회
export const getNoticeList = async ({
  aptUuid,
  page,
  size,
  keyword,
  categoryUuid,
  noticeType,
  startDate,
  endDate,
}) => {
  const response = await auth.get(`/board/apt-admin/notice/${aptUuid}`, {
    params: {
      page,
      size,
      keyword,
      categoryUuid,
      noticeType,
      startDate,
      endDate,
    },
  });

  return response;
};

/**
 * 공지사항 상세 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} noticeUuid - 공지사항 UUID
 * @returns {Promise<Object>}
 */
export const getNoticeDetail = async (aptUuid, noticeUuid) => {
  const response = await auth.get(
    `/board/apt-admin/notice/${aptUuid}/${noticeUuid}`,
  );

  return response;
};

/**
 * 공지사항 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} formData - {
 *   title: string,
 *   content: string,
 *   noticeType: NoticeType,
 *   uploadFile: multipartFile[],
 *   imageFile: multipartFile[],
 *   pushFlag: boolean
 * }
 * @returns {Promise<Object>}
 */
export const postNoticePost = async (aptUuid, formData) => {
  const response = await auth.post(
    `/board/apt-admin/notice/${aptUuid}`,
    formData,
  );

  return response;
};

/**
 * 공지사항 수정
 *
 * @param {string} noticeUuid - 공지사항 UUID
 * @param {Object} formData - {
 *   title: string,
 *   content: string,
 *   noticeType: NoticeType,
 *   uploadFile: multipartFile[],
 *   imageFile: multipartFile[]
 * }
 * @returns {Promise<Object>}
 */
export const patchNoticePost = async (noticeUuid, formData) => {
  const response = await auth.patch(
    `/board/apt-admin/notice/${noticeUuid}`,
    formData,
  );

  return response;
};

/**
 * 공지사항 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} noticeUuid - 공지사항 UUID
 * @returns {Promise<Object>}
 */
export const deleteNoticePost = async ({ noticeUuid }) => {
  const response = await auth.delete(`/board/apt-admin/notice/${noticeUuid}`);

  return response;
};

/**
 * 공지사항 카테고리 조회
 *
 * @returns {Promise<Object>}
 */
export const getNoticeCategoryList = async ({ aptUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/notice/${aptUuid}/category`,
  );

  return response;
};

/**
 * 공지사항 푸시 알림 재전송
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} noticeUuid - 공지사항 UUID
 * @returns {Promise<Object>}
 */
export const postNoticePushAlarmResend = async (aptUuid, noticeUuid) => {
  const response = await auth.post(
    `/board/apt-admin/notice/${aptUuid}/${noticeUuid}/push-resend`,
  );

  return response;
};
