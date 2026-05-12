import { INVALID_VALUES } from '@/constants/common.js';

const validateQueryEnabledParams = (value) => {
  return !INVALID_VALUES.includes(value);
};

export default validateQueryEnabledParams;
