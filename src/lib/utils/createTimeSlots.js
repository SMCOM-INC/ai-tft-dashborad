const createTimeSlots = (type) => {
  const HOURS_IN_DAY = 24;
  const MINUTES_IN_HOUR = 60;

  const padNumber = (num) => num.toString().padStart(2, '0');

  // hours만 필요한 경우 (1시간 단위)
  if (type === 'hour') {
    return Array.from({ length: HOURS_IN_DAY }, (_, hour) => padNumber(hour));
  }

  // minutes만 필요한 경우 (1분 단위)
  if (type === 'minute') {
    return Array.from({ length: MINUTES_IN_HOUR }, (_, minute) =>
      padNumber(minute),
    );
  }

  // 기본값: 30분 단위 전체 시간
  return Array.from({ length: HOURS_IN_DAY }, (_, hour) =>
    Array.from(
      { length: 2 },
      (item, index) => `${padNumber(hour)}:${padNumber(index * 30)}`,
    ),
  ).flat();
};

export default createTimeSlots;
