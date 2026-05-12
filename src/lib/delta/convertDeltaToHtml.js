import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

import decodeUrl from '@/lib/utils/decodeUrl.js';

const convertDeltaToHtml = (delta) => {
  // Delta 형식인 경우
  if (delta?.startsWith('[{') || delta?.startsWith('{')) {
    try {
      let processedDelta = delta
        .replace(/&quot;/g, '"')
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

      try {
        processedDelta = decodeUrl(processedDelta);
      } catch (e) {
        console.warn('URI decoding failed, using original string');
      }

      const parsedDelta = JSON.parse(processedDelta);

      // Custom image blot 처리
      if (parsedDelta.ops.some((op) => op.insert.customImage)) {
        parsedDelta.ops = parsedDelta.ops.map((op) => {
          if (op.insert.customImage) {
            op.insert = { image: op.insert.customImage.url };
          }
          return op;
        });
      }

      const converter = new QuillDeltaToHtmlConverter(
        Array.isArray(parsedDelta) ? parsedDelta : parsedDelta.ops,
        {},
      );
      return converter.convert();
    } catch (error) {
      console.error('내용 파싱 중 오류가 발생했습니다.', error);
      return null;
    }
  }

  // HTML 형식인 경우
  if (delta?.startsWith('<')) {
    return delta;
  }

  // 기본 text area 형식인 경우
  return delta?.replace(/\r\n/g, '<br>') || null;
};

export default convertDeltaToHtml;
