import he from 'he';

const decodeUrl = (url) => {
  if (!url) return null;

  // HTML 엔티티 디코딩
  const decodedHtml = he?.decode(url);

  // %XX 형식의 유효한 URI 인코딩이 있는지 체크
  const hasValidUriEncoding = /%[0-9A-Fa-f]{2}/.test(decodedHtml);

  // 유효한 URI 인코딩이 없으면 디코딩 시도하지 않음
  if (!hasValidUriEncoding) {
    return decodedHtml;
  }

  try {
    return decodeURIComponent(decodedHtml);
  } catch (error) {
    // 유효하지 않은 % 패턴이 있는 경우 HTML 디코딩된 문자열 반환
    return decodedHtml;
  }
};

export default decodeUrl;
