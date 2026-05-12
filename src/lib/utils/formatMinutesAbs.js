const formatMinutes = (totalMinutes) => {
  if (!totalMinutes) return { hours: 0, minutes: 0 };

  // 음수인 경우 부호 보존
  const sign = totalMinutes < 0 ? -1 : 1;
  const absMinutes = Math.abs(totalMinutes);

  const hours = Math.floor(absMinutes / 60) * sign;
  const minutes = Math.floor(absMinutes % 60) * sign;

  return { hours, minutes: Math.abs(minutes) };
};

export default formatMinutes;
