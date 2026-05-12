import he from 'he';

const decodeUrlToParagraph = (url) => {
  if (!url) return null;

  try {
    const decodedHtml = he.decode(url);
    // Only try URI decoding if the string contains encoded characters
    if (decodedHtml.includes('%')) {
      const decodedUri = decodeURIComponent(decodedHtml);
      const contentWithLineBreaks = decodedUri.replace(/\n/g, '<br/>');
      return `<p>${contentWithLineBreaks}</p>`;
    }
    // If no URI encoding detected, just process the HTML decoded string
    const contentWithLineBreaks = decodedHtml.replace(/\n/g, '<br/>');
    return `<p>${contentWithLineBreaks}</p>`;
  } catch (error) {
    // Only log actual errors, not expected URI decode failures
    if (!(error instanceof URIError)) {
      console.warn('Unexpected error during decoding:', error);
    }
    // Fall back to simple HTML decoding
    const decodedHtml = he.decode(url);
    const contentWithLineBreaks = decodedHtml.replace(/\n/g, '<br/>');
    return `<p>${contentWithLineBreaks}</p>`;
  }
};

export default decodeUrlToParagraph;
