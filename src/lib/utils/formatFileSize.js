const formatFileSize = (bytes, options = {}) => {
  const {
    decimals = 2, // 소수점 자릿수
    base = 1024, // 변환 기준 (1024 또는 1000)
    showZero = true, // 0 bytes 표시 여부
    separator = ' ', // 숫자와 단위 사이 구분자
    units = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
  } = options;

  // 유효성 검사
  if (!Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes === 0) return showZero ? `0${separator}${units[0]}` : '';

  // 크기 계산
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(base)),
    units.length - 1,
  );

  // 단위 변환
  const size = parseFloat((bytes / base ** exponent).toFixed(decimals));
  const unit = units[exponent];

  return `${size}${separator}${unit}`;
};

export default formatFileSize;
