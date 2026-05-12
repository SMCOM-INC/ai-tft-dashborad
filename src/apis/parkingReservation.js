import { auth } from '@/apis/axios.js';

// 방문예약 리스트 조회
export const getReservationList = async ({
  aptUuid,
  page,
  size,
  searchType,
  keyword,
  startDate,
  endDate,
  inParkingFlag,
}) => {
  const response = await auth.get(`/parking/apt-admin/${aptUuid}/reservation`, {
    params: {
      page,
      size,
      searchType,
      keyword,
      startDate,
      endDate,
      inParkingFlag,
    },
  });

  return response;
};

/**
 * 방문예약 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} request - 등록 정보 (carNum: 차량번호, dong: 동, ho: 호, inParkingScheduledDate: 입차예정일(YYYY-MM-DD), outParkingScheduledDate: 출차예정일(YYYY-MM-DD), phone: 연락처, visitPurposeUuid: 방문목적 UUID)
 * @returns {Promise<Object>}
 */
export const postReservation = async ({
  aptUuid,
  carNum,
  dong,
  ho,
  inParkingScheduledDate,
  outParkingScheduledDate,
  phone,
  visitPurposeUuid,
  notificationFlag,
}) => {
  const response = await auth.post(
    `/parking/apt-admin/${aptUuid}/reservation`,
    {
      carNum,
      dong,
      ho,
      inParkingScheduledDate,
      outParkingScheduledDate,
      phone,
      visitPurposeUuid,
      notificationFlag,
    },
  );

  return response;
};

/**
 * 방문예약 차량 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Array<string>} visitReservationUuidList - 방문예약 UUID 리스트
 * @returns {Promise<Object>}
 */
export const deleteReservation = async ({
  aptUuid,
  visitReservationUuidList,
}) => {
  const response = await auth.delete(
    `/parking/apt-admin/${aptUuid}/reservation`,
    {
      params: {
        visitReservationUuidList,
      },
    },
  );

  return response;
};
