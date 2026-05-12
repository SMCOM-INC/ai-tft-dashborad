/**
 * 시간 문자열을 분 단위로 변환
 * @param {string} timeStr - "HH:MM:SS" 형식의 시간 문자열
 * @returns {number} 분 단위 시간
 */
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = (timeStr || '00:00:00').split(':');
  return Number(hours) * 60 + Number(minutes);
};

/**
 * 00:00 ~ 00:00 시간대인지 확인
 * @param {Object} item - { startTime, endTime }
 * @returns {boolean}
 */
export const isZeroTimeSlot = (item) => {
  const start = timeToMinutes(item.startTime);
  const end = timeToMinutes(item.endTime);
  return start === 0 && end === 0;
};

/**
 * 시작 시간이 종료 시간보다 같거나 늦은지 검사
 * @param {Array} timeList - 시간대 목록
 * @returns {Object|null} 유효하지 않은 항목 또는 null
 */
export const findInvalidTimeOrder = (timeList) => {
  return timeList.find((item) => {
    if (isZeroTimeSlot(item)) return false;

    const start = timeToMinutes(item.startTime);
    const end = timeToMinutes(item.endTime);
    return start >= end;
  });
};

/**
 * 두 시간대가 겹치는지 확인
 * @param {Object} a - { startTime, endTime }
 * @param {Object} b - { startTime, endTime }
 * @returns {boolean}
 */
export const isTimeOverlap = (a, b) => {
  const start1 = timeToMinutes(a.startTime);
  const end1 = timeToMinutes(a.endTime);
  const start2 = timeToMinutes(b.startTime);
  const end2 = timeToMinutes(b.endTime);

  return start1 < end2 && end1 > start2;
};

/**
 * 시간대 목록에서 겹치는 항목이 있는지 검사
 * @param {Array} timeList - 시간대 목록
 * @returns {boolean}
 */
export const hasTimeOverlap = (timeList) => {
  return timeList.some((item, index) => {
    if (isZeroTimeSlot(item)) return false;

    return timeList.some((other, otherIndex) => {
      if (index >= otherIndex) return false;
      if (isZeroTimeSlot(other)) return false;

      return isTimeOverlap(item, other);
    });
  });
};

/**
 * 중복된 시간대가 있는지 검사
 * @param {Array} timeList - 시간대 목록
 * @returns {boolean}
 */
export const hasDuplicateTime = (timeList) => {
  const timeKeys = timeList.map(
    (item) => `${item.startTime}-${item.endTime}`,
  );
  const uniqueTimeKeys = new Set(timeKeys);
  return timeKeys.length !== uniqueTimeKeys.size;
};
