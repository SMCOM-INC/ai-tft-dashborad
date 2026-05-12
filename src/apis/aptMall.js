import { auth } from '@/apis/axios.js';

/**
 * 주문 리스트 조회
 *
 * @param {Object} params - 요청 매개변수
 * @param {string} params.aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getAptMallList = async ({ aptUuid, size, page }) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/apt-mall/order`,
    {
      params: {
        size,
        page,
      },
    },
  );

  return response;
};

/**
 * 주문 상세 조회
 *
 * @param {Object} params - 요청 매개변수
 * @param {string} params.aptUuid - 아파트 UUID
 * @param {string} params.aptMallUuid - 조식예약 UUID
 * @returns {Promise<Object>}
 */
export const getAptMallDetail = async ({ aptUuid, aptMallUuid }) => {
  const response = await auth.get(
    `/apartmant/apt-admin/${aptUuid}/apt-mall/order/${aptMallUuid}`,
  );

  return response;
};

/**
 * 주문 취소
 *
 * @param {Object} params - 요청 매개변수
 * @param {string} params.aptUuid - 아파트 UUID
 * @param {string} params.aptMallUuid - 조식예약 UUID
 * @returns {Promise<Object>}
 */
export const deleteAptMall = async ({ aptUuid, aptMallUuid }) => {
  const response = await auth.delete(
    `/apartmant/apt-admin/${aptUuid}/apt-mall/order/${aptMallUuid}`,
  );

  return response;
};
