import decodeUrl from '@/lib/utils/decodeUrl.js';

const parseEditorContent = (delta) => {
  if (!delta) return { ops: [] };

  // 문자열인 경우에만 파싱 수행
  if (typeof delta === 'string') {
    if (
      delta.startsWith('[{') ||
      delta.startsWith('{') ||
      delta.startsWith('{&quot;') ||
      delta.startsWith('[{&quot;')
    ) {
      try {
        const decodedDelta = decodeUrl(delta);
        const parsedContent = JSON.parse(decodedDelta);

        if (Array.isArray(parsedContent)) {
          return parsedContent;
        }

        if (parsedContent.ops) {
          return parsedContent.ops;
        }

        return parsedContent;
      } catch (error) {
        console.error('Error parsing delta:', error);
        return { ops: [] };
      }
    } else {
      return decodeUrl(delta);
    }
  }

  // 문자열도 객체도 아닌 경우
  return { ops: [] };
};

export default parseEditorContent;
