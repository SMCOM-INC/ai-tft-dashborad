const formatContact = (phone) => {
  if (!phone) return '';

  const cleanedContactHyphen = phone.replace(/\D/g, '').slice(0, 12);

  if (cleanedContactHyphen.length === 8) {
    return cleanedContactHyphen.replace(/^(\d{4})(\d{4})$/, '$1-$2');
  }

  if (cleanedContactHyphen.length === 12) {
    // 0505-1234-1234 형식 (안심번호)
    return cleanedContactHyphen.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  if (cleanedContactHyphen.length === 9) {
    // 02-111-1234 형식
    return cleanedContactHyphen.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  if (cleanedContactHyphen.length === 10) {
    if (cleanedContactHyphen.startsWith('02')) {
      // 02-1111-1111 형식
      return cleanedContactHyphen.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 010-123-4567 형식
    return cleanedContactHyphen.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  if (cleanedContactHyphen.length === 11) {
    // 010-1234-5678 형식
    return cleanedContactHyphen.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  return cleanedContactHyphen;
};

export default formatContact;
