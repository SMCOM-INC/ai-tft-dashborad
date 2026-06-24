const formatDate = (dateTimeString) => {
  if (!dateTimeString) {
    return { full: () => undefined, date: () => undefined };
  }
  const year = dateTimeString.slice(0, 4);
  const month = dateTimeString.slice(5, 7);
  const day = dateTimeString.slice(8, 10);
  const hours = dateTimeString.slice(11, 13);
  const minutes = dateTimeString.slice(14, 16);
  const seconds = dateTimeString.slice(17, 19);

  const full = () => {
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const date = () => {
    return `${year}-${month}-${day}`;
  };
  const time = () => {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return { full, date, time };
};

const formatDateObject = (dateObject, type) => {
  if (!dateObject) return '-';
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  if (type === 'hyphen') {
    return `${year}-${month}-${day}`;
  }

  if (type === 'korean') {
    return `${year}년 ${month}월 ${day}일`;
  }
};

const formatDateDayObject = (dateObject) => {
  const weekDay = ['일', '월', '화', '수', '목', '금', '토'][
    dateObject.getDay()
  ];
  return `${formatDateObject(dateObject)} (${weekDay})`;
};

const formatDateTimeObject = (dateTimeObject, param) => {
  if (!dateTimeObject) return null;
  const year = dateTimeObject.getFullYear();
  const month = (dateTimeObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateTimeObject.getDate().toString().padStart(2, '0');
  let hours;
  let minutes;
  let seconds;
  if (param === 'start') {
    hours = '00';
    minutes = '00';
    seconds = '00';
  } else if (param === 'end') {
    hours = '23';
    minutes = '59';
    seconds = '59';
  } else {
    hours = dateTimeObject.getHours().toString().padStart(2, '0');
    minutes = dateTimeObject.getMinutes().toString().padStart(2, '0');
    seconds = dateTimeObject.getSeconds().toString().padStart(2, '0');
  }
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const convertTimeStringToTimeObject = (timeString) => {
  if (!timeString)
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  const timeParts = timeString.split(':');
  return {
    hours: parseInt(timeParts[0], 10),
    minutes: parseInt(timeParts[1], 10),
    seconds: parseInt(timeParts[2], 10),
  };
};

const convertTimeObjectToTimeString = (timeObject, format = 'HH:mm:ss') => {
  if (!timeObject) return '';
  if (format === 'HH:mm') {
    return `${timeObject.hours.toString().padStart(2, '0')}:${timeObject.minutes
      .toString()
      .padStart(2, '0')}`;
  }
  if (format === 'HH:mm:ss') {
    return `${timeObject.hours.toString().padStart(2, '0')}:${timeObject.minutes
      .toString()
      .padStart(2, '0')}:${timeObject.seconds.toString().padStart(2, '0')}`;
  }
};

const getDateRange = (key, customRange = null) => {
  const now = new Date();

  const formatToLocalDate = (date) => {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const utcDate = new Date(date.getTime() - offset);
    return utcDate.toISOString().slice(0, 10);
  };

  const setStartOfDay = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const setEndOfDay = (date) => {
    date.setHours(23, 59, 59, 999);
    return date;
  };

  switch (key) {
    case 'thisYear': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

      return {
        startDate: formatToLocalDate(setStartOfDay(start)),
        endDate: formatToLocalDate(setEndOfDay(end)),
      };
    }
    case 'lastYear': {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

      return {
        startDate: formatToLocalDate(setStartOfDay(start)),
        endDate: formatToLocalDate(setEndOfDay(end)),
      };
    }
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      return {
        startDate: formatToLocalDate(setStartOfDay(start)),
        endDate: formatToLocalDate(setEndOfDay(end)),
      };
    }
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);

      return {
        startDate: formatToLocalDate(setStartOfDay(start)),
        endDate: formatToLocalDate(setEndOfDay(end)),
      };
    }
    case 'lastLastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - 1, 0);

      return {
        startDate: formatToLocalDate(setStartOfDay(start)),
        endDate: formatToLocalDate(setEndOfDay(end)),
      };
    }
    case 'custom': {
      if (!customRange || customRange.length !== 2) {
        return null;
      }
      const [startStr, endStr] = customRange;
      const start = new Date(startStr);
      const end = new Date(endStr);

      return {
        startDate: formatToLocalDate(setStartOfDay(start)),
        endDate: formatToLocalDate(setEndOfDay(end)),
      };
    }
    default:
      return null;
  }
};

const getDateTimeRange = (key, customRange = null) => {
  const now = new Date();

  const formatToLocalDateTime = (date) => {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const utcDate = new Date(date.getTime() - offset);
    return utcDate.toISOString().slice(0, 19).replace('T', ' ');
  };

  const setStartOfDay = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const setEndOfDay = (date) => {
    date.setHours(23, 59, 59, 999);
    return date;
  };

  switch (key) {
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      return {
        startDate: formatToLocalDateTime(setStartOfDay(start)),
        endDate: formatToLocalDateTime(end),
      };
    }
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);

      return {
        startDate: formatToLocalDateTime(setStartOfDay(start)),
        endDate: formatToLocalDateTime(setEndOfDay(end)),
      };
    }
    case 'lastLastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - 1, 0);

      return {
        startDate: formatToLocalDateTime(setStartOfDay(start)),
        endDate: formatToLocalDateTime(setEndOfDay(end)),
      };
    }
    case 'thisYear': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

      return {
        startDate: formatToLocalDateTime(setStartOfDay(start)),
        endDate: formatToLocalDateTime(setEndOfDay(end)),
      };
    }
    case 'lastYear': {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

      return {
        startDate: formatToLocalDateTime(setStartOfDay(start)),
        endDate: formatToLocalDateTime(setEndOfDay(end)),
      };
    }
    case 'custom': {
      if (!customRange || customRange.length !== 2) {
        return null;
      }
      const [startStr, endStr] = customRange;
      const start = new Date(startStr);
      const end = new Date(endStr);

      return {
        startDate: formatToLocalDateTime(setStartOfDay(start)),
        endDate: formatToLocalDateTime(setEndOfDay(end)),
      };
    }
    case 'all': {
      return {
        startDate: null,
        endDate: null,
      };
    }
    default:
      return null;
  }
};

const formatTimeToHHMM = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

// 날짜 문자열에서 시작/종료 시간 생성 (yyyy-MM-dd HH:mm:ss)
const toStartDateTime = (dateStr) => `${dateStr.slice(0, 10)} 00:00:00`;
const toEndDateTime = (dateStr) => `${dateStr.slice(0, 10)} 23:59:59`;

// 오늘 기준 한 달 전 Date (00:00:00) — 날짜 선택 가능 최소일
const getOneMonthAgoDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

// 최근 한 달 범위 ['yyyy-MM-dd'(한 달 전), 'yyyy-MM-dd'(오늘)]
const getRecentMonthRange = () => [
  formatDateObject(getOneMonthAgoDate(), 'hyphen'),
  formatDateObject(new Date(), 'hyphen'),
];

export {
  convertTimeStringToTimeObject,
  convertTimeObjectToTimeString,
  formatDate,
  formatDateDayObject,
  formatDateObject,
  getDateTimeRange,
  getDateRange,
  formatDateTimeObject,
  formatTimeToHHMM,
  toStartDateTime,
  toEndDateTime,
  getOneMonthAgoDate,
  getRecentMonthRange,
};
