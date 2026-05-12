import { auth } from '@/apis/axios.js';

/**
 * 이사 설정 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - {
 *   moveReservationPrice: number,
 *   depositBank: string,
 *   depositAccountHolder: string,
 *   depositAccount: string,
 *   moveReservationText: string,
 *   useFlag: boolean ,
 *   moveReservationTimeList: Array<{
 *     uuid: string,
 *     maxMoveReservationCount: number,
 *     name: string,
 *     startTime: string,
 *     endTime: string,
 *     useFlag: boolean
 *   }>
 * }
 * @returns {Promise<Object>}
 */
export const putMoveHouseSetting = async ({ aptUuid, data }) => {
  const response = await auth.put(
    `/board/apt-admin/${aptUuid}/move/setting`,
    data,
  );

  return response;
};

/**
 * 이사 설정 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getMoveHouseSetting = async ({ aptUuid }) => {
  const response = await auth.get(`/board/apt-admin/${aptUuid}/move/setting`);

  return response;
};

/**
 * 이사 휴무일 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { startDate: "2024-07-01", endDate: "2024-07-10" }
 * @returns {Promise<Object>}
 */
export const postMoveHouseHoliday = async ({ aptUuid, data }) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/move/setting/move-holiday`,
    data,
  );

  return response;
};

/**
 * 이사 휴무일 리스트 조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @returns {Promise<Object>}
 */
export const getMoveHouseHolidayList = async ({ aptUuid }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/move/setting/move-holiday`,
  );

  return response;
};

/**
 * 이사 휴무일 삭제
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} uuid - 이사 휴무일 UUID
 * @returns {Promise<Object>}
 */
export const deleteMoveHouseHoliday = async ({ aptUuid, uuid }) => {
  const response = await auth.delete(
    `/board/apt-admin/${aptUuid}/move/setting/move-holiday/${uuid}`,
  );

  return response;
};

// 이사 예약 월별 조회
export const getMoveHouseReservationMonth = async ({ aptUuid, yearMonth }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/move/reservation/month`,
    {
      params: { yearMonth },
    },
  );

  return response;
};

// 이사 예약 일별 조회
export const getMoveHouseReservationDay = async ({ aptUuid, moveDate }) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/move/reservation/day`,
    {
      params: { moveDate },
    },
  );

  return response;
};

/**
 * 이사 예약 등록
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {Object} data - { moveType: MoveType(MOVE_IN, MOVE_OUT), aptResidentUuid: string, memo: string, moveDate: LocalDate, moveReservationTimeUuid: string, depositDate: LocalDate, depositorName: string }
 * @returns {Promise<Object>}
 */
export const postCreateMoveHouseReservation = async ({ aptUuid, data }) => {
  const response = await auth.post(
    `/board/apt-admin/${aptUuid}/move/reservation`,
    data,
  );

  return response;
};

/**
 * 이사 예약 상세조회
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} moveReservationUuid - 이사 예약 UUID
 * @returns {Promise<Object>}
 */
export const getMoveHouseReservationDetail = async ({
  aptUuid,
  moveReservationUuid,
}) => {
  const response = await auth.get(
    `/board/apt-admin/${aptUuid}/move/reservation/${moveReservationUuid}`,
  );

  return response;
};

/**
 * 이사 예약 확정
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} moveReservationUuid - 이사 예약 UUID
 * @param {Object} payload - {
 *   depositDate: LocalDate,
 *   depositorName: string,
 * }
 * @returns {Promise<Object>}
 */
export const patchMoveHouseReservationConfirm = async ({
  aptUuid,
  moveReservationUuid,
  data,
}) => {
  if (!aptUuid) {
    throw new Error('APT_UUID_REQUIRED');
  }
  const url = `/board/apt-admin/${aptUuid}/move/reservation/${moveReservationUuid}/status/confirmed`;
  const response = await auth.patch(url, data);

  return response;
};

/**
 * 이사 예약 취소
 *
 * @param {string} aptUuid - 아파트 UUID
 * @param {string} moveReservationUuid - 이사 예약 UUID
 * @param {Object} payload - {
 *   cancelReason: string,
 * }
 * @returns {Promise<Object>}
 */
export const patchMoveHouseReservationCancel = async ({
  aptUuid,
  moveReservationUuid,
  data,
}) => {
  if (!aptUuid) {
    throw new Error('APT_UUID_REQUIRED');
  }
  const url = `/board/apt-admin/${aptUuid}/move/reservation/${moveReservationUuid}/status/canceled`;
  const response = await auth.patch(url, data);

  return response;
};
