import { auth } from '@/apis/axios.js';

// 하자보수 게시글 리스트 조회
export const getRepairList = async ({
  aptUuid,
  page,
  size,
  sort,
  direction,
  type,
  keyword,
  state,
  startDate,
  endDate,
  visitStartDate,
  visitEndDate,
}) => {
  const response = await auth.get(`/board/apt-admin/repair/${aptUuid}/list`, {
    params: {
      page,
      size,
      sort,
      direction,
      type,
      keyword,
      state,
      startDate,
      endDate,
      visitStartDate,
      visitEndDate,
    },
  });

  return response;
};

// 하자보수 접수 상세조회
export const getRepairDetail = async ({ aptUuid, repairUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/repair/${aptUuid}/${repairUuid}`,
  );

  return response;
};

/**
 * 하자보수 접수상태 변경
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} repairUuid - 하자접수 UUID
 * @param {Object} payload - {
 *   state: string,
 *   adminComment: string,
 *   visitDateTime: LocalDateTime,
 * }
 * @returns {Promise<Object>}
 */
export const patchRepairState = async (aptUuid, repairUuid, payload) => {
  const response = await auth.patch(
    `/board/apt-admin/repair/${aptUuid}/${repairUuid}/state`,
    payload,
  );

  return response;
};

/**
 * 연락처로 입주민 정보 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} phone - 연락처
 * @returns {Promise<{dong: string, ho: string, name: string, aptResidentUuid: string}>}
 */
export const getResidentListByPhone = async (aptUuid, phone) => {
  const response = await auth.get(
    `/board/apt-admin/repair/${aptUuid}/phone?phone=${phone}`,
  );

  return response;
};

/**
 * 하자보수 접수 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} formData - {
 *   phone: string,
 *   dong: string,
 *   ho: string,
 *   name: string,
 *   emergencyPhone: string,
 *   content: string,
 *   location: string,
 *   requirement: string,
 *   fileList: multipartFile[],
 * }
 * @returns {Promise<Object>}
 */
export const postRepair = async ({ aptUuid, residentUuid, formData }) => {
  const response = await auth.post(
    `/board/apt-admin/repair/${aptUuid}/${residentUuid}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response;
};
