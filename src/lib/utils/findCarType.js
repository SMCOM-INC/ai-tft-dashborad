import { CAR_TYPE } from '@/constants/parking.js';

const findCarType = (key) => {
  const finedType = CAR_TYPE.find((type) => type.key === key);
  return finedType?.label;
};

export default findCarType;
