import { BOARD_COMPLAINT_STATUS } from '@/constants/board.js';

const findComplaintStatus = (value) => {
  const state = BOARD_COMPLAINT_STATUS.find((item) => item.key === value);

  return state;
};

export default findComplaintStatus;
