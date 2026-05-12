import { APARTMANT_CONTENT_LIST } from '@/constants/apt.js';

const findAptActiveContentList = (contentList) => {
  const serviceStatus = {
    hasParkingMenu: false,
    parkingMenuList: [],
    hasBoardMenu: true,
    boardMenuList: ['notice'],
    hasRepairMenu: false,
    repairMenuList: [],
    hasMovingMenu: false,
    movingMenuList: [],
    hasAptMenu: true,
    aptMenuList: ['apt-info'],
    hasVoteMenu: false,
    voteMenuList: [],
  };

  Object.keys(APARTMANT_CONTENT_LIST).forEach((key) => {
    contentList?.forEach((content) => {
      const foundItem = APARTMANT_CONTENT_LIST[key].find(
        (item) => item.uuid === content.uuid,
      );
      if (foundItem) {
        serviceStatus[`has${key.charAt(0).toUpperCase() + key.slice(1)}Menu`] =
          true;
        serviceStatus[`${key}MenuList`].push(foundItem.key);
      }
    });
  });

  return serviceStatus;
};

export default findAptActiveContentList;
