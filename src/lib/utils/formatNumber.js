const formatNumber = (number, options = {}) => {
  if (number === undefined || number === null) return '';
  const { thousandSeparator = ',', decimalPlaces = 0, unit = '' } = options;
  const formattedNumber = number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  return formattedNumber.replace('.', thousandSeparator) + unit;
};

export default formatNumber;
