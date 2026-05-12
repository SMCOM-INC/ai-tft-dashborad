const formatMinutes = (totalMinutes) => {
  if (totalMinutes === null || totalMinutes === undefined) return null;

  const isNegative = totalMinutes < 0;
  const absMinutes = Math.abs(totalMinutes);

  const hours = Math.floor(absMinutes / 60);
  const minutes = Math.floor(absMinutes % 60);

  let result = '';

  if (hours > 0) {
    result = `${result} ${hours}시간 `;
  }

  result = `${result} ${minutes}분`;

  return isNegative ? `-${result.trim()}` : result.trim();
};

export default formatMinutes;
