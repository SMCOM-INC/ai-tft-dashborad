import { REGISTRATION_TYPE_WITH_STORE } from '@/constants/parking.js';

const findRegistType = (key) => {
  if (key) {
    const findType = REGISTRATION_TYPE_WITH_STORE.find(
      (type) => type.key === key,
    );

    return findType ? findType.label : undefined;
  }

  return undefined;
};

export default findRegistType;
